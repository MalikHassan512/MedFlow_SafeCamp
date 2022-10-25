import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../constants';
import styles from './styles';

const CheckBox = props => {
  const {title, checked,onPress,containerStyle} = props;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container,containerStyle]}>
      <View
        style={[
          styles.checkBox,
          checked && {backgroundColor: Colors.WHITE.primary},
        ]}
      >
        {checked && (
          <Entypo name="check" color={Colors.BLACK.background} size={22} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
