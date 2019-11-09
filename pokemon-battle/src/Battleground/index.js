import React, { Component } from 'react';
import PokemonTeam from '../Pokemon/PokemonTeam';

class Battleground extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerOne: this.props.playerOne, 
      playerTwo: this.props.playerTwo, 
    }
  }
  
  damagePokemon = (player, idx) => {
    let attackingPlayer = player;
    let attackedPlayer = this.state.playerOne.name === player.name ? this.state.playerTwo : this.state.playerOne;
    let attackedPlayerKey = this.state.playerOne.name === player ? 'playerTwo' : 'playerOne';
    let attackedPokemon = attackedPlayer.pokemon[idx];
    let attackingPokemon = attackingPlayer.pokemon[idx];
    attackedPokemon.hpRemaining = Math.max(attackedPokemon.hpRemaining - attackingPokemon.move.power, 0);
    attackedPokemon.hpBarPercent = (attackedPokemon.hpRemaining / attackedPokemon.startingHP) * 100;
    attackedPlayer.pokemon[idx] = attackedPokemon;
    this.setState({
      [attackedPlayerKey]: {
        name: attackedPlayer.name,
        pokemon: attackedPlayer.pokemon
      }
    })
  }
  

  render() {
    return (
      <div className="battle-ground">
        <PokemonTeam
          player={this.state.playerOne}
          team={ this.state.playerOne.pokemon} 
          side={'left'}
          damagePokemon={this.damagePokemon}
        />
        <PokemonTeam
          player={this.state.playerTwo}
          team={this.state.playerTwo.pokemon} 
          side={'right'}
          damagePokemon={this.damagePokemon}
        />
      </div>
    );
  }
}

export default Battleground;
