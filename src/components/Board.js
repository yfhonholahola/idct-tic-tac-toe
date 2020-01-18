import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Square from './Square'

class Board extends Component {

  constructor(props) {
    super(props);
  }  

  renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={this.props.gameMatrix[i]}
        onMove={() => this.props.onMove(i)}
        disable={this.props.disabled}
      />
    )
  }
  render () {
    return (
      <View style={styles.board}>
        <View style={styles.row}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </View>
        <View style={styles.row}>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </View>
        <View style={styles.row}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </View>
      </View>
    )
  }
}

Board.propTypes = {
  gameMatrix: PropTypes.arrayOf(PropTypes.shape({
    selected: PropTypes.bool,
    value: PropTypes.string
  })).isRequired,
  onMove: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    board: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
    }
});

export default Board
