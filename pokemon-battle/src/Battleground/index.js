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

  render() {
    const teamOnePokemon = this.state.playerOne.pokemon;
    const teamTwoPokemon = this.state.playerTwo.pokemon;
    return (
      <div className="battle-ground">
        <PokemonTeam 
          playerName={this.state.playerOne.name} 
          team={teamOnePokemon} 
          side={'left'}
        />
        <PokemonTeam 
          playerName={this.state.playerTwo.name} 
          team={teamTwoPokemon} 
          side={'right'}
        />
      </div>
    );
  }
}

export default Battleground;
