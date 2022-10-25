import React from 'react';
import styles from './styles';
import CountDown from 'react-native-countdown-component';
import {View} from 'react-native';
import {Colors, IS_PAD} from '../../constants';

const Counter = props => {
  const {time, onFinish, onChange, onFirstAlert, totalTime, firstAlertTime, test} = props;

  // console.log('test time received is: ', time)
  // console.log('test total time is: ', totalTime)
  // console.log('test first alert time is: ', firstAlertTime)
  return (
    <View style={styles.timerTextContainer}>
      <CountDown
        until={time}
        size={IS_PAD ? 20 : 16}
        // onChange={onChange}
        onChange={(e) => {
            // if (e <= props.firstAlert + 0.5 && e > props.firstAlert - 0.5) {
            //     props.onWarnTester(test, false);
            // }
            // console.log('on counter change: e value is: ', e)
            if(e < firstAlertTime) {
                onFirstAlert(true)
            }
        }}
        onFinish={onFinish}
        digitStyle={styles.timerDigits}
        digitTxtStyle={{color: Colors.PINK.default}}
        timeLabelStyle={styles.timeLabelStyle}
        separatorStyle={styles.separatorStyle}
        timeToShow={time < 3600 ? ['M', 'S'] : ['H', 'M', 'S']}
        // timeToShow={['H', 'M', 'S']}
        timeLabels={{m: null, s: null}}
        showSeparator
      />
    </View>
  );
};

export default Counter;
