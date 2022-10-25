import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import styles from './styles';
import {Colors} from '../../constants';

const Button = props => {
  const {onPress, title, disabled, loading, buttonStyle} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        disabled && {backgroundColor: Colors.PINK.disabled},
        buttonStyle,
      ]}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text
          style={[
            styles.titleText,
            !disabled && {color: Colors.WHITE.default},
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
