import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { connectGame, receiveMenu, createGame, joinGame } from "../redux/actions";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

class Menu extends Component {
    static navigationOptions = {
        headerShown: false,
    };    

    constructor(props) {
      super(props);
      this.state = {
          data: [
              // {
              //   id: '1',
              //   label: 'Read the Expo documentation'
              // },
              // {
              //   id: '2',
              //   label: 'Read the Expo documentation2'
              // },
              // {
              //   id: '3',
              //   label: 'Read the Expo documentation3'
              // },
              // {
              //   id: '4',
              //   label: 'Read the Expo documentation4'
              // },
              // {
              //   id: '5',
              //   label: 'Read the Expo documentation5'
              // },
              // {
              //   id: '6',
              //   label: 'Read the Expo documentation6'
              // },
              // {
              //   id: '7',
              //   label: 'Read the Expo documentation7'
              // },
              // {
              //   id: '8',
              //   label: 'Read the Expo documentation8'
              // },
              // {
              //   id: '9',
              //   label: 'Read the Expo documentation9'
              // }              
          ]
      }
    }

    componentDidMount() {
      this.props.connectGame()
      // this.props.receiveMenu()
    }    
  
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} nestedScrollEnabled>
                    <FlatList
                        data={this.props.rooms || []}
                        renderItem={({ item }) => <OptionButton label={item.name} onPress={() => this.props.joinGame({id: item.id})} />}
                        keyExtractor={item => item.id}
                    />

                </ScrollView>
                
                <View style={styles.buttonContainer}>
                    <RectButton onPress={this.props.createGame}>
                        <Ionicons name="md-add-circle" size={60} />
                    </RectButton>                
                </View>
            </View>
        )
    }
}

function OptionButton({ label, onPress, isLastOption }) {
    return (
      <RectButton style={styles.option} onPress={onPress}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.optionTextContainer, { flex: 1}}>
            <Text style={styles.optionText}>{label}</Text>
          </View>
          <View style={styles.optionIconContainer}>
            <Ionicons name="ios-arrow-dropright-circle" size={22} />
          </View>          
        </View>
      </RectButton>
    );
}

const mapStateToProps = (state, ownProps) => ({
  rooms: state.menu.rooms,
  roomCount: state.menu.roomCount
});
  
const mapDispatchToProps = dispatch => {
    return {
      connectGame: () => dispatch(connectGame()),
      receiveMenu: () => dispatch(receiveMenu()),
      createGame: payload => dispatch(createGame(payload)),
      joinGame: payload => dispatch(joinGame(payload))
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#B0E0E6',
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
      paddingTop: 45,
    },
    optionIconContainer: {
      marginRight: 12,
    },
    option: {
      backgroundColor: '#fdfdfd',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: 0,
      borderColor: '#ededed',
      marginHorizontal: 15,
      borderRadius: 10,
      marginBottom: 15
    },
    optionText: {
      fontSize: 15,
      alignSelf: 'flex-start',
      marginTop: 1,
    },
    buttonContainer: {        
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: 15
    }
});

Menu.propTypes = {
    rooms: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      players: PropTypes.objectOf(PropTypes.any),
      name: PropTypes.string,
      unmatched: PropTypes.string
    })),
    connectGame: PropTypes.func.isRequired,
    receiveMenu: PropTypes.func.isRequired,
    createGame: PropTypes.func.isRequired,
    joinGame: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);