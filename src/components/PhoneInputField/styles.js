import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X, Fonts, IS_PAD } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.WHITE.default,
    borderBottomWidth: 0.6,
    borderBottomColor: Colors.WHITE.primary,
    width: wp(100),
    alignSelf: 'center',
    paddingStart: wp(1),
    // paddingBottom: hp(1.4),
    // paddingTop: hp(3),
    // paddingTop: IS_IPHONE_X ? hp(3) : hp(2),
    // marginStart: wp(3),
  },
  rowContainer: {
    width: wp(90),
    // width: IS_PAD ? wp(65) : wp(90),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-end',
    borderBottomColor: Colors.WHITE.primary,
    // borderWidth: 1,
  },
  inputStyle: {
    // padding: 0,
    // paddingBottom: hp(1.4),
    color: Colors.WHITE.primary,
    // paddingBottom: hp(1.4),
    width: wp(100),
    paddingBottom: hp(2),
    paddingTop: hp(3),
  },
  iconStyle: {
    marginBottom: 5,
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
