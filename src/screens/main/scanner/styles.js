import {StyleSheet, Platform} from 'react-native';
import {Colors, wp, hp, Fonts, IS_IPHONE_X} from '../../../constants';
import {IS_PAD} from '../../../constants/Dimensions';

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: Colors.BLACK.background,
  },
  headingText: {
    fontSize: 30,
    color: Colors.WHITE.default,
  },
  subContainer: {
    paddingHorizontal: wp(5),
  },
  camButton: {
    width: wp(35),
    height: wp(35),
    borderRadius: 100,
    backgroundColor: Colors.BLACK.backgroundOpacity,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(5),
  },
  camIcon: {
    fontSize: 36,
    color: Colors.WHITE.primary,
    backgroundColor: Colors.BLACK.default,
  },
  header: {
    backgroundColor: Colors.BLACK.background,
    paddingVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: wp(3),
  },
  switchStyle: {
    paddingRight: wp(3),
  },
  torchBtn: {
    position: 'absolute',
    bottom: hp(2.2),
    end: 0,
    margin: 15,
    width: wp(15),
    height: wp(15),
    backgroundColor: Colors.WHITE.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(8),
  },
  noAccessText: {
    position: 'absolute',
    top: hp(50),
    alignSelf: 'center',
    // fontWeight: 'bold',
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    fontSize: 20,
    color: Colors.WHITE.default,
  },
  headerText: {
    color: Colors.WHITE.primary,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    fontSize: 18,
  },

  cameraContainerStyle: {
    // height: wp(100),
    // width: wp(100),
    overflow: 'hidden',
    alignSelf: 'center',
    // borderRadius: 20,
    // borderWidth: 2,
    borderColor: Colors.GRAY.lightText,
  },
  scannerOutline: {
    position: 'absolute',
    top: IS_IPHONE_X ? (IS_PAD ? hp(28) : hp(35)) : hp(28),
    alignSelf: 'center',
    aspectRatio: 2 / 1.7,
    width: wp(75),
    borderRadius: wp(4),
    // borderColor: Colors.GRAY.background,
    borderColor: Colors.PINK.default,
    borderWidth: 2,
    overflow: 'hidden',
  },
  barcodeOutline: {
    height: hp(12),
    width: wp(85),
    top: hp(50),
  },
  cameraStyle: {
    height: hp(100),
  },
  topViewStyle: {flex: 0, height: 0, width: 0},
  bottomViewStyle: {flex: 0, height: 0, width: 0},
  scanButton: {
    position: 'absolute',
    bottom: hp(5),
    alignSelf: 'center',
    height: wp(30),
    width: wp(30),
    borderRadius: wp(15),
    backgroundColor: Colors.WHITE.default,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noCameraAccessView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLACK.default,
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex:9999
  },
  noCameraAccessText: {
    color: Colors.GRAY.lightText,
    fontFamily: Fonts.SF_PRO_TEXT.Medium,
    fontSize: 18,
  },
});

export default styles;
