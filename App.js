import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, PanResponder, View, AppState, Alert} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigator';
import {LogBox} from 'react-native';
import {Amplify, Hub} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {LoaderProvider} from './src/components/hooks';
import {DataStore} from '@aws-amplify/datastore';
import {SQLiteAdapter} from '@aws-amplify/datastore-storage-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './src/utils/api';
import moment from 'moment';
import {isNull} from 'lodash';
import {Auth} from 'aws-amplify';
import {navigateReset} from './src/navigator/navigationRef';
import {Strings} from './src/constants';
import dataStoreHelper from './src/utils/dataStoreHelper';
import {Test} from './src/models';
import SplashScreen from 'react-native-splash-screen';
import crashlytics from '@react-native-firebase/crashlytics'

import {
  getAcculaLabTests,
  getCueLabTests,
  getPendingLabTest,
  getRapidAntigenTests,
  updateTestObserver,
} from './src/store/actions';
import {getDeviceName} from 'react-native-device-info';
import Global from './src/constants/Global';
import DeviceInfo from 'react-native-device-info';
import {PREFERRENCE_KEYS, ScreensName} from './src/constants/Strings';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);
LogBox.ignoreAllLogs();

Amplify.configure(awsconfig);
const App = () => {
  const timerId = useRef(false);
  const observerTimerId = useRef(false);
  const [showLoader, setShowLoader] = useState(false);
  const [timeForInactivityInSecond, setTimeForInactivityInSecond] = useState(
    3600,
  );
  const [timeForObserverInSecond, setTimeForObserverInSecond] = useState(6);

  let subscription = null;
  useEffect(() => {
    async function configureData() {
      // You can await here
      resetInactivityTimeout();
      DataStore.configure({
        storageAdapter: SQLiteAdapter,
      });
      await dataStoreHelper.syncStoreData();
      checkUser();
      Hub.listen('datastore', dataStoreListener);
      SplashScreen.hide();
    }
    toggleCrashlytics()
    configureData().then();
  }, []);


  async function toggleCrashlytics() {
    await crashlytics()
      .setCrashlyticsCollectionEnabled(true)
      .then(() => {
        console.log("enabled11")
      });
  }


  const valueExist = (arr, values) => {
    var value = 0;
    values.forEach(function(word) {
      value = value + arr.includes(word);
    });
    return value === 1;
  };
  const checkUser = async () => {
    const user = await api.getCurrentUser();
    if (!isNull(user)) {
      AsyncStorage.getItem(PREFERRENCE_KEYS.LOGIN_DATE).then(
        async loginDate => {
          Global.loginUser = user;
          let today = moment().format('MM/DD/YYYY');
          console.log(`here is the today ${today} and login date ${loginDate}`);
          if (loginDate !== null && loginDate === today) {
            setShowLoader(true);
            let isCompatibleVersionInstalled = await dataStoreHelper.getAppVersion();
            if (isCompatibleVersionInstalled) {
              await DataStore.start();
            } else {
              Alert.alert(
                '',
                'New app version is available. Please install the updated app version',
              );
              setShowLoader(false);
            }
          } else {
            Global.isLoggingOut = true;
            await Auth.signOut();
          }
        },
        async error => {
          await Auth.signOut();
        },
      );
    }
  };
  const dataStoreListener = async data => {
    try {
      console.log('event is : ', data?.payload?.event);
      if (data?.payload?.event === Strings.ready) {
        setShowLoader(!showLoader);
        setShowLoader(false);
        let userData = await api.getCurrentUser();
        Global.loginUser = userData;
        subscribeTestListner();
        let logindate = moment().format('MM/DD/YYYY');
        AsyncStorage.setItem(PREFERRENCE_KEYS.LOGIN_DATE, logindate).then();
        valueExist(userData?.roles, ['Admins', 'Testers'])
          ? navigateReset(Strings.drawerNavigator)
          : navigateReset(Strings.drawerNavigator, {
              screen: 'Main',
              params: {screen: 'MyQR'},
            });
      }
    } catch (error) {
      console.log('🚀 ~ file: AppLoading.js ~ line 104 ~ error', error);
      // alert(Strings.someThingWrong);
    }
  };
  useEffect(() => {
    // const subscription = AppState.addEventListener(
    //   'change',
    //   async nextAppState => {
    //     if (nextAppState === 'active') {
    //       let startTime = await AsyncStorage.getItem(Strings.lastSessionTime);
    //       if (startTime) {
    //         startTime = JSON.parse(startTime);
    //         startTime = moment(startTime);
    //         endTime = moment(new Date());
    //         let secondsDiff = endTime.diff(startTime, 'seconds');
    //         console.log('Seconds:' + secondsDiff);
    //         if (secondsDiff >= 3600) {
    //           await AsyncStorage.removeItem(Strings.lastSessionTime).catch(e =>
    //             console.log(e),
    //           );
    //           const user = await api.getCurrentUser();
    //           if (!isNull(user)) {
    //             handleLogout();
    //           }
    //         }
    //       }
    //     } else {
    //       let date = new Date();
    //       date = JSON.stringify(date);
    //       await AsyncStorage.setItem(Strings.lastSessionTime, date);
    //     }
    //   },
    // );
    // return () => {
    //   subscription.remove();
    // };
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
      },
    }),
  ).current;
  const resetInactivityTimeout = () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(async () => {
      // action after user has been detected idle
      const user = await api.getCurrentUser();
      if (!isNull(user)) {
        handleLogout();
      }
    }, timeForInactivityInSecond * 1000);
  };
  const handleLogout = async () => {
    await Auth.signOut();
    await DataStore.clear();
  };
  useEffect(() => {
    return () => subscription && subscription.unsubscribe();
  }, []);

  const subscribeTestListner = () => {
    if (subscription === undefined || subscription === null || !subscription) {
      subscription = DataStore.observe(Test).subscribe(model => {
        console.log('model is : ', model.element.sequenceNo, 'result is : ', model.element.result);
        if (Global.isCallInprogress) {
          Global.isNewEventReceived = true;
        } else {
          handleTimeOut(model);
        }
      });
    }
  };
  const handleTimeOut = model => {
    Global.isCallInprogress = true;
    updateTests(model);
    setTimeout(() => {
      Global.isCallInprogress = false;
      if (Global.isNewEventReceived) {
        Global.isNewEventReceived = false;
        handleTimeOut(model);
      }
    }, 3000);
  };

  const updateTests = async model => {
    // let element = model ? model.element ? model.element : null : null
    // if(!element){
    //   return
    // }
    let storeData = store.getState().reducer.printer.eventData;
    let {
      pendingLabTests,
      pendingAntigenTests,
      pendingCueTests,
      pendingAcculaTests,
    } = store.getState().reducer.test;
    const {site, lab} = storeData;
    let deviceName = await getDeviceName();
    let testObj = model.element;
    if (site) {
      if (testObj.siteID === site.id) {
        if (
          testObj.test_type == Strings.pcr ||
          isSequenceNoFound(pendingLabTests, testObj.sequenceNo)
        ) {
          store.dispatch(
            getPendingLabTest(
              {siteId: site?.id, labId: lab?.id, loading: false},
              null,
            ),
          );
        }
        if (
          testObj.test_type == Strings.antigen ||
          isSequenceNoFound(pendingAntigenTests, testObj.sequenceNo)
        ) {
          store.dispatch(getRapidAntigenTests({id: site?.id, loading: false}));
        }
        if (
          testObj.test_type == Strings.molecular ||
          isSequenceNoFound(pendingCueTests, testObj.sequenceNo)
        ) {
          store.dispatch(getCueLabTests({id: site?.id, loading: false}));
        }
        if (
          testObj.test_type == Strings.other ||
          isSequenceNoFound(pendingAcculaTests, testObj.sequenceNo)
        ) {
          store.dispatch(getAcculaLabTests({id: site?.id, loading: false}));
        }
      }
    } else {
      console.log('else invoked');
    }
  };
  const isSequenceNoFound = (list, number) => {
    console.log('sequence number is : ', number);
    for (let i = 0; i < list.length; i++) {
      let test = list[i];
      if (test.sequenceNo === number) {
        return true;
      }
    }
    return false;
  };
  return (
    <Provider store={store}>
      <View style={{flex: 1}} {...panResponder.panHandlers}>
        <LoaderProvider showLoader={showLoader}>
          <AppNavigator />
        </LoaderProvider>
      </View>
    </Provider>
  );
};

export default App;
