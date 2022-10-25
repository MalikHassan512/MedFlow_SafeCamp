import {StyleSheet} from 'react-native';
import {Colors, wp, hp, IS_IPHONE_X, Fonts, IS_PAD} from '../../constants';

const styles = new StyleSheet.create({
  container: {
    flexDirection:"row",
    alignItems:"center"
  },
  checkBox:{
    height:27,
    width:27,
    borderRadius:3,
    borderWidth:1,
    borderColor:Colors.WHITE.primary,
    justifyContent:"center",
    alignItems:"center"
  },
  title:{
    fontSize: IS_PAD ? 18 : 12,
    color:Colors.WHITE.default,
    marginLeft:10
  }
});

export default styles;
