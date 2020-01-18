import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import Navigation from './src/navigation'
import NavigationService from './src/utils/NavigationService'

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Navigation ref={navigatorRef => {NavigationService.setTopLevelNavigator(navigatorRef);}} />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
