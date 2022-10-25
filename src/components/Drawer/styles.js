import { StyleSheet } from 'react-native';
import { Colors, hp, wp, Fonts, IS_PAD } from '../../constants';

const styles = StyleSheet.create({
  profileIcon: {
    color: Colors.BLACK.opacity_50,
    padding: 2,
    fontSize: IS_PAD ? wp(4) : 32,
  },
  iconWrapper: {
    borderWidth: 2,
    borderColor: Colors.BLACK.opacity_50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center'
  },
  listIcon: {
    color: Colors.BLACK.opacity_50,
    fontSize: IS_PAD ? wp(3.5) : 30,
  },
  profileContainer: {
    marginTop: hp(4),
    marginBottom: hp(3),
    paddingLeft: IS_PAD ? wp(4.25) : wp(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameText: {
    // fontWeight: 'bold',
    marginLeft: IS_PAD ? wp(2.5) : wp(4),
    marginRight: wp(3),
    flex: 1,
    fontSize: IS_PAD ? wp(2) : 14,
    // fontFamily: Fonts.SF_PRO_TEXT.Bold,
  },
  switchText: {
    // fontWeight: '500',
    textAlign: 'center',
    fontSize: IS_PAD ? wp(2) : 16,
    // fontFamily: Fonts.SF_PRO_TEXT.Bold,
  },
  switch: {
    alignSelf: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  listItemContainer: {
    padding: wp(3),
    borderBottomWidth: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.GRAY.lightText,
  },
  listItemText: {
    fontWeight: 'normal',
    // fontFamily: Fonts.SF_PRO_TEXT.Medium,
    paddingLeft: IS_PAD ? wp(2.5) : wp(5),
    fontSize: IS_PAD ? wp(2) : 16,
    flex: 1,
  },
  versionText: {
    textAlign: 'center',
    marginBottom: hp(3),
    fontFamily: Fonts.SF_PRO_TEXT.Regular,
  },
});

export default styles;
