import { StyleSheet } from 'react-native';
import { Colors, hp, wp, Fonts, IS_PAD } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: Colors.BLACK.background,
  },
  errorMsgText: {
    color: 'red',
    marginStart: wp(6),
    marginTop: wp(1),
    fontSize: 14,
  },
  titleText: {
    alignSelf: IS_PAD ? 'center' : 'flex-start',
    color: Colors.WHITE.primary,
    marginStart: wp(4),
    marginTop: hp(2),
    fontSize: 30,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
  backButton: {
    // borderWidth: 1,
    padding: '3%',
    alignSelf: 'flex-start',
  },
  radioContainerView: {
    // width: IS_PAD ? wp(65) : wp(90),
    // alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: hp(3),
    justifyContent: 'space-between',
    marginHorizontal: wp(5),
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: Colors.WHITE.primary,
  },
  radioText: {
    color: Colors.WHITE.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    fontSize: IS_PAD ? 18 : 14,
    flex: 1,
  },
  floatingView: {
    backgroundColor: 'transparent',
    // backgroundColor: "red",
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  radioLabel: {
    width: '50%',
  },
  disableView: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  }
});

export default styles;
