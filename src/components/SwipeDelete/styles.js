import {StyleSheet} from 'react-native';
import {Colors, Fonts, hp, wp} from '../../constants';

const styles = StyleSheet.create({
  swipeView: {
    width: 100,
    alignSelf: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  deleteIcon: {
    color: Colors.RED.default,
    fontSize: 40,
  },
});

export default styles;
