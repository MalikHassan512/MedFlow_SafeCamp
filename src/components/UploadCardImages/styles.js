import {StyleSheet} from 'react-native';
import {Colors, hp} from '../../constants';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.BLACK.background},
  titleText: {
    color: 'white',
    textAlign: 'center',
    marginTop: hp(3),
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignSelf: 'center',
    backgroundColor: '#808080',
    // backgroundColor: '#343a40',
    width: 200,
    height: hp(25),
    marginTop: hp(1),
    borderRadius: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconStyle: {fontSize: 32, alignSelf: 'center'},
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default styles;
