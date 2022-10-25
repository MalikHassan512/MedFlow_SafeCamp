import {StyleSheet} from 'react-native';
import {
  Colors,
  Fonts,
  hp,
  IS_IPHONE,
  IS_IPHONE_X,
  IS_PAD,
  wp,
} from '../../constants';

export default StyleSheet.create({
  outerContainer: {
    marginStart: wp(3),
    paddingStart: wp(2),
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderBottomColor: Colors.GRAY.lightText,
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
    marginBottom: IS_IPHONE ? hp(0.5) : hp(0.2),
    fontSize: IS_PAD ? 18 : 14,
  },
  statusColor: {
    color: Colors.GOLD.status,
  },
  negativeResultText: {
    color: Colors.GREEN.default,
  },
  positiveResultText: {
    color: Colors.RED.default,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 20,
    // marginRight: wp(3),
  },

  //
  pdfContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  pdfHeader: {
    backgroundColor: Colors.BLACK.background,
    elevation: 0,
    borderBottomWidth: 0,
    height: IS_IPHONE_X ? hp(10) : IS_IPHONE ? hp(9) : hp(8),
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
    paddingTop: IS_IPHONE_X ? hp(5) : IS_IPHONE ? hp(3) : hp(2),
    // marginVertical: 10,
    // marginBottom: 15,
  },
  pdfHeaderText: {
    color: '#D8D8D8',
    fontSize: 16,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    marginLeft: wp(3),
    marginRight: wp(3),
  },
  printerIcon: {
    fontSize: IS_PAD ? 36 : 30,
    // color: Colors.WHITE.primary,
    marginRight: wp(3),
    color: Colors.PINK.default,
  },
  IconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ViewText: {color: Colors.BLUE.dark},
});
