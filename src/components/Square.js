import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PropTypes from 'prop-types';

class Square extends Component {

  constructor(props) {
    super(props);
  }

  getSquareClass (player) {
    if (player.selected) {
      return (player.value === 'X') ? styles.squareplayerx : styles.squareplayero
    } else if (this.props.disable) {
      return styles.squarepdisabled
    }

    return {}
  }

  render () {
    return (
        <TouchableOpacity onPress={this.props.onMove} disabled={this.props.disable || this.props.value.selected}>
            <View style={[styles.square, this.getSquareClass(this.props.value)]}>
                {(this.props.value.selected) ? <FontAwesome name={(this.props.value.value === 'X') ? 'times' : 'circle-o'} style={styles.squareplayericon} /> : <View />}
            </View>
        </TouchableOpacity>
    )
  }
}

Square.propTypes = {
  value: PropTypes.shape({
    selected: PropTypes.bool,
    value: PropTypes.string
  }).isRequired,
  onMove: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    square: {
        backgroundColor: '#78bec5',
        borderRadius: 9,
        height: 90,
        margin: 3,
        width: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    squarepdisabled: {
      backgroundColor: 'grey'
    },
    squareplayerx: {
        backgroundColor: '#dc685a',
    },
    squareplayericon: {
        color: '#fff',
        fontSize: 60
    },
    squareplayero: {
        backgroundColor: '#ecaf4f'
    },
});

export default Square
