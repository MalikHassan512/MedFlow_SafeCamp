import {StyleSheet} from 'react-native';
import {Colors, wp, hp} from '../../constants';

const styles = StyleSheet.create({
  transparentView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.54)',
    flex: 1,
  },
  modalView: {
    alignSelf: 'center',
    marginTop: hp(30),
    backgroundColor: Colors.BLACK.background,
    // backgroundColor: 'red',
    // height: 200,
    padding: hp(2),
    width: wp(80),
    borderColor: Colors.GRAY.lightText,
    borderWidth: 1,
    borderRadius: 10,
  },
  headingText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  buttonStyle: {width: '80%', marginBottom: 0, borderRadius: 10},
});

export default styles;
