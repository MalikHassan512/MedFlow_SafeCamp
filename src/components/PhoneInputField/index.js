import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Colors, IS_PAD, wp } from '../../constants';
import styles from './styles';
import ADIcon from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PhoneInput from 'react-native-phone-input';

const PhoneInputField = props => {
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
    onChangeCountry,
    leftIconType,
    iconLeft,
    onPressLeftIcon,
    initialValue,
    ipad
  } = props;
  const reference = useRef(null);

  useEffect(() => {
    if (reference && onRef) {
      onRef(reference);
    }
  }, [reference]);

  const onChangeTextHandler = text => {
    //this if block is to prevent country code
    // if (text.length === 1) {
    //   reference.current.setValue('+1');
    //   onChangeText && onChangeText('+1');
    // } else {
    //   onChangeText && onChangeText(text);
    // }

    onChangeText && onChangeText(text);
  };

  let Icon = type ? type : ADIcon;

  let LeftIcon = leftIconType ? leftIconType : MCIcon;

  return (
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
          iconLeft && { borderBottomWidth: 0 },
        ]}
      >
        <PhoneInput
          ref={reference}
          initialCountry={'us'}
          {...props}
          disabled={false}
          initialValue={initialValue}
          autoFormat={true}
          textProps={{
            placeholder: placeholder,
            color: Colors.WHITE.primary,
            maxLength: 15,
          }}
          textStyle={{ fontSize: IS_PAD ? wp(2) : 14 }}
          style={styles.inputStyle}
          keyboardType={keyboardType ? keyboardType : 'phone-pad'}
          value={value}
          onChangePhoneNumber={onChangeTextHandler}
          returnKeyType={returnKeyType ? returnKeyType : 'done'}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit ? blurOnSubmit : true}
          secureTextEntry={secureTextEntry}
          // onSelectCountry={onChangeCountry}
          allowZeroAfterCountryCode={false}
        // onPressFlag={() => null} //to disable country selection from dropdown
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
  );
};

export default PhoneInputField;
