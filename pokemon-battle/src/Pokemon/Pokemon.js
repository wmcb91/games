import React, { Component } from 'react';
import './Pokemon.css';

class Pokemon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      battling: false
    }
  }

  toggleBattling = () => {
    this.setState({
      battling: !this.state.battling
    })
  }

  render() {
    const { name, sprites, moves, height } = this.props.pokemon;
    const className = 'Pokemon' + (this.state.battling ? ' battling' : '');
    return (
      <div className={className} onClick={this.toggleBattling}>
        <h4>{name}</h4>
        <img className="sprite" src={sprites.front_default} />
      </div>
    );
  }
}

export default Pokemon;
