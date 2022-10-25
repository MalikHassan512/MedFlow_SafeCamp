import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import styles from './styles';
import {App_Constants, Colors} from '../../constants';

const ButtonSmall = ({onPress, title, disabled}) => {
  return (
    <TouchableOpacity
        disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        title === App_Constants.NEGATIVE && {
          backgroundColor: Colors.GREEN.button,
        },
      ]}>
      <Text
        style={[
          styles.buttonText,
          title === App_Constants.NEGATIVE && {
            color: Colors.GREEN.dark,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonSmall;
