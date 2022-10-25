import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, hp, IS_PAD, wp} from '../../../constants';
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: Colors.BLACK.background,
  },
  titleText: {
    color: Colors.WHITE.default,
    marginStart: wp(4),
    marginTop: hp(2),
    fontSize: IS_PAD ? 36 : 30,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    alignSelf: IS_PAD ? 'center' : 'flex-start',
  },
  termsText: {
    textAlign: 'center',
    color: Colors.WHITE.primary,
    width: wp(85),
    alignSelf: 'center',
    marginTop: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 24,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  termsTextLink: {
    color: Colors.PINK.default,
    textAlign: 'center',
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  backButton: {
    // borderWidth: 1,
    padding: '3%',
    alignSelf: 'flex-start',
  },
  displayFields: {
    borderBottomColor: 'transparent',
    marginTop: 20,
  },
  phInputContainer: {
    marginTop: hp(4),
  },
  verificationField: {
    color: '#D8D8D8',
    marginLeft: 10,
    marginRight: 20,
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.6,
  },
  newPasswordContainer: {
    borderBottomColor: 'transparent',
    // marginLeft: 20,
    marginTop: 20,
  },
  passwordResetField: {
    color: '#D8D8D8',
    marginLeft: 10,
    marginRight: 20,
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.6,
  },
  buttonActive: {
    alignSelf: 'center',
    backgroundColor: '#FF3366',
    borderRadius: 30,
    marginTop: '7%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: width / 2 - 100,
    paddingRight: width / 2 - 100,
  },
  buttonDisable: {
    alignSelf: 'center',
    // backgroundColor: '#FF3366',
    borderRadius: 30,
    marginTop: '7%',
    backgroundColor: 'rgba(255, 51, 102, 0.25)',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: width / 2 - 100,
    paddingRight: width / 2 - 100,
  },
  resendCodeBtn: {
    // borderWidth: 1,
    alignSelf: 'center',
    marginTop: hp(1.5),
    marginBottom: hp(-2),
    padding: hp(1),
  },
  resendCodeText: {
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
    textDecorationLine: 'underline',
    color: Colors.WHITE.primary,
  },
});

export default styles;
