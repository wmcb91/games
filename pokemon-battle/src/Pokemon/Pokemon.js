import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';
import './Pokemon.css';

class Pokemon extends Component {
  constructor(props) {
    super(props)
    this.startBattling = this.startBattling.bind(this);
    this.state = {
      battling: false,
      hpRemaining: this.props.pokemon.hpRemaining,
      hpBarPercent: (this.props.pokemon.hpRemaining / this.props.pokemon.startingHP) * 100
    }
  }

  stopBattling = () => {
    // let hpRemaining = Math.max(this.state.hpRemaining - this.props.pokemon.move.power, 0)
    // let startingHP = this.props.pokemon.startingHP;
    // this.setState({
    //   hpRemaining: hpRemaining,
    //   hpBarPercent: (hpRemaining / startingHP) * 100
    // })

    setTimeout(this.setState({
      battling: false
    }), 300);
    this.attackPokemon();
  }

  startBattling = () => {
    if (this.state.battling) {
      return;
    }
    this.setState({
      battling: true
    })
    setTimeout(this.stopBattling, 500);
  }

  attackPokemon = () => {
    this.props.damagePokemon(this.props.idx);
  }

  render() {
    const { name, sprites, move, hpBarPercent, hpRemaining } = this.props.pokemon;
    const className = 'Pokemon' + 
      (this.state.battling ? ' battling' : '') +
      (hpRemaining ? '' : ' unconcious');
    return (
      <div className={className} onClick={this.startBattling}>
        <h4>{name}</h4>
        <img className="sprite" alt={name} src={sprites.front_default} />
        <h5>Available Move: {move.name.replace('-', ' ')} ({move.power} Power)</h5>
        <h5>HP: {hpRemaining}</h5>
        <Progress style={{margin: '20px'}} percent={hpBarPercent} indicating={hpBarPercent > 0} /> 
      </div>
    );
  }
}

export default Pokemon;
