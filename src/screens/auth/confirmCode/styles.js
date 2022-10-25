import {StyleSheet} from 'react-native';
import {Colors, Fonts, hp, wp} from '../../../constants';

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
    fontSize: 30,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  subText: {
    color: Colors.WHITE.primary,
    marginHorizontal: wp(4),
    marginTop: hp(1),
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
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
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {margin: wp(5)},
  cell: {
    width: wp(15),
    height: wp(15),
    borderRadius: 10,
    backgroundColor: Colors.WHITE.primary,
    overflow: 'hidden',
    lineHeight: 45,
    fontSize: 24,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderWidth: 2,
    borderColor: Colors.BLACK.background,
    textAlignVertical: 'center',
  },
  focusCell: {
    borderColor: Colors.GRAY.lightText,
    borderWidth: 2,
  },
  codeFieldsContainer: {
    marginTop: hp(15),
    // borderWidth: 1,
    borderRadius: 30,
    // backgroundColor: Colors.GRAY.lightText,
  },
  buttonStyle: {borderRadius: wp(2), height: wp(12), width: wp(65)},
});

export default styles;
