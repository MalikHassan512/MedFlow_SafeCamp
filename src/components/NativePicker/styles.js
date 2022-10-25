import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X, IS_PAD, IS_IPHONE } from '../../constants';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: 'white',
  },
  label: {
    fontSize: IS_PAD ? 18 : 14,
    color: Colors.BLACK.default,
    marginVertical: 2
  },
  item: {
    paddingHorizontal: wp(0.25),
    paddingVertical: 10,
    // borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE.primary,
  },
  dropdown: {
    alignSelf: 'center',
    width: wp(94),
    borderBottomWidth: 1,
    borderColor: Colors.WHITE.primary,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tickIcon: {
    color: Colors.BLUE.iosDefault,
    marginRight: wp(2),
    alignSelf: 'center',
    fontSize: IS_PAD ? 20 : 16,
  },
  dropdownAndroid: {
    position: 'absolute',
    // alignSelf: 'center',
    left: wp(20),
    backgroundColor: Colors.WHITE.default,
    width: wp(50),
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    borderWidth: 1,
    borderColor: Colors.WHITE.primary,
    overflow: 'hidden',
    // borderBottomEndRadius: 10,
    // borderBottomStartRadius: 10,
  },
  button: {
    width: IS_PAD ? wp(65) : wp(60),
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.WHITE.primary,
    borderBottomWidth: 1,
    height: hp(5),
    paddingLeft: 10,
    alignSelf: 'center',
  },
  customButtonAndroid: {
    borderBottomColor: 'none',
    borderBottomWidth: 0,
    paddingLeft: 3,
    width: '100%',
  },

  buttonText: {
    flex: 1,
    color: Colors.WHITE.default,
    opacity: 0.8,
    fontSize: IS_PAD ? 20 : 14,
  },

  customButtonText: {
    color: 'black',
    textAlign: 'center',
    opacity: 1,
  },
  downIcon: {
    fontSize: 24,
    color: Colors.WHITE.primary,
    marginRight: 5,
  },
  overlay: {
    borderWidth: 3,
    // backgroundColor: 'red',
    width: wp(50),
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: IS_IPHONE_X ? hp(7) : IS_IPHONE ? hp(4) : hp(2.5),
    paddingBottom: hp(2),
    backgroundColor: 'white',
    paddingHorizontal: wp(3),
    borderBottomWidth: 0.7,
    borderColor: Colors.GRAY.lightText,
  },
  backText: {
    color: Colors.BLUE.iosDefault,
    fontSize: IS_PAD ? 18 : 16,
    marginHorizontal: wp(0.25)
  },
  pickerTitle: {
    fontSize: IS_PAD ? 20 : 16,
    fontWeight: 'bold',
  },
});

export default styles;
