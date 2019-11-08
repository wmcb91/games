import React, { Component } from 'react';
import Pokemon from './Pokemon';
import './PokemonTeam.css';

class PokemonTeam extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const pokemons = this.props.team.map((pokemon, i) => (
      <Pokemon key={pokemon.id + '-' + i} pokemon={pokemon} />
    ));
    const className = "Team " + this.props.side;
    return (
      <div className={className}>
        <h3>{this.props.playerName}</h3>
        {pokemons}
      </div>
    );
  }
}

export default PokemonTeam;
