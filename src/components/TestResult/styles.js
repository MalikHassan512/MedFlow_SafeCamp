import {StyleSheet} from 'react-native';
import {Colors, hp, wp, IS_IPHONE, Fonts, IS_PAD} from '../../constants';

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    backgroundColor: Colors.GRAY.background,
    borderRadius: 15,
  },
  padding: {paddingHorizontal: wp(5)},
  line: {
    backgroundColor: Colors.GRAY.lightText,
    height: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testIdText: {
    color: Colors.WHITE.default,
    fontSize: IS_PAD ? 30 : 24,
    // fontWeight: 'bold',
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
  },
  nameText: {
    color: Colors.GRAY.lightText,
    marginBottom: hp(1.5),
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    marginTop: hp(0.5),
    fontSize: IS_PAD ? 18 : 14
  },
  timerText: {
    color: Colors.PINK.default,
    // fontWeight: 'bold',
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
  },
  resultText: {
    fontSize: IS_PAD ? 22 : 18,
    // fontWeight: 'bold',
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
    color: Colors.GREEN.default,
  },
  printerIcon: {
    fontSize: IS_PAD ? 36 : 30,
    color: Colors.WHITE.primary,
  },
  radioButton: {
    fontSize: IS_PAD ? 26 : 22,
    color: Colors.WHITE.primary,
    alignSelf: 'flex-end',
    marginRight: wp(5),
    marginBottom: hp(2),

    // position: 'absolute',
    // right: wp(5),
    // top: hp(2.5),

  },
  updateBtn: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: Colors.GRAY.lightText,
    marginBottom: 10,
  },
  bottomRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default styles;
