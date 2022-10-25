import {StyleSheet} from 'react-native';
import {Colors, Fonts, hp, IS_PAD, wp} from '../../../constants';

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
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },
  bottomRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(1),
    paddingHorizontal: wp(2),
  },
  buttonText: {
    color: Colors.WHITE.primary,
    paddingVertical: wp(3),
    // borderWidth: 1,
    marginStart: 5,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    fontSize: 16,
  },
  multiEditButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
    marginVertical: 15,
    backgroundColor: Colors.GRAY.background_2,
    borderColor: Colors.WHITE.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 5,
    alignItems: 'flex-end',
    top: hp(3.7),
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
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

  closeIconBtn: {
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },

  headingText: {
    textAlign: 'center',
    color: Colors.WHITE.default,
    fontSize: IS_PAD ? 24 : 18,
    marginBottom: hp(4),
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
  },

  buttonStyle: {
    width: wp(37),
    borderRadius: 15,
    marginTop: hp(7),
    marginBottom: hp(2.5),
  },
  transparentView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.54)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeIcon: {
    fontSize: IS_PAD ? 30 : 24,
    color: Colors.WHITE.primary,
    padding: 10,
  },
  clearBtn: {
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
    color: Colors.WHITE.default,
    textDecorationLine: 'underline',
  },
});

export default styles;
