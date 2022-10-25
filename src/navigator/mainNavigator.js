// Auth Navigation

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  EventConfig,
  Scanner,
  FormInput,
  TestSelection,
  SignatureScreen,
  MyQR,
  EmployeeListing,
  MyResult,
  Filters,
  InsuranceCardImages,
  Questions, StartTest, RapidAntigenTest, LabTest, AcculaTests, CueTest
} from '../screens';
const Stack = createStackNavigator();

export function MainNavigator({navigation, route}) {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Home" component={EventConfig} />
      <Stack.Screen name="StartTest" component={StartTestNavigator} />
      <Stack.Screen name="MyQR" component={CrewNavigator} />
      <Stack.Screen name="CueTest" component={CueNavigtor} />
      <Stack.Screen name="AcculaTests" component={AcculaNavigtor} />
      <Stack.Screen name="RapidAntigenTest" component={AntigenNavigtor} />
      <Stack.Screen name="LabTest" component={LabNavigtor} />
      {/* <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="FormInput" component={FormInput} />
      <Stack.Screen name="EmployeeListing" component={EmployeeListing} />
      <Stack.Screen name="TestSelection" component={TestSelection} />
      <Stack.Screen name="Signature" component={SignatureScreen} />
      <Stack.Screen name="MyQR" component={MyQR} />
      <Stack.Screen name="MyResult" component={MyResult} />
      <Stack.Screen name="Filters" component={Filters} />
      <Stack.Screen name="Questions" component={Questions} /> */}
      {/* <Stack.Screen
        name="InsuranceCardImages"
        component={InsuranceCardImages}
      /> */}
    </Stack.Navigator>
  );
}
export function CrewNavigator({navigation, route}) {
  return (
    <Stack.Navigator
      initialRouteName={'MyQR'}
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="MyQR" component={MyQR} />
      <Stack.Screen name="MyResult" component={MyResult} />
      <Stack.Screen name="Filters" component={Filters} />
    </Stack.Navigator>
  );
}


export function StartTestNavigator({navigation, route}) {
  return (
    <Stack.Navigator
      initialRouteName={'StartTest'}
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Home" component={EventConfig} />
      <Stack.Screen name="StartTest" component={StartTest} />
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="FormInput" component={FormInput} />
      <Stack.Screen name="EmployeeListing" component={EmployeeListing} />
      <Stack.Screen name="TestSelection" component={TestSelection} />
      <Stack.Screen name="Signature" component={SignatureScreen} />
      <Stack.Screen name="MyQR" component={MyQR} />
      <Stack.Screen name="MyResult" component={MyResult} />
      <Stack.Screen name="Filters" component={Filters} />
      <Stack.Screen name="Questions" component={Questions} />
      <Stack.Screen
        name="InsuranceCardImages"
        component={InsuranceCardImages}
      />
    </Stack.Navigator>
  );
}

export function AntigenNavigtor({navigation, route}) {
  return (
    <Stack.Navigator
      initialRouteName={'RapidAntigenTest'}
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="RapidAntigenTest" component={RapidAntigenTest} />
      <Stack.Screen name="StartTest" component={StartTestNavigator} />
    </Stack.Navigator>
  );
}
export function CueNavigtor({navigation, route}) {
  return (
    <Stack.Navigator
      initialRouteName={'CueTest'}
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="CueTest" component={CueTest} />
      <Stack.Screen name="StartTest" component={StartTestNavigator} />
    </Stack.Navigator>
  );
}
export function AcculaNavigtor({navigation, route}) {
  return (
    <Stack.Navigator
      initialRouteName={'AcculaTests'}
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="AcculaTests" component={AcculaTests} />
      <Stack.Screen name="StartTest" component={StartTestNavigator} />
    </Stack.Navigator>
  );
}
export function LabNavigtor({navigation, route}) {
  return (
    <Stack.Navigator
      initialRouteName={'LabTest'}
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="LabTest" component={LabTest} />
      <Stack.Screen name="StartTest" component={StartTestNavigator} />
    </Stack.Navigator>
  );
}


