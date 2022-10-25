import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X, Fonts, IS_PAD } from '../../constants';

const styles = StyleSheet.create({
  container: {
    width: IS_PAD ? wp(65) : wp(95),
    borderRadius: wp(10),
    height: IS_PAD ? hp(5.25) : IS_IPHONE_X ? hp(6) : hp(6.25),
    backgroundColor: Colors.PINK.default,
    alignSelf: 'center',
    marginVertical: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: Colors.WHITE.primary,
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
    fontSize: IS_PAD ? 18 : 14,
  },
});

export default styles;
