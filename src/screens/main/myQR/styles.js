import { StyleSheet, Platform } from 'react-native';
import { Fonts, Colors, hp, wp, IS_PAD } from '../../../constants';
import { IS_IPHONE_X } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: Colors.BLACK.background,
  },

  nameInitialsContainer: {
    backgroundColor: Colors.WHITE.default,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    marginTop: hp(2),
    height: IS_PAD ? wp(16) : wp(20),
    width: IS_PAD ? wp(16) : wp(20),
    borderRadius: wp(10),
  },
  nameInitials: {
    fontSize: IS_PAD ? wp(6) : 25,
    color: Colors.BLACK.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  nameText: {
    textAlign: 'center',
    marginTop: hp(1),
    fontSize: IS_PAD ? 18 : 14,
  },
  qrImageContainer: {
    alignSelf: 'center',
    marginTop: hp(5.2),
  },
  infoIconAndTextCOntainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: Platform.OS == 'android' ? hp(5.6) : hp(5),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE.default,
    height: IS_PAD ? wp(4) : wp(8),
    width: IS_PAD ? wp(4) : wp(8),
    borderRadius: wp(5),
    marginRight: 8,
  },
  addToWallet: {
    // backgroundColor: '#1d1e1e',
    backgroundColor: Colors.BLACK.opacity_50,
    alignSelf: 'center',
    marginTop: Platform.OS == 'android' ? hp(6.5) : hp(5.5),
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
  },
  fakeCardCon: {
    alignSelf: 'center',
    marginRight: 5,
  },
  regularText: {
    color: 'white',
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    fontSize: IS_PAD ? 18 : 14,
  },
  // qrImageStyle: {width: 180, height: 180},
  qrImageStyle: {
    width: wp(47),
    height: hp(23.5),
    resizeMode: 'contain',
  },
  // font12: {fontSize: 12, marginBottom: -10},
  font12: { fontSize: IS_PAD ? 16 : 12 },
  font16: { fontSize: IS_PAD ? 20 : 16 },

  flagImageContainer: {
    alignSelf: 'center',
    // marginTop: IS_PAD ? hp(5) : wp(10),
    marginTop: Platform.OS == 'android' ? hp(7) : hp(5),
    marginBottom: 12,
  },
  flagImageStyle: { width: IS_PAD ? 56 : 35, height: IS_PAD ? 72 : 45 },
  walletImageStyle: { width: IS_PAD ? 75 : 45, height: IS_PAD ? 50 : 30 },
  iconColor: { color: Colors.BLACK.default },
  addPassButton: {
    width: IS_IPHONE_X ? wp('40%') : wp('35%'), //isIphoneXorAbove ? 145 : 145,
    height: IS_IPHONE_X ? wp('10.5%') : wp('9.5%'), //isIphoneXorAbove ? 40 : 40,
  },
  qrCon: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default styles;
