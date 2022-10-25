import React from 'react';
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {Colors, IS_PAD, wp} from '../../constants';

const RadioButtonItem = props => {
  const {
    obj,
    buttonSize,
    buttonOuterSize,
    onPress,
    isSelected,
    index,
    isDisabled,
  } = props;
  return (
    <RadioButton labelHorizontal={true} disabled={props.disabled}>
      <RadioButtonInput
        disabled={isDisabled}
        obj={obj}
        index={index}
        isSelected={isSelected}
        onPress={onPress}
        borderWidth={1}
        buttonInnerColor={Colors.WHITE.default}
        buttonOuterColor={Colors.WHITE.default}
        buttonSize={buttonSize ? buttonSize : 17.5}
        buttonOuterSize={buttonOuterSize ? buttonOuterSize : 25}
        // buttonOuterColor={'red'}
        // buttonSize={30}
        // buttonOuterSize={35}
        // buttonStyle={{}}
        buttonWrapStyle={{marginLeft: 10, opacity: isDisabled ? 0.5 : 1}}
      />
      <RadioButtonLabel
        disabled={isDisabled}
        obj={obj}
        index={index}
        labelHorizontal={true}
        onPress={onPress}
        labelStyle={[
          {color: Colors.WHITE.primary, opacity: isDisabled ? 0.5 : 1},
          IS_PAD && {fontSize: wp(2)},
        ]}
        labelWrapStyle={{}}
      />
    </RadioButton>
  );
};

export default RadioButtonItem;
