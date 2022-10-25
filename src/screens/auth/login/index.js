import React, {useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Keyboard,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {DataStore, Hub, syncExpression} from 'aws-amplify';
import {App_Constants, Strings, hp} from '../../../constants';
import {LoaderContext} from '../../../components/hooks';
import styles from './styles';
import DeviceInfo from 'react-native-device-info';
import {
  Button,
  InputField,
  PhoneInputField,
  ErrorMessage,
  AvoidKeyboard,
} from '../../../components';
import useState from 'react-usestateref/dist';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import api from '../../../utils/api';
import {Employee} from '../../../models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {loginRequest} from '../../../store/actions';
import {IS_PAD, wp} from '../../../constants';
const Login = props => {
  const {navigation} = props;
  const {setLoader, logInErr, setlogInErr, setUser} = useContext(LoaderContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passRef, setPassRef] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnable, setEnabled] = useState(false);
  const dispatch = useDispatch();
  const reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!()%*#?&^_-]).{8,}/;
  const navigationHandler = screen => {
    navigation.navigate(screen);
  };
  useEffect(() => {
    setEnabled(isButtonEnable());
  }, [phone, password]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow', _keyboardDidShow);
      Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    Animated.timing(topAnimation, {
      toValue: hp(7.5),
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(imageMargin, {
      toValue: hp(10),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const _keyboardDidHide = () => {
    Animated.timing(topAnimation, {
      toValue: hp(10),
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(imageMargin, {
      toValue: hp(15),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const textChangeHandler = text => {
    if (logInErr != '') {
      setlogInErr('');
    }
    console.log('text is: ', text);
    console.log('text length: ', text.length);
    setPhone(text);
    if (text.length === 15) {
      passRef.current.focus();
    }
  };

  const signIn = async () => {
    setLoader(true);
    let isCompatibleVersionInstalled = await dataStoreHelper.getAppVersion();
    if (isCompatibleVersionInstalled) {
      dispatch(loginRequest({phone, password}));
    } else {
      setLoader(false);
      Alert.alert(
        '',
        'New app version is available. Please install the updated app version',
      );
    }
    // dispatch(loginRequest({phone, password}, async () => {
    //   let appVersion = await dataStoreHelper.getAppVersion()
    //   console.log('App version response is: ', appVersion)
    //   if(DeviceInfo.getVersion() >= appVersion.Version && DeviceInfo.getBuildNumber >= appVersion.Build){
    //     console.log('user is good to login')
    //   }else {
    //     console.log('user need to update the app')
    //     // alert('You need to update the app')
    //   }
    // }));

    // try {
    //   await AsyncStorage.setItem(
    //     'signInData',
    //     JSON.stringify({phone: `+${phone.replace(/\D/g, '')}`, password}),
    //   );
    //   let userSignIn = await api.userSignIn(phone, password);
    //   // console.log('user data is: ', JSON.stringify(userSignIn))
    //   setUser(userSignIn);
    //   dataStoreHelper.resetDatastore();
    // } catch (error) {
    //   console.log('sign in error: ', error);
    // }
  };

  const isButtonEnable = () => {
    return phone.replace(/[\s-]/g, '').length > 11 && reg.test(password);
  };
  const loginHandler = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(loginRequest(null, null));
    }, 1500);
  };

  const topAnimation = useRef(new Animated.Value(hp(10))).current;
  const imageMargin = useRef(new Animated.Value(hp(15))).current;

  useEffect(() => {
    Animated.timing(topAnimation, {
      toValue: hp(10),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [topAnimation]);

  useEffect(() => {
    Animated.timing(imageMargin, {
      toValue: hp(15),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [imageMargin]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
        <Animated.Image
          source={{
            uri: App_Constants.APP_LOGO,
          }}
          style={[styles.appLogo, {marginTop: topAnimation}]}
          resizeMode="contain"
        />
        <Animated.View style={[styles.loadingView, {height: imageMargin}]}>
          {isLoading && <ActivityIndicator size={'large'} />}
        </Animated.View>
        <View>
          <ErrorMessage myErrorMsg={logInErr} />
          <PhoneInputField
            ipad={IS_PAD}
            value={phone}
            icon={'user'}
            placeholder={Strings.phonePH_1}
            onChangeText={textChangeHandler}
          />
          <InputField
            ipad={IS_PAD}
            onRef={ref => setPassRef(ref)}
            value={password}
            icon={'lock1'}
            placeholder={Strings.password}
            onChangeText={text => {
              if (logInErr != '') {
                setlogInErr('');
              }
              setPassword(text);
              isButtonEnable();
            }}
            secureTextEntry
            blurOnSubmit={true}
          />
          <Button
            disabled={!isEnable}
            onPress={() => signIn()}
            title={Strings.signIn}
          />
          <Text style={styles.text}>
            {Strings.dont_have_account}
            {'  '}
            <Text
              onPress={() => navigationHandler(Strings.signUp)}
              style={styles.textLink}
            >
              {Strings.signUp}
            </Text>
          </Text>
          <Text style={styles.text}>
            {Strings.forgotPassword}
            {'  '}
            <Text
              onPress={() => navigationHandler(Strings.reset)}
              style={styles.textLink}
            >
              {Strings.reset}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
