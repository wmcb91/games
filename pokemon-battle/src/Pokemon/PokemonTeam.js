import React, { Component } from 'react';
import Pokemon from './Pokemon';
import './PokemonTeam.css';

class PokemonTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  attackOtherPokemon = (idx) => {
    this.props.damagePokemon(this.props.player, idx);
  }

  render() {
    const pokemons = this.props.team.map((pokemon, i) => (
      <Pokemon
        key={pokemon.id + '-' + i} 
        pokemon={pokemon} 
        damagePokemon={this.attackOtherPokemon}
        idx={i}
      />
    ));
    const className = "Team " + this.props.side;
    return (
      <div className={className}>
        <h3>{this.props.player.name}</h3>
        {pokemons}
      </div>
    );
  }
}

export default PokemonTeam;
