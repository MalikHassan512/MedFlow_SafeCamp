// Auth Navigation

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Login,
    SignUp,
    Reset,
    ConfirmCode
} from '../screens';
import {Strings} from '../constants'

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Strings.login}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={Strings.login} component={Login} />
      <Stack.Screen name={Strings.signUp} component={SignUp} />
      <Stack.Screen name={Strings.reset} component={Reset} />
      <Stack.Screen name={Strings.confirmCode} component={ConfirmCode} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
