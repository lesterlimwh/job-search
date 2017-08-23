import React from 'react';
import { Constants, Notifications } from 'expo';
import { StyleSheet, View, Platform, Alert } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

import registerForNotifications from './services/push_notifications';
import store from './store';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import ReviewScreen from './screens/ReviewScreen';
import SettingsScreen from './screens/SettingsScreen';

export default class App extends React.Component {
  componentDidMount() {
    // ask user for push notifications permissions
    registerForNotifications();
    // callback for every time user receives push notifications
    Notifications.addListener((notification) => {
      // advanced ES6 destructuring for const text = notification.data.text;
      const { data: { text }, origin } = notification;

      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text: 'Ok.' }]
        );
        // do any additional logic here! 
      }
    });
  }

  render() {
    // Configuration for Tab Navigators
    // nested navigators in Android only work if lazy is true
    const AppNavigatorConfig = {
      navigationOptions: {
        tabBarVisible: false
      },
      lazy: true,
      tabBarPosition: 'bottom',
      swipeEnabled: false
    };

    const MainNavigatorConfig = {
      lazy: true,
      tabBarPosition: 'bottom',
      swipeEnabled: false,
      tabBarOptions: {
        labelStyle: { fontSize: 12 }
      }
    };

    // Navigator for the review flow
    const ReviewNavigator = StackNavigator({
      review: { screen: ReviewScreen },
      settings: { screen: SettingsScreen }
    });

    // Navigator for the main flow
    const MainNavigator = TabNavigator({
      map: { screen: MapScreen },
      deck: { screen: DeckScreen },
      review: { screen: ReviewNavigator }
    }, MainNavigatorConfig);

    // Default navigator
    const AppNavigator = TabNavigator({
      welcome: { screen: WelcomeScreen },
      auth: { screen: AuthScreen },
      main: { screen: MainNavigator }
    }, AppNavigatorConfig);

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : undefined
  },
});
