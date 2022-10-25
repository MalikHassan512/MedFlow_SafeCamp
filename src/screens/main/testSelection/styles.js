import {StyleSheet} from 'react-native';
import {Colors, hp, wp, Fonts, IS_PAD} from '../../../constants';

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
    fontSize: IS_PAD ? 34 : 30,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  backButton: {
    // borderWidth: 1,
    padding: '3%',
    alignSelf: 'flex-start',
  },
  radioContainerView: {
    flexDirection: 'row',
    paddingVertical: hp(3),
    justifyContent: 'space-between',
    marginHorizontal: wp(7),
    marginTop: hp(3),
    // borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: Colors.WHITE.primary,
  },
  radioText: {
    color: Colors.WHITE.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },

  subText: {
    color: Colors.WHITE.primary,
    marginHorizontal: wp(4),
    marginTop: hp(1),
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    fontSize: IS_PAD ? 18 : 14,
  },
});

export default styles;
