import {StyleSheet} from 'react-native';
import {Colors, Fonts, hp, wp} from '../../constants';

const styles = StyleSheet.create({
  multiEditButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
    marginVertical: 15,
    backgroundColor: Colors.PINK.default,
    borderColor: Colors.WHITE.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
