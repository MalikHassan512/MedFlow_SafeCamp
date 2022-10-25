import { StyleSheet } from 'react-native';
import { Colors, Fonts, IS_PAD, wp } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: Colors.BLACK.background,
  },
  headingText: {
    fontSize: IS_PAD ? 35 : 30,
    color: Colors.WHITE.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    alignSelf: IS_PAD ? 'center' : 'flex-start',
  },
  subContainer: {
    paddingHorizontal: wp(5),
  },
  subHeadingText: {
    fontSize: IS_PAD ? 28 : 24,
    color: Colors.WHITE.default,
    // fontWeight: '200',
    // marginTop: 10,
    fontFamily: Fonts.SF_PRO_TEXT.Thin,
    alignSelf: IS_PAD ? 'center' : 'flex-start',
  },
  linkText: {
    color: Colors.PINK.default,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    fontSize: IS_PAD ? 20 : 14,
  },
  dropDown: {
    borderWidth: 2,
    width: wp(70),
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
});

export default styles;
