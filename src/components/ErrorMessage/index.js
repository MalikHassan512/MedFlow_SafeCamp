import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import { Colors } from '../../constants';

const ErrorMessage = props => {
  const { myErrorMsg, signup, alignStart } = props;
  if (myErrorMsg != '') {
    return (
      <View style={signup ? styles.signupError : alignStart ? styles.alignStart : styles.container}>
        <Text style={styles.errorStyles}>{myErrorMsg}</Text>
      </View>
    );
  } else return null;
};

export default ErrorMessage;
