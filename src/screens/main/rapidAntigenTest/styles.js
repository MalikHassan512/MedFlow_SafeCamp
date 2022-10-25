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
  swipeView: {
    width: 100,
    alignSelf: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  deleteIcon: {
    color: 'red',
    fontSize: 40,
  },
  bottomRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  }
});

export default styles;
