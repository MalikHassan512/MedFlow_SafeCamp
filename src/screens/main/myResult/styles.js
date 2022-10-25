import {StyleSheet} from 'react-native';
import {Colors, Fonts, IS_PAD, wp} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: Colors.BLACK.background,
  },
  menuIcon: {
    fontSize: 36,
    color: Colors.PINK.default,
  },
  ifClear: {marginRight: 15},
  iconAndClearCon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearText: {color: 'white', fontFamily: Fonts.SF_PRO_TEXT.Regular},
  headingRowContainer: {
    marginHorizontal: wp(3),
    marginTop: wp(2),
    marginBottom: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    color: Colors.WHITE.default,
    fontSize: IS_PAD ? 28 : 24,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  listEmptyComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listEmptyText: {
    color: 'white',
    alignSelf: 'center',
  },
});

export default styles;
