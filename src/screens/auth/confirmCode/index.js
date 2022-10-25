import React, {useContext, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import styles from './styles';
import {
  InputField,
  Button,
  ErrorMessage,
  PhoneInputField,
} from '../../../components';
import {LoaderContext} from '../../../components/hooks';
import useState from 'react-usestateref';
import {Colors, ICON_CONSTANTS, Strings, wp} from '../../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import ADIcon from 'react-native-vector-icons/AntDesign';
import {CommonActions} from '@react-navigation/native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Auth, DataStore, Hub} from 'aws-amplify';
import {Employee} from '../../../models';
import api from '../../../utils/api';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {loginRequest} from '../../../store/actions';
import {useDispatch} from 'react-redux';

const ConfirmCode = props => {
  const dispatch = useDispatch();
  let isLoggedIn = false;
  const {navigation, route} = props;
  const {setLoader, setlogInErr, logInErr, signUpData, setUser} = useContext(
    LoaderContext,
  );
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [_props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  // useEffect(()=>{
  //   setLoader(false)
  // },[])

  const backHandler = () => {
    navigation.goBack();
  };

  const checkAction = () => {
    value.length < 6 ? resendCode() : confirmSignUpCode();
  };

  const confirmSignUpCode = async () => {
    const {username, password} = signUpData;
    try {
      setLoader(true);
      await Auth.confirmSignUp(username, value);
      userSignIn(username, password);
    } catch (error) {
      setlogInErr(error.message);
      setLoader(false);
    }
  };
  const userSignIn = (username, password) => {
    dispatch(loginRequest({phone: username, password}));
    alert(Strings.sigUpSuccess);
  };
  // const userSignIn = async (username, password) => {
  // await AsyncStorage.setItem(
  //   'signInData',
  //   JSON.stringify({phone: username, password}),
  // );
  // try {
  //   const signInnUser = await api.signIn(username, password);
  //   setUser(signInnUser);
  //   dataStoreHelper.resetDatastore();
  //   alert(Strings.sigUpSuccess);
  // } catch (error) {}
  // };

  const resendCode = async () => {
    const {username} = signUpData;
    try {
      setLoader(true);
      await Auth.resendSignUp(username);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
      alert(Strings.resendCodeSuccess);
    } catch (error) {
      setlogInErr(error.message);
      setLoader(true);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <TouchableOpacity onPress={backHandler} style={styles.backButton}>
        <Icon
          size={32}
          name={'arrow-back-outline'}
          color={Colors.WHITE.default}
        />
      </TouchableOpacity>
      <Text style={styles.titleText}>{Strings.confirmation}</Text>
      <Text
        style={styles.subText}
      >{`${Strings.enterTheConfirmationCode} (${signUpData?.username})`}</Text>
      <ErrorMessage myErrorMsg={logInErr} />
      <View style={styles.codeFieldsContainer}>
        <CodeField
          // rootStyle={{borderWidth: 0, margin: wp(5)}}
          ref={ref}
          {..._props}
          value={value}
          onChangeText={text => {
            if (logInErr != '') setlogInErr('');
            setValue(text);
          }}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          onPress={checkAction}
          title={
            value.length < 6
              ? Strings.resendCode.toUpperCase()
              : Strings.confirm.toUpperCase()
          }
        />
      </View>
    </View>
  );
};

export default ConfirmCode;
