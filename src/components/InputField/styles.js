import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X, Fonts, IS_PAD } from '../../constants';

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.WHITE.default,
    borderBottomWidth: 0.6,
    borderBottomColor: Colors.WHITE.primary,
    // width: wp(90),
    alignSelf: 'center',
    paddingStart: wp(1),
    // paddingBottom: hp(1.4),
    // paddingVertical: hp(2),
    // paddingTop: IS_IPHONE_X ? hp(3) : hp(2),
    // marginStart: wp(3),
  },
  rowContainer: {
    width: wp(90),
    // width: IS_PAD ? wp(65) : wp(90),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.WHITE.primary,
    // borderWidth: 1,
  },
  inputStyle: {
    padding: 0,
    color: Colors.WHITE.primary,
    fontSize: IS_PAD ? wp(2) : 14,
    paddingVertical: hp(2),
  },
  iconStyle: {
    // paddingBottom: hp(1.4),
    // marginBottom: 5,
  },
  errorText: {
    color: Colors.RED.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    fontSize: 12,
    marginStart: wp(6.5),
    marginTop: 5,
  }
});

export default styles;
