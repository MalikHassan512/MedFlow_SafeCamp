import { StyleSheet } from 'react-native';
import { Colors, hp, wp, Fonts, IS_IPHONE, IS_PAD } from '../../../constants';

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: Colors.BLACK.background,
  },
  titleText: {
    color: Colors.WHITE.primary,
    marginStart: wp(4),
    marginTop: hp(2),
    fontSize: IS_PAD ? 36 : 30,
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
    alignSelf: IS_PAD ? 'center' : 'flex-start'
  },
  termsText: {
    textAlign: 'center',
    color: Colors.WHITE.primary,
    width: wp(85),
    alignSelf: 'center',
    marginTop: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: IS_IPHONE ? 24 : 28,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    fontSize: IS_PAD ? 18 : 14,
  },
  termsTextLink: {
    color: Colors.PINK.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    // backgroundColor: 'yellow',
  },
  backButton: {
    // borderWidth: 1,
    padding: '3%',
    alignSelf: 'flex-start',
  },
  pdfModalContainer: {
    flex: 1,
    backgroundColor: Colors.BLACK.background
  }
});

export default styles;
