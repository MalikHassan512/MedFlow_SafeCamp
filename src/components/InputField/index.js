import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Colors, IS_PAD, wp } from '../../constants';
import styles from './styles';
import ADIcon from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const InputField = props => {
  const {
    placeholder,
    value,
    onChangeText,
    onSubmitEditing,
    onRef,
    inputContainerStyle,
    secureTextEntry,
    icon,
    type,
    keyboardType,
    returnKeyType,
    blurOnSubmit,
    containerStyle,
    autoCapitalize,
    errorText,
    maxLength,
    autoCorrect,
    leftIconType,
    onPressLeftIcon,
    iconLeft,
    ipad,
  } = props;
  const reference = useRef(null);

  useEffect(() => {
    if (reference && onRef) {
      onRef(reference);
    }
  }, [reference]);

  const onChangeTextHandler = text => {
    onChangeText && onChangeText(text);
  };

  let Icon = type ? type : ADIcon;

  let LeftIcon = leftIconType ? leftIconType : MCIcon;

  return (
    <>
      <View style={[styles.rowContainer, iconLeft && { borderBottomWidth: 0.6 }, ipad && IS_PAD && { width: wp(65) }]}>
        {icon && (
          <Icon
            style={styles.iconStyle}
            name={icon}
            size={IS_PAD ? wp(4.5) : 28}
            color={Colors.WHITE.default}
          />
        )}
        <View
          style={[
            styles.container,
            inputContainerStyle,
            icon && { marginStart: wp(3) },
            iconLeft && { borderBottomWidth: 0 }
          ]}>
          {/*{icon && <ADIcon name={icon} size={20} color={Colors.WHITE.default} />}*/}
          <TextInput
            ref={reference}
            maxLength={maxLength}
            {...props}
            style={styles.inputStyle}
            placeholder={placeholder}
            placeholderTextColor={
              icon ? Colors.WHITE.primary : Colors.GRAY.lightText
            }
            keyboardType={keyboardType ? keyboardType : 'default'}
            value={value}
            onChangeText={onChangeTextHandler}
            returnKeyType={returnKeyType ? returnKeyType : 'next'}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit ? blurOnSubmit : false}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
          />
        </View>
        {iconLeft && (
          <TouchableOpacity onPress={onPressLeftIcon}>
            <LeftIcon
              style={styles.iconStyle}
              name={iconLeft}
              size={28}
              color={Colors.WHITE.default}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </>
  );
};

export default InputField;
