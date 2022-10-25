import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X, Fonts, IS_PAD } from '../../constants';

const styles = new StyleSheet.create({
  header: {
    backgroundColor: Colors.BLACK.background,
    paddingVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    paddingHorizontal: wp(3),
    zIndex: 2,
  },
  headerText: {
    color: Colors.WHITE.primary,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    fontSize: IS_PAD ? 24 : 18,
    textAlign: 'center'
  },
  titleContainer: {
    zIndex: 0,
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    color: Colors.WHITE.primary,
    paddingHorizontal: wp(5),
    fontSize: IS_PAD ? 18 : 14,
  },
});

export default styles;
