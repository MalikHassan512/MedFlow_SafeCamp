import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import styles from './styles';
import {
  InputField,
  Button,
  PhoneInputField,
  ErrorMessage,
} from '../../../components';
import {Auth, DataStore, Hub} from 'aws-amplify';
import {Colors, Strings, ICON_CONSTANTS, IS_PAD} from '../../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {LoaderContext} from '../../../components/hooks';
import utilityMethods from '../../../utils/utilityMethods';
import {Employee} from '../../../models';
import api from '../../../utils/api';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import ADIcon from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';
import {loginRequest} from '../../../store/actions';

const Reset = props => {
  const dispatch = useDispatch();

  const [phone, setPhone] = useState('');
  const {setLoader, setlogInErr, logInErr, setUser} = useContext(LoaderContext);
  // const [displayFields, setDisplayFields] = useState(true);
  const [displayFields, setDisplayFields] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const {navigation} = props;

  const backHandler = () => {
    navigation.goBack();
  };

  const sendCodeHandler = async () => {
    try {
      setLoader(true);
      setlogInErr('');
      const user = await Auth.forgotPassword(`+${phone.replace(/\D/g, '')}`);
      setDisplayFields(true);
    } catch (error) {}
  };

  const changePassword = async () => {
    try {
      if (!utilityMethods.isPasswordValid(newPassword)) {
        setlogInErr(Strings.inValidNewPassword);
        return;
      }
      setLoader(true);
      await Auth.forgotPasswordSubmit(
        `+${phone.replace(/\D/g, '')}`,
        resetCode,
        newPassword,
      );
      userSignIn();
    } catch (error) {}
  };

  const userSignIn = () => {
    let phone_number = `+${phone.replace(/\D/g, '')}`;

    dispatch(loginRequest({phone: phone_number, password: newPassword}));
    alert(
      'You have successfully reset your password. We are logging you in now...',
    );
  };

  // const userSignIn = async () => {
  //   let phone_number = `+${phone.replace(/\D/g, '')}`;
  //   await AsyncStorage.setItem(
  //     'signInData',
  //     JSON.stringify({phone: phone_number, password: newPassword}),
  //   );
  //   try {
  //     const user = await api.signIn(phone_number, newPassword);
  //     if (user !== undefined) {
  //       setUser(user);
  //       dataStoreHelper.resetDatastore();
  //       alert(
  //         'You have successfully reset your password. We are logging you in now...',
  //       );
  //     }
  //   } catch (error) {}
  // };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <TouchableOpacity onPress={backHandler} style={styles.backButton}>
        <Icon
          size={IS_PAD ? 36 : 32}
          name={'arrow-back-outline'}
          color={Colors.WHITE.default}
        />
      </TouchableOpacity>
      <Text style={styles.titleText}>{Strings.resetPass}</Text>
      <ErrorMessage myErrorMsg={logInErr} />
      <View style={styles.phInputContainer}>
        <PhoneInputField
          ipad={IS_PAD}
          value={phone}
          icon={'user'}
          placeholder={Strings.phonePH}
          onChangeText={setPhone}
          keyboardType={'phone-pad'}
        />
      </View>
      {displayFields && (
        <>
          <View style={styles.displayFields}>
            <InputField
              ipad={IS_PAD}
              placeholder={Strings.verificationCode}
              autoFocus={true}
              keyboardType={'number-pad'}
              icon={'checkcircle'}
              placeholderTextColor={'#D8D8D8'}
              value={resetCode}
              onChangeText={text => {
                setlogInErr('');
                setResetCode(text);
              }}
            />
          </View>
          <View style={styles.newPasswordContainer}>
            <InputField
              ipad={IS_PAD}
              placeholder={Strings.newPassword}
              autoCapitalize={'none'}
              autoCorrect={false}
              secureTextEntry={true}
              icon={'lock1'}
              placeholderTextColor={'#D8D8D8'}
              value={newPassword}
              onChangeText={text => {
                if (!utilityMethods.isPasswordValid(text)) {
                  setlogInErr(Strings.inValidNewPassword);
                } else {
                  setlogInErr('');
                }
                setNewPassword(text);
              }}
            />
          </View>
        </>
      )}
      {displayFields && (
        <TouchableOpacity
          style={styles.resendCodeBtn}
          onPress={sendCodeHandler}
        >
          <Text style={styles.resendCodeText}>Resend Code</Text>
        </TouchableOpacity>
      )}
      {displayFields ? (
        <Button
          disabled={
            phone === '' ||
            resetCode === '' ||
            !utilityMethods.isPasswordValid(newPassword)
          }
          style={
            phone !== '' &&
            resetCode !== '' &&
            utilityMethods.isPasswordValid(newPassword)
              ? styles.buttonActive
              : styles.buttonDisable
          }
          onPress={() => changePassword()}
          title={Strings.changePassword.toUpperCase()}
        />
      ) : (
        <Button
          onPress={() => sendCodeHandler()}
          disabled={phone.length < 9}
          title={Strings.sendCode.toUpperCase()}
        />
      )}
    </View>
  );
};

export default Reset;
