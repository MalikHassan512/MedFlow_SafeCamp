import * as React from 'react';
import {CommonActions, DrawerActions, StackActions} from '@react-navigation/native';
export const navigationRef = React.createRef();

export async function navigateReset(name, params) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: name,
          params:params
        },
      ],
    }),
  );
}

export async function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export async function popScreen(){
  const popAction = StackActions.pop();
  navigationRef.current?.dispatch(popAction);
}
export async function openDrawer(){
  navigationRef.current.dispatch(DrawerActions.openDrawer());
}
export async function closeDrawer(){
  navigationRef.current.dispatch(DrawerActions.closeDrawer());
}
