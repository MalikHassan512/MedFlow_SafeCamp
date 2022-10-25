import { StyleSheet } from 'react-native';
import { Colors, Fonts, hp, IS_PAD, wp } from '../../../constants';

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: Colors.BLACK.background,
  },
  noTestText: {
    fontSize: IS_PAD ? 20 : 14,
    color: Colors.WHITE.default,
    alignSelf: 'center',
    marginTop: hp(3),
    fontFamily: Fonts.SF_PRO_TEXT.Medium
  },
  bottomRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(1),
    paddingHorizontal: wp(2),
  }
});

export default styles;
