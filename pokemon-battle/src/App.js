import React, { Component } from 'react';
import { Button, Progress } from 'semantic-ui-react';
import pokemon from './pokemon';
import nonDamageMoves from './nonDamageMoves';
import Battleground from './Battleground';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      playersSelected: false,
      battleStarted: false,
      battleReady: false,
      loading: false,
      loadingPercent: 0,
      playerOne: {
        name: 'Player 1',
        pokemon: []
      },
      playerTwo:  {
        name: 'Player 2',
        pokemon: []
      }
    }
  }

  findMove = async (pokemon) => {
    let powerMove = false;
    let move = null;
    pokemon.moves = pokemon.moves.filter(m => !nonDamageMoves.includes(m.name));
    while (!powerMove) {
      let pokemonMoveIdx = Math.floor(Math.random() * pokemon.moves.length);
      if (pokemon.moves[pokemonMoveIdx].url) {
        let pokemonMoveCall = await fetch(pokemon.moves[pokemonMoveIdx].url)
        move = await pokemonMoveCall.json();
        if (move.power) {
          powerMove = true;
        }
      }
    }
    return {
      accuracy: move.accuracy,
      power: move.power,
      pp: move.pp,
      name: move.name,
    };
  }

  getRandPokemon = async () => {
    // Remove ditto because it has no damage moves
    const validPokemon = pokemon.filter(p => p.name !== 'ditto');
    const pokemonCount = validPokemon.length;
    let pokemonIdx = Math.floor(Math.random() * pokemonCount);
    let poke = JSON.parse(JSON.stringify(validPokemon[pokemonIdx]));
    poke.move = await this.findMove(poke);
    return poke;
  }

  startBattle = async () => {
    this.setState({
      loading: true
    })

    const p1PokeNames = [];
    const p2PokeNames = [];

    while (this.state.playerOne.pokemon.length < 5 && this.state.playerTwo.pokemon.length < 5) {
      let pk1 = await this.getRandPokemon();
      let pk2 = await this.getRandPokemon();
      pk1.startingHP = pk1.stats.find(s => s.stat.name === 'hp').base_stat * 2;
      pk1.hpRemaining = pk1.startingHP;
      pk1.hpBarPercent = 100;
      pk2.startingHP = pk2.stats.find(s => s.stat.name === 'hp').base_stat * 2;
      pk2.hpRemaining = pk2.startingHP;
      pk2.hpBarPercent = 100;

      if (!p1PokeNames.includes(pk1.name)) {
        this.state.playerOne.pokemon.push(pk1);
        p1PokeNames.push(pk1.name);
      }
      if (!p2PokeNames.includes(pk2.name)) {
        this.state.playerTwo.pokemon.push(pk2);
        p2PokeNames.push(pk2.name);
      }
      
      this.setState({
        loadingPercent: (this.state.playerTwo.pokemon.length + 1) * 20,
        playerOne: {
          name: this.state.playerOne.name,
          pokemon: this.state.playerOne.pokemon
        },
        playerTwo:  {
          name: this.state.playerTwo.name,
          pokemon: this.state.playerTwo.pokemon
        }
      })
    }
    this.setState({
      loading: false,
      battleReady: true
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h3>{this.state.battleReady ? 'Every Pokemon is Confused' : 'Pokemon Battle'}</h3>
        </header>
        <main>
          {
            !this.state.loading && !this.state.battleReady ?
              <Button content="Start Battle" primary onClick={this.startBattle} /> :
              ''
          }
          {
            this.state.loading ? 
              <Progress style={{margin: '20px'}} percent={this.state.loadingPercent} indicating /> :
              null
          }
          {
            this.state.battleReady ? 
              <Battleground 
                playerOne={this.state.playerOne} 
                playerTwo={this.state.playerTwo}
              /> : null
          }
        </main>
      </div>
    );
  }
}

export default App;
