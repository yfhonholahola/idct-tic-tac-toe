import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../components/Login';
import Game from '../components/Game';
import Menu from '../components/Menu';

const navigator = createStackNavigator({
    Login: { screen: Login },
    Game: { screen: Game },
    Menu: { screen: Menu }
});
  
const MainNavigator = createAppContainer(navigator);

export default MainNavigator;