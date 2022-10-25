import {StyleSheet} from 'react-native';
import {Colors, Fonts, hp, IS_PAD, wp} from '../../constants';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.RED.button,
    height: hp(6),
    // width: wp(44),
    width: '48%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.WHITE.default,
    fontSize: IS_PAD ? 20 : 15,
    textAlign: 'center',
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
  },
});

export default styles;
