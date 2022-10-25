import {StyleSheet} from 'react-native';
import {Colors, wp, hp, Fonts, IS_PAD} from '../../../constants';

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: Colors.BLACK.background,
  },
  headingText: {
    fontSize: IS_PAD ? 36 : 30,
    color: Colors.WHITE.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  subContainer: {
    paddingHorizontal: wp(5),
  },
  camButton: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(18),
    backgroundColor: Colors.BLACK.backgroundOpacity,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(5),
  },
  camIcon: {
    fontSize: IS_PAD ? wp(10) : 36,
    color: Colors.WHITE.primary,
  },
});

export default styles;
