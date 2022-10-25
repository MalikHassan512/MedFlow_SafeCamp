import {StyleSheet} from 'react-native';
import {Colors, Fonts, hp, IS_IPHONE, IS_PAD, wp} from '../../constants';

export default StyleSheet.create({
  outerContainer: {
    marginStart: wp(3),
    paddingStart: wp(2),
    // borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderBottomColor: Colors.GRAY.lightText,
    backgroundColor: Colors.BLACK.background
  },
  container: {
    paddingEnd: wp(10),
    paddingVertical: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //
  },
  text: {
    color: Colors.WHITE.default,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    fontSize: IS_PAD ? 18 : 14,
    marginBottom: IS_IPHONE ? hp(0.5) : 0,
    marginRight: 10,
    shadowColor: Colors.BLACK.default,
    shadowOffset: {
      width: 15,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,

    elevation: 7,
  },
  statusColor: {
    color: Colors.GOLD.status
  },
  printerIcon: {
    fontSize: IS_PAD ? 36 : 30,
    color: Colors.WHITE.primary,
    shadowColor: Colors.BLACK.default,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,

    elevation: 7,
  },
  radioButton: {
    fontSize: 20,
    color: Colors.WHITE.primary,
    position: 'absolute',
    right: wp(5),
    top: hp(2.5),
  },
  bottomRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});
