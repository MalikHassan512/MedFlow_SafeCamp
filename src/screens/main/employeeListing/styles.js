import { StyleSheet } from 'react-native';
import { Colors, Fonts, hp, wp } from '../../../constants';

const styles = new StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: 'rgba(52, 58, 64, 1)',
  },
  bottomButtonReducedStyling: {
    marginBottom: hp(3),
    marginTop: hp(2)
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  Icon: {
    color: '#D8D8D8',
  },
  titleTxt: {
    fontSize: 30,
    color: 'white',
    marginBottom: 30,
  },
  newCotainer: {
    marginTop: 10,
    backgroundColor: 'rgb( 58, 66, 72)',
    borderRadius: 15,
    marginVertical: 10,
  },
  itemTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-start',
  },
  itemNameStyle: {
    fontSize: 14,
    color: 'white',
    alignSelf: 'flex-start',
  },
  itemContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  containerTextStyle: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  backButton: {
    // borderWidth: 1,
    padding: '3%',
    alignSelf: 'flex-start',
  },
  radioContainerView: {
    flexDirection: 'row',
    paddingVertical: hp(3),
    justifyContent: 'space-between',
    marginHorizontal: wp(5),
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: Colors.WHITE.primary,
  },
  radioText: {
    color: Colors.WHITE.default,
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
    flex: 1,
  },
  disableView: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  }
});

export default styles;
