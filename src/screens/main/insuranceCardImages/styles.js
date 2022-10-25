import { StyleSheet } from 'react-native';
import { Colors, wp, hp, IS_IPHONE_X } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: Colors.BLACK.background,
  },
  titleText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignSelf: 'center',
    backgroundColor: '#808080',
    // backgroundColor: '#343a40',
    width: 200,
    height: 170,
    marginTop: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default styles;
