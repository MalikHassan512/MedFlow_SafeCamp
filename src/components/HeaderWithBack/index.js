import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import styles from './styles';
import {Colors, ICON_CONSTANTS, wp, IS_PAD} from '../../constants';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const HeaderWithBack = props => {
  const {
    title,
    onBackPress,
    onSwitchPress,
    switchVal,
    rightText,
    onRightBtnPress,
    hideSwitch
  } = props;

  const navigation = useNavigation();

  const backHandler = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
      )}
      <TouchableOpacity onPress={backHandler} style={styles.backButton}>
        <ICON_CONSTANTS.IonIcons
          size={IS_PAD ? 40: 32}
          name={'arrow-back-outline'}
          color={Colors.WHITE.primary}
        />
      </TouchableOpacity>

      {onSwitchPress && !hideSwitch && (
        <Switch
          style={{marginRight: wp(3)}}
          onValueChange={onSwitchPress}
          value={switchVal}
        />
      )}

      {rightText && (
        <TouchableOpacity onPress={onRightBtnPress}>
          <Text style={styles.rightText}>{rightText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HeaderWithBack;
