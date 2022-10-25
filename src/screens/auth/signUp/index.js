import React, {useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import Pdf from 'react-native-pdf';
import styles from './styles';
import {
  InputField,
  Button,
  PhoneInputField,
  ErrorMessage,
  AvoidKeyboard,
} from '../../../components';
import Auth from '@aws-amplify/auth';
import {LoaderContext} from '../../../components/hooks';
import utilityMethods from '../../../utils/utilityMethods';
import useState from 'react-usestateref';
import {
  Colors,
  ICON_CONSTANTS,
  IS_IPHONE_X,
  Strings,
  hp,
  IS_IPHONE,
  IS_PAD,
} from '../../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {loginRequest} from '../../../store/actions/auth';
import {useDispatch} from 'react-redux';
import {isPossiblePhoneNumber, AsYouType} from 'libphonenumber-js';

const SignUp = props => {
  const {navigation} = props;
  const {setLoader, logInErr, setlogInErr, setSignUpData} = useContext(
    LoaderContext,
  );
  const dispatch = useDispatch();
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfIsPrivacy, setPdfIsPrivacy] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEnable, setEnabled] = useState(false);
  const [myErrorMsg, setErrorMsg] = useState('');
  const [lnRef, setLNRef] = useState(useRef(null));
  const [fnRef, setFNRef] = useState(useRef(null));
  const [pRef, setPRef] = useState(useRef(null));
  const [eRef, setERef] = useState(useRef(null));
  const [passRef, setPassRef] = useState(useRef(null));
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const backHandler = () => {
    navigation.goBack();
  };
  useEffect(() => {
    setEnabled(isButtonEnable());
  }, [firstName, lastName, phone, password]);

  const createAccountHandler = () => {
    dispatch(loginRequest(null, null));
  };
  const onPhoneChange = text => {
    if (logInErr != '') setlogInErr('');
    setPhone(text);
    if (text.length === 15) {
      eRef.current.focus();
    }
  };
  const isButtonEnable = () => {
    return (
      firstName.length > 2 &&
      lastName.length > 2 &&
      phone.length > 10 &&
      password.length > 7
    );
  };
  const checkFields = () => {
    if (!utilityMethods.isEmailValid(email))
      return setlogInErr(Strings.inValidEmail);
    if (!utilityMethods.isPasswordValid(password))
      return setlogInErr(Strings.inValidPassword);
    signUpUser();
  };

  const getSignUpParams = () => {
    const signUpParams = {
      username: `+${phone.replace(/\D/g, '')}`,
      password: password,
      attributes: {
        email: email,
        phone_number: `+${phone.replace(/\D/g, '')}`,
        'custom:firstName': firstName,
        'custom:lastName': lastName,
        'custom:role': 'Employees',
      },
    };
    return signUpParams;
  };

  const signUpUser = async () => {
    const signUpParams = getSignUpParams();
    setSignUpData({
      username: signUpParams.username,
      password: password,
      confirmation: false,
    });
    try {
      setLoader(true);
      const signUp = await Auth.signUp(signUpParams);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <AvoidKeyboard>
        <TouchableOpacity onPress={backHandler} style={styles.backButton}>
          <Icon
            size={IS_PAD ? 36 : 32}
            name={'arrow-back-outline'}
            color={Colors.WHITE.default}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{Strings.newAccount}</Text>
        <ErrorMessage myErrorMsg={logInErr} signup />
        <InputField
          ipad={IS_PAD}
          containerStyle={{marginTop: 20}}
          onRef={ref => setFNRef(ref)}
          icon={'user'}
          value={firstName?.replace(/[^a-zA-Z.\s]+/g, '').trimStart()}
          placeholder={Strings.firstName}
          onSubmitEditing={() => lnRef.current.focus()}
          onChangeText={text => {
            if (logInErr != '') setlogInErr('');
            setFirstName(text);
          }}
        />
        {firstName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim().length > 0 &&
          firstName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim()?.length < 3 && (
            <ErrorMessage myErrorMsg={Strings.invalidFirstName} alignStart />
          )}
        <InputField
          ipad={IS_PAD}
          containerStyle={{marginTop: 10}}
          onRef={ref => setLNRef(ref)}
          icon={'user'}
          value={lastName?.replace(/[^a-zA-Z.\s]+/g, '').trimStart()}
          placeholder={Strings.lastName}
          onSubmitEditing={() => pRef.current.focus()}
          onChangeText={text => {
            if (logInErr != '') setlogInErr('');
            setLastName(text);
          }}
        />
        {lastName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim().length > 0 &&
          lastName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim()?.length < 3 && (
            <ErrorMessage myErrorMsg={Strings.invalidLastName} alignStart />
          )}
        <PhoneInputField
          ipad={IS_PAD}
          containerStyle={{marginTop: 10}}
          onRef={ref => setPRef(ref)}
          icon={'phone'}
          placeholder={Strings.phonePH}
          onSubmitEditing={() => eRef.current.focus()}
          keyboardType={'phone-pad'}
          onChangeText={onPhoneChange}
        />
        {phone?.length > 0 &&
          !isPossiblePhoneNumber(new AsYouType('US').input(phone), 'US') && (
            <ErrorMessage myErrorMsg={Strings.invalidPhoneNumber} alignStart />
          )}

        <InputField
          ipad={IS_PAD}
          value={email}
          // value={email?.replace(/[^a-zA-Z0-9.@_]+/g, '')}
          containerStyle={{marginTop: 10}}
          onRef={ref => setERef(ref)}
          type={ICON_CONSTANTS.MCIcon}
          icon={'email-outline'}
          keyboardType={'email-address'}
          autoCapitalize="none"
          placeholder={Strings.email}
          onSubmitEditing={() => passRef.current.focus()}
          onChangeText={text => {
            if (logInErr != '') setlogInErr('');
            setEmail(text);
          }}
        />
        {/* {email?.replace(/[^a-zA-Z0-9.@_]+/g, '')?.length > 0 && */}
        {email?.replace(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,20}$/g, '')?.length > 0 &&
          reg.test(email?.replace(/\s/g, '')) === false && (
            <ErrorMessage myErrorMsg={Strings.inValidEmailAddress} alignStart />
          )}

        <InputField
          ipad={IS_PAD}
          containerStyle={{marginTop: 10}}
          onRef={ref => setPassRef(ref)}
          blurOnSubmit={true}
          returnKeyType={'done'}
          icon={'lock1'}
          autoCapitalize="none"
          secureTextEntry
          placeholder={Strings.passwordPH}
          onChangeText={text => {
            if (logInErr != '') setlogInErr('');
            setPassword(text);
          }}
        />
        <Text style={styles.termsText}>
          {Strings.signUpTermsOfUse}
          {/* <TouchableOpacity> */}
          <Text onPress={() => setPdfModal(true)} style={styles.termsTextLink}>
            {Strings.termsOfUse}
          </Text>
          {/* </TouchableOpacity> */}
          {/* {' and '} */}
          {/* <TouchableOpacity> */}
          <Text style={{color: 'white'}}> and </Text>
          <Text
            onPress={() => {
              setPdfIsPrivacy(true);
              setPdfModal(true);
            }}
            style={styles.termsTextLink}
          >
            {Strings.privacyPolicy}
          </Text>
          {/* </TouchableOpacity> */}
        </Text>

        <Button
          onPress={() => checkFields()}
          disabled={!isEnable}
          title={Strings.create.toUpperCase()}
        />
      </AvoidKeyboard>
      <Modal
        visible={pdfModal}
        transparent
        onRequestClose={() => setPdfModal(false)}
        animationType="slide"
      >
        <View style={styles.pdfModalContainer}>
          <SafeAreaView />
          <TouchableOpacity
            onPress={() => setPdfModal(false)}
            style={styles.backButton}
          >
            <Icon
              size={32}
              name={'arrow-back-outline'}
              color={Colors.WHITE.default}
            />
          </TouchableOpacity>
          <Pdf
            source={
              pdfIsPrivacy
                ? {
                    uri:
                      'https://medflow-images.s3.eu-west-1.amazonaws.com/PrivacyPolicy-MedFlow.pdf',
                  }
                : {
                    uri:
                      'https://medflow-images.s3.eu-west-1.amazonaws.com/TermsofUse-MedFlow.pdf',
                  }
            }
            style={{flex: 1}}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SignUp;
