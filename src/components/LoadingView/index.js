import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors} from '../../constants';

const LoadingView = props => {
  const {size, color} = props;
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size ? size : 'large'}
        color={color ? color : Colors.PINK.default}
      />
    </View>
  );
};

export default LoadingView;

const styles = new StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
