import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import styles from './styles';
import { Colors, ICON_CONSTANTS } from '../../constants';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';

const Header = props => {
  const {
    title,
    add,
    refresh,
    onPrinterPress,
    onAddPress,
    onRefreshPress,
    subHeader,
    isInsurance,
    onPressRightIcon
  } = props;

  const navigation = useNavigation();
  const isDrawerOpen = useDrawerStatus();

  const openDrawer = () => {
    // navigation.openDrawer();
    console.log('drawer current status is: ', isDrawerOpen);
    try {
      navigation.dispatch(DrawerActions.openDrawer());
      Keyboard.dismiss();
      // console.log('navigator button pressed');
    } catch (e) {
      console.log('drawer open error: ', e);
    }
  };
  const refreshHandler = () => {
    if (onRefreshPress) {
      onRefreshPress();
    }
  };
  const addPressHandler = () => {
    if (onAddPress) {
      onAddPress();
    } else {
      navigation.navigate('StartTest');
    }
  };

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.titleText,
              isInsurance && styles.insuranceTextHeader,
            ]}
          >
            {title}
          </Text>
          {subHeader && <Text style={styles.subHeader}>{subHeader}</Text>}
        </View>
      )}
      <TouchableOpacity onPress={isInsurance ? onPressRightIcon : openDrawer} style={{ zIndex: 2 }}>
        <ICON_CONSTANTS.IonIcons style={styles.menuIcon} color={isInsurance ? Colors.WHITE.default : Colors.PINK.default} name={isInsurance ? "arrow-back-outline" : 'menu'} />
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {refresh && (
          <TouchableOpacity onPress={refreshHandler}>
            <ICON_CONSTANTS.EvilIcon color={Colors.PINK.default} style={styles.menuIcon} name={'refresh'} />
          </TouchableOpacity>
        )}
        {add && (
          <TouchableOpacity onPress={addPressHandler}>
            <ICON_CONSTANTS.AntDesign color={Colors.PINK.default} style={styles.menuIcon} name={'plus'} />
          </TouchableOpacity>
        )}
        {onPrinterPress && (
          <TouchableOpacity onPress={onPrinterPress}>
            <ICON_CONSTANTS.AntDesign
              style={styles.printerIcon}
              name={'printer'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
