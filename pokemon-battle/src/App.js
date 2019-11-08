import React, { Component } from 'react';
import { Button, Progress } from 'semantic-ui-react';
import pokemonIds from './pokemon';
import PokemonTeam from './Pokemon/PokemonTeam';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      playersSelected: false,
      battleStarted: false,
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

  startBattle = async () => {
    const pokemonCount = pokemonIds.length;
    this.setState({
      loading: true
    })
    for (let i=0; i < 5; i++) {
      let playerOnePokemonId = Math.ceil(Math.random() * pokemonCount);
      let playerTwoPokemonId = Math.ceil(Math.random() * pokemonCount);
      let playerOnePokemonReq = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${playerOnePokemonId}`
      );
      let playerTwoPokemonReq = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${playerTwoPokemonId}`
      );
      let playerOnePokemon = await playerOnePokemonReq.json();
      let playerTwoPokemon = await playerTwoPokemonReq.json();
      this.state.playerOne.pokemon.push(playerOnePokemon);
      this.state.playerTwo.pokemon.push(playerTwoPokemon);
      this.setState({
        loadingPercent: (i + 1) * 20,
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
      loading: false
    })
  }

  render() {
    const teamOnePokemon = this.state.playerOne.pokemon;
    const teamTwoPokemon = this.state.playerTwo.pokemon;
    const pokeTeams = (
      <div className="battle-ground">
        <PokemonTeam playerName={this.state.playerOne.name} team={teamOnePokemon} side={'left'}/>
        <PokemonTeam playerName={this.state.playerTwo.name} team={teamTwoPokemon} side={'right'}/>
      </div>
    );
    if (teamTwoPokemon.length > 4) {
      console.log(teamTwoPokemon);
    }
    return (
      <div className="App">
        <header className="App-header">
          <h3>Pokemon Battle</h3>
        </header>
        <main>
          {!this.state.loading && teamTwoPokemon.length !== 5 ?
          <Button content="Start Battle" primary onClick={this.startBattle} /> :
          ''
          }
          {this.state.loading ? 
            <Progress style={{margin: '20px'}} percent={this.state.loadingPercent} indicating /> : ''}
          {!this.state.loading && teamTwoPokemon.length === 5 ? pokeTeams : ''}
        </main>
      </div>
    );
  }
}

export default App;
