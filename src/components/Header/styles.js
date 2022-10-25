import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X, Fonts, IS_PAD } from '../../constants';

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    // borderWidth: 1,
    height: IS_IPHONE_X ? hp(6) : hp(7),
    marginVertical: hp(2),
    paddingLeft: wp(3),
    // paddingHorizontal: wp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  titleText: {
    color: Colors.WHITE.default,
    fontSize: IS_PAD ? 24 : 17,
    // fontWeight: '500',
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
  },
  insuranceTextHeader: {
    fontSize: 16,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    fontWeight: 'bold',
  },
  subHeader: {
    color: 'white',
    fontSize: 14,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  titleContainer: {
    position: 'absolute',
    // alignSelf: 'center',
    left: 0,
    right: 0,
    // borderWidth: 1,
    alignItems: 'center',
    zIndex: 0,
  },
  menuIcon: {
    fontSize: IS_PAD ? wp(5.5) : 36,
    marginRight: wp(1.5),
  },
  printerIcon: {
    fontSize: IS_PAD ? wp(4.5) : 30,
    color: Colors.WHITE.primary,
    marginRight: wp(3),
  },
});

export default styles;
