import { StyleSheet } from 'react-native';
import { Colors, Fonts, IS_PAD } from '../../../constants';
import { wp, hp } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK.background,
  },
  appLogo: {
    height: IS_PAD ? hp(17.5) : hp(20),
    width: IS_PAD ? hp(70) : wp(80),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: hp(10),
  },
  text: {
    color: Colors.GRAY.lightText,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    fontSize: IS_PAD ? wp(2) : 14
  },
  textLink: {
    color: Colors.PINK.default,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  loadingView: {
    height: hp(15),
    // borderWidth: 1,
  },
});

export default styles;
