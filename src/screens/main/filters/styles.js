import { StyleSheet } from 'react-native';
import { wp, hp, Fonts } from '../../../constants';
import { Colors } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.BLACK.background,
  },
  backArrowCon: {
    margin: '5%',
  },
  iconStyle: {
    color: Colors.WHITE.default,
    fontSize: 25,
  },
  filter: {
    width: hp(3),
    height: hp(3),
    tintColor: '#AF0923',
  },
  filterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%',
  },
  titleText: {
    color: Colors.WHITE.default,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
  },
  boxCon: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 3.5,
    justifyContent: 'space-between',
  },
  ht1: {
    marginStart: hp(0.5),
    fontSize: 16,
    color: Colors.WHITE.default,
    fontFamily: Fonts.SF_PRO_TEXT.Bold,
  },
  boxVw: {
    height: hp(6),
    width: wp(55),
    borderWidth: 1,
    opacity: 0.9000000357627869,
    borderColor: 'white',
    backgroundColor: Colors.WHITE.default,
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0, 10)',
    shadowOffset: {
      width: 0.2,
      height: 0.2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 5,
    // marginStart: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownTxt: {
    fontSize: 14,
    color: 'pink',
  },
  dropdownRow: {
    padding: 10,
    backgroundColor: 'pink',
  },
  selectText: {
    textAlign: 'center',
    color: Colors.BLACK.default,
    fontSize: 14,
  },
});

export default styles;
