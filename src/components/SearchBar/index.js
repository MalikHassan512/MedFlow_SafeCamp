import React from 'react';
import {View, StyleSheet, Image, TextInput} from 'react-native';
import styles from './styles';
import {Colors, ICON_CONSTANTS, Strings} from '../../constants';

const SearchBar = ({search, onChangeText, onSubmitEditing, isDropDown}) => {
  return (
    <View style={[styles.container, isDropDown && styles.isDropDownContainer]}>
      <ICON_CONSTANTS.AntDesign name={'search1'} style={styles.iconStyle} />
      <TextInput
        style={[styles.inputStyle, isDropDown && styles.dropDownText]}
        placeholder={Strings.search}
        placeholderTextColor={Colors.GRAY.lightText}
        keyboardType={'default'}
        value={search}
        onChangeText={onChangeText}
        returnKeyType={'done'}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

//make this component available to the app
export default SearchBar;
