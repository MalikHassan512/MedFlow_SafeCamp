import React from 'react';
import {IS_IPHONE} from '../../constants';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';

const AvoidKeyboard = ({children}) => {
  return (
    <KeyboardAvoidingView
      {...(IS_IPHONE ? {behavior: 'padding'} : {})}
      style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {children}
        <View style={{marginBottom: 25}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AvoidKeyboard;
