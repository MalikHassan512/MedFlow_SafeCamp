import React, {useState, useEffect, createContext} from 'react';
import {ActivityIndicator, Dimensions, Modal, Text, View} from 'react-native';
import {Colors} from '../../constants';
import {Hub, Auth} from 'aws-amplify';
import {
  navigateReset,
  navigate,
  nestedNavigateReset,
} from '../../navigator/navigationRef';
import {isNull} from 'lodash';
import api from '../../utils/api';
import {Strings} from '../../constants';
import {useDispatch} from 'react-redux';
import {updateUserRequest} from '../../store/actions';
import dataStoreHelper from '../../utils/dataStoreHelper';
import store from '../../store';
import Global from '../../constants/Global';
export const LoaderContext = createContext();
let signedIn = false;

export const LoaderProvider = ({showLoader, children}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState(null);
  const [logInErr, setlogInErr] = useState('');
  const [signUpData, setSignUpData] = useState(null);
  useEffect(() => {
    Hub.listen(Strings.auth, listener);
    getCurrentUser();
  }, []);
  useEffect(() => {
    console.log('props: ', showLoader);
    setLoader(showLoader);
  }, [showLoader]);

  const getCurrentUser = () => {
    dispatch(updateUserRequest());
  };
  const valueExist = (arr, values) => {
    var value = 0;
    values.forEach(function(word) {
      value = value + arr.includes(word);
    });
    return value === 1;
  };

  const dataStoreListener = async data => {
    try {
      console.log('event is : ', data?.payload?.event);
      if (data?.payload?.event === Strings.ready) {
        setLoader(false);
        if (!!signedIn) {
          signedIn = false;
          let userData = store.getState().reducer.user.user;
          valueExist(userData?.roles, ['Admins', 'Testers'])
            ? navigateReset('DrawerNavigator')
            : navigateReset('DrawerNavigator', {
                screen: 'Main',
                params: {screen: 'MyQR'},
              });
        }
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: AppLoading.js ~ line 64 in App Loading ~ error',
        error,
      );
      // alert(Strings.someThingWrong);
    }
  };
  const listener = async data => {
    switch (data.payload.event) {
      case 'signIn':
        console.log('user is signed in');
        // Hub.listen(Strings.datastore, dataStoreListener);
        signedIn = true;
        // console.log("Data",data.payload.data.attributes["custom:role"])
        // setLoader(false);
        // let userData = await AsyncStorage.getItem('signInData');
        // userData = JSON.parse(userData);
        // if (userData) {
        //   try {
        //     // await Auth.signOut({global: true});
        //     navigateReset(Strings.mainNavigator);
        //   } catch (error) {}
        // }
        break;
      case 'signUp':
        setLoader(false);
        navigate(Strings.confirmCode, signUpData);
        break;
      case 'signUp_failure':
        setlogInErr(data.payload.data.message);
        setLoader(false);
        break;
      case 'signOut':
        setLoader(false);
        // let userSignIn = await AsyncStorage.getItem('signInData');
        // userSignIn = JSON.parse(userSignIn);
        // if (userSignIn) {
        //   await AsyncStorage.removeItem('signInData');
        //   await api.userSignIn(userSignIn.phone, userSignIn.password);
        // } else {
          if(!Global.isLoggingOut){
            navigateReset(Strings.authNavigator);
          }
          Global.isLoggingOut = false
          
        // }
        break;
      case 'signIn_failure':
        console.log("Err")
        setLoader(false);
        if (data.payload.data.message == 'Incorrect username or password.') {
          setlogInErr('Phone Number or Password incorrect');
        } else {
          setlogInErr(data.payload.data.message);
        }
        break;
      case 'forgotPassword':
        alert(Strings.passwordResetProcessed);
        setLoader(false);
        break;
      case 'forgotPassword_failure':
        setlogInErr(data.payload.data.message);
        setLoader(false);
        break;
      case 'forgotPasswordSubmit':
        setLoader(false);
        break;
      case 'forgotPasswordSubmit_failure':
        setLoader(false);
        setlogInErr(data.payload.data.message);
        break;
      case 'tokenRefresh':
        break;
      case 'tokenRefresh_failure':
        break;
      case 'configured':
    }
  };
  return (
    <LoaderContext.Provider
      value={{
        loader,
        setLoader,
        logInErr,
        setlogInErr,
        signUpData,
        setSignUpData,
        user,
        setUser,
      }}
    >
      <View>
        <Modal transparent={true} onRequestClose={() => null} visible={loader}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#00000070',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                borderRadius: 15,
                backgroundColor: '#fff',
                padding: 25,
              }}
            >
              <ActivityIndicator size="large" color={Colors.PINK.default} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '200',
                  color: '#030031',
                  opacity: 1,
                }}
              >
                {Strings.loading}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
      {children}
    </LoaderContext.Provider>
  );
};
