import { StyleSheet } from 'react-native';
import { Colors, Fonts, hp, IS_PAD, wp } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 5
  },
  textStyle: {
    color: Colors.WHITE.default,
    fontSize: IS_PAD ? 16 : 13,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    // fontWeight: '700'
  },
  transparentView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.54)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    alignSelf: 'center',
    marginTop: hp(30),
    backgroundColor: Colors.BLACK.background,
    paddingTop: hp(2),
    width: wp(90),
    borderColor: Colors.GRAY.lightText,
    borderWidth: 1,
    borderRadius: 10,
  },
  headingText: {
    textAlign: 'center',
    color: Colors.WHITE.default,
    fontSize: IS_PAD ? 24 : 18,
    marginBottom: hp(4),
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
    marginTop: hp(2),
  },
  buttonStyle: {
    width: wp(37),
    borderRadius: 15,
    marginTop: hp(7),
    marginBottom: hp(2.5),
  },
  closeIconBtn: {
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  closeIcon: {
    fontSize: IS_PAD ? 30 : 24,
    color: Colors.WHITE.primary,
    padding: 10,
  },
});
export default styles;
