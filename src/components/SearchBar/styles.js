import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE, IS_PAD } from '../../constants';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(1),
    paddingVertical: IS_IPHONE ? hp(0.8) : hp(0.2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.GRAY.background_2,
    borderRadius: 12,
    width: wp(95),
    alignSelf: 'center',
  },
  isDropDownContainer: {
    backgroundColor: Colors.WHITE.default,
    borderColor: Colors.BLACK.opacity_50,
    borderWidth: 0.5,
  },
  inputStyle: {
    flex: 1,
    color: Colors.WHITE.primary,
    marginStart: 5,
    fontSize: IS_PAD ? 18 : 14
  },
  dropDownText: {
    color: Colors.BLACK.primary,
  },
  iconStyle: {
    fontSize: IS_PAD ? 32 : 28,
    color: Colors.GRAY.lightText,
    marginHorizontal: wp(2),
  },
});

export default styles;
