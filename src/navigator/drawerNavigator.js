import { createDrawerNavigator } from '@react-navigation/drawer';
import { IS_PAD } from '../constants';
import { AcculaNavigtor, AntigenNavigtor, CueNavigtor, LabNavigtor, MainNavigator, StartTestNavigator } from './mainNavigator';
import {
  CueTest,
  AcculaTests,
  RapidAntigenTest,
  LabTest,
  StartTest,
} from '../screens';
import React from 'react';
import { DrawerComponent } from '../components';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName={'Main'}
      useLegacyImplementation={true}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: IS_PAD ? "42.5%" : "72.5%",
        },

      }}
      drawerContent={props => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Main" component={MainNavigator} />
      <Drawer.Screen name="CueTest" component={CueNavigtor} />
      <Drawer.Screen name="StartTest" component={StartTestNavigator} />
      <Drawer.Screen name="AcculaTests" component={AcculaNavigtor} />
      <Drawer.Screen name="RapidAntigenTest" component={AntigenNavigtor} />
      <Drawer.Screen name="LabTest" component={LabNavigtor} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
