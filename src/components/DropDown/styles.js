import {StyleSheet} from 'react-native';
import {Colors, wp, hp, IS_IPHONE_X} from '../../constants';

const styles = new StyleSheet.create({
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.WHITE.primary,
  },
  dropdown: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.BLACK.background,
    width: wp(60),
    shadowRadius: 4,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
    borderWidth: 1,
    borderColor: Colors.WHITE.primary,
    overflow: 'hidden',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },

  button: {
    width: wp(60),
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.WHITE.primary,
    borderBottomWidth: 1,
    height: hp(5),
    paddingLeft: 10,
    alignSelf: 'center',
  },
  buttonText: {
    flex: 1,
    color: Colors.WHITE.default,
    opacity: 0.8,
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
});

export default styles;
