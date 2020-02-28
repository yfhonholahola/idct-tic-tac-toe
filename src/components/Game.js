import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Board from './Board'
import { exitGame, makeMove, resetGame } from "../redux/actions";
// import { createGame, exitGame, makeMove, resetGame } from "../redux/actions";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { nestedArrayDeepCopy } from '../utils/CommonUtils'

class Game extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor (props) {
    super(props)
  }

  componentDidMount() {
    // this.props.createGame();
  }

  componentWillUnmount() {
    //this.props.exitGame();
  }

  onMove = (position) => {
    let gameMatrix = nestedArrayDeepCopy(this.props.gameMatrix)
    if (this.props.gameMatrix[position] && this.props.gameMatrix[position].selected) {
      return
    }

    gameMatrix[position] = {value: this.props.symbol, selected: true}
    this.props.makeMove({...gameMatrix})
  }

  render () {
    const winmsg = !!this.props.result && this.props.result === 'DRAW' ? 'DRAW' : this.props.result === this.props.symbol ? 'You win' : !!this.props.symbol ? 'You lose' : `Player - ${this.props.result} Wins`
    return (
        <View style={styles.container}>
          { !!this.props.turn ?
              !!this.props.symbol
              ? <Text style={styles.label}>Player - <Text style={{color: (this.props.symbol === 'X' ? '#dc685a': '#ecaf4f')}}>{this.props.symbol}</Text></Text>
              : <Text style={styles.label}>Viewer</Text>
            : <View />
          }
          <Board gameMatrix={this.props.gameMatrix} onMove={(position) => this.onMove(position)} disabled={(!this.props.turn && !this.props.opponent) || this.props.turn !== this.props.symbol || !!this.props.result} />
          {
            !!this.props.result && !!this.props.symbol &&
            <View>
              <TouchableOpacity style={styles.buttonContainer} onPress={this.props.resetGame}>
                <Text style={styles.text}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: 'white', borderColor: 'black', borderWidth: 1}]} onPress={this.props.exitGame}>
                <Text>Exit</Text>
              </TouchableOpacity>                            
            </View>
          }
          {!!this.props.result && Alert.alert('Game End', winmsg)}          
        </View>        
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  gameMatrix: state.game.moves,
  symbol: state.game.symbol,
  opponent: state.game.game,
  turn: state.game.turn,
  result: state.game.result
});

const mapDispatchToProps = dispatch => {
  return {
    exitGame: () => dispatch(exitGame()),
    makeMove: payload => dispatch(makeMove(payload)),
    resetGame: () => dispatch(resetGame()),
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    label: {
      fontSize: 50,
      justifyContent: 'flex-end',
      textAlign: 'center',
      marginTop: 100
    },
    buttonContainer: {
      height: 45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 20,
      width: 100,
      borderRadius: 30,
      backgroundColor: 'red',
    },
    text: {
      color: 'white',
    }
});

Game.propTypes = {
  gameMatrix: PropTypes.arrayOf(PropTypes.shape({
    selected: PropTypes.bool,
    value: PropTypes.string
  })).isRequired,
  symbol: PropTypes.string,
  opponent: PropTypes.string,
  turn: PropTypes.string,
  result: PropTypes.string,
  // createGame: PropTypes.func.isRequired,
  exitGame: PropTypes.func.isRequired,
  makeMove: PropTypes.func.isRequired,
  resetGame: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
