import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X, IS_PAD } from '../../constants';

const styles = StyleSheet.create({
  errorStyles: { fontSize: IS_PAD ? wp(1.75) : 13, color: 'red', alignSelf: IS_PAD ? 'center' : 'flex-start' },
  container: {
    width: wp(85),
    alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1)
  },
  signupError: {
    width: wp(90),
    marginLeft: wp(4.25),
    marginTop: hp(1)
  },
  alignStart: {
    justifyContent: "center",
    marginLeft: IS_PAD ? 0 : wp(15),
    marginTop: hp(1),
  },
});

export default styles;
