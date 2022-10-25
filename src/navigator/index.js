// App Navigator

import React, {useEffect, useContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './authNavigator';
import {Strings} from '../constants';
import {navigationRef} from './navigationRef';
import {LoaderContext} from '../components/hooks';
import DrawerNavigator from './drawerNavigator';

const Stack = createStackNavigator();
const AppNavigator = () => {
  const {setlogInErr, logInErr} = useContext(LoaderContext);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={Strings.authNavigator}
        screenOptions={{headerShown: false}}
        screenListeners={{
          state: e => {
            // Do something with the state
            if (logInErr !== '') setlogInErr('');
          },
        }}
      >
        {/* {isUserLoggedIn ? ( */}
        <Stack.Screen name={Strings.drawerNavigator} component={DrawerNavigator} />
        {/* ) : ( */}
        <Stack.Screen name={Strings.authNavigator} component={AuthNavigator} />
        {/* )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
