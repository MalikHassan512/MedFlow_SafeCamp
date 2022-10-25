import {StyleSheet} from 'react-native';
import {Colors, hp, wp} from '../../constants';

const styles = StyleSheet.create({
  timerTextContainer: {
    borderColor: Colors.GRAY.lightText,
    borderWidth: 1,
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.2),
    borderRadius: 10,
    marginRight: wp(4),
  },
  timerDigits: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: Colors.PINK.default,
    marginVertical: -5,
    marginHorizontal: -4,
  },
  timeLabelStyle: {
    color: Colors.RED.default,
    fontWeight: 'bold',
  },
  separatorStyle: {
    color: Colors.PINK.default,
    paddingBottom: 3,
  },
});

export default styles;
