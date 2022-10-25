import {StyleSheet} from 'react-native';
import {Colors, Fonts, hp, IS_PAD, wp} from '../../constants';

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },
  buttonText: {
    color: Colors.WHITE.primary,
    paddingVertical: wp(3),
    marginStart: 5,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    fontSize: IS_PAD ? 20 : 16,
  },
});

export default styles;
