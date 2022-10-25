import {StyleSheet} from 'react-native';
import {Colors, wp, hp, IS_IPHONE_X} from '../../../constants';

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: Colors.BLACK.background,
  },
  closeButton: {
    borderRadius: 20,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    elevation: 2,
    marginBottom: hp(5),
    backgroundColor: Colors.PINK.default,
  },
  modalView: {
    width: wp(100),
    height: hp(100),
    backgroundColor: Colors.WHITE.default,
    marginTop: IS_IPHONE_X ? hp(5) : hp(2),
    borderRadius: 20,
  },
  topView: {
    width: wp(100),
    height: hp(30),
    backgroundColor: Colors.WHITE.default,
    marginTop: hp(4),
  },
  bottomView: {
    flex: IS_IPHONE_X ? 0.2 : 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signIcon: {
    fontSize: 28,
    color: 'white',
    marginStart: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(3),
  },
  signatureContainer: {
    width: wp(100),
    // height: hp(20),
    aspectRatio: 2 / 0.9,
    backgroundColor: Colors.WHITE.default,
    // backgroundColor: Colors.PINK.default,
    // marginTop: hp(4),
  },
  absolute: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  blueButton: {
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(0.7),
    backgroundColor: Colors.BLUE.default,
    borderRadius: 5,
  },
  clearButton: {
    alignSelf: 'flex-start',
    bottom: 0,
    left: 5,
    position: 'absolute',
  },
  hippaText: {
    margin: '5%',
    lineHeight: 22,
  },
  btnText: {
    color: Colors.WHITE.default,
  },
  canvasWebStyle: `.m-signature-pad {
    box-shadow: none; border: none;
    margin-left: 0px;
    margin-top: 0px;
  } 
   .m-signature-pad--body
    canvas {
      background-color: #ffffff;
    }
  .m-signature-pad--body {border: none}
  .m-signature-pad--footer {display: none; margin: 0px;}
  body,html {
     width: 100%; 
     height: 100%;
  }`,
});

export default styles;
