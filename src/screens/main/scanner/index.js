import React, {useEffect, useContext, useRef, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  BackHandler,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import styles from './styles';
import {
  HeaderWithBack,
  LoadingView,
  TestConfirmation,
} from '../../../components';
import {LoaderContext} from '../../../components/hooks';
import useState from 'react-usestateref';
import {
  Strings,
  ICON_CONSTANTS,
  Colors,
  App_Constants,
  wp,
} from '../../../constants';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useDispatch, useSelector} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import qrHelper from '../../../utils/qrHelper';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {navigateReset} from '../../../navigator/navigationRef';
import {updateCreateSource} from '../../../store/actions';
import PassportScanner from './passportScanner';
import {CommonActions} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import {popScreen} from '../../../navigator/navigationRef';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import Utilits from '../../../utils/utilityMethods';
import { SCAN_TYPES } from '../../../constants/Strings';

const Scanner = props => {
  const {navigation, route} = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const {user} = useSelector(state => state.reducer.user);
  const {setLoader} = useContext(LoaderContext);
  const [screenFocus, setScreenFocus] = useState(true);
  const [isTorchOn, setTorchOn] = useState(true);
  const [isPassport, setIsPassport] = useState(false);
  const [scanType, setScanType] = useState(App_Constants.QR_CODE);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [testCreated, setTestCreated, testCreatedRef] = useState(false);
  const [testType, setTestType] = useState([]);
  const {printer, employee, test} = useSelector(state => state.reducer);

  useEffect(() => {
    if (focused) {
      if (route?.params?.selectedTests) {
        setTestType(route?.params?.selectedTests);
      }
      setScreenFocus(true);
      if (Platform.OS === 'ios') checkCameraPermission();
      checkFlowType();
      PermissionsCheck();
    } else {
      setScreenFocus(false);
    }
  }, [focused]);

  function handleBackButtonClick() {
    popScreen();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const PermissionsCheck = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Access',
          message: 'SafeCamp would like to access your CAMERA!',
        },
      );
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
      } else {
        console.log('Granted Android');
        setUseCamera(true);
      }
    } else {
      request(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          if (result == 'granted') {
            setUseCamera(true);
          }
        })
        .catch(error => {
          setUseCamera(false);
        });
    }
  };

  const checkFlowType = () => {
    if (route?.params?.testType && route?.params?.testType == Strings.pcr) {
      setScanType(App_Constants.BAR_CODE);
    }
  };

  const onScanHandler = async ({type, data}) => {
    if (
      !route?.params?.testType &&
      (type === 'CODE_128' || type.toLowerCase().includes('code128'))
    ) {
    } else {
      setScreenFocus(false);
      setLoader(true);
      console.log('Scan data is: ', type, typeof data, data.length < 16, data);
      if (route?.params?.testType) {
        const barCodeExist = await dataStoreHelper.isBarcodeAlreadyExist(data);
        if (barCodeExist.length > 0) {
          setLoader(false);
          Alert.alert(
            '',
            Strings.TUBE_ALREADY_SCANNED,
            [
              {
                text: 'Ok',
                onPress: () => {
                  setScreenFocus(true);
                },
              },
            ],
            {
              cancelable: false,
              onDismiss: () => {
                setScreenFocus(true);
              },
            },
          );
          return;
        } else {
          await preFilledBarCode(0, type, data);
        }
      } else {
        await scanBarCode(type, data);
      }
    }
  };
  const preFilledBarCode = async (index, type, data) => {
    if (data == '') {
      setScreenFocus(true);
      setLoader(false);
      return;
    }
    setScreenFocus(false);
    setLoader(true);
    if (testType[index]?.selected) {
      route?.params?.createNewTest(
        testType[index].value,
        employee?.employeeInfo,
        data,
        null,
        null,
        false,
        result => {
          if (result) {
            let tempArray = testType;
            tempArray[index].testCreated = !tempArray[index].testCreated;
            setTestType([...tempArray]);
            setTestCreated(true);
          }
          if (index == testType?.length - 1) {
            setLoader(false);
            if (testCreatedRef?.current) {
              setDisplayConfirmation(true);
              setTimeout(() => {
                setDisplayConfirmation(false);
                navigationToRespectiveScreen(testType[index].value);
              }, 3000);
            } else {
              setScreenFocus(true);
            }
          } else {
            if (testType[index + 1].selected) {
              // setTimeout(() => {
              preFilledBarCode(index + 1, type, data);
              // }, 3000);
            } else {
              preFilledBarCode(index + 1, type, data);
            }
          }
        },
      );
    } else {
      if (index == testType?.length - 1) {
        setLoader(false);
        if (testCreatedRef?.current) {
          setDisplayConfirmation(true);
          setTimeout(() => {
            setDisplayConfirmation(false);
            navigationToRespectiveScreen(testType[index].value);
          }, 3000);
        } else {
          setScreenFocus(true);
        }
      } else {
        if (testType[index + 1].selected && testCreatedRef?.current) {
          // setTimeout(() => {
          preFilledBarCode(index + 1, type, data);
          // }, 3000);
        } else {
          preFilledBarCode(index + 1, type, data);
        }
      }
    }
    // });
  };
  const getCreatedTestTypes = () => {
    let createList = testType.filter(testtype => testtype.testCreated);
    return createList ? createList : [];
  };
  const navigationToRespectiveScreen = type => {
    navigateReset('StartTest');
    setScreenFocus(true);
    setLoader(false);
    return;
    let list = getCreatedTestTypes();
    if (list.length > 0) {
      if (list.length > 1) {
        navigateReset('StartTest');
      } else {
        if (type === Strings.pcr) {
          navigateReset('StartTest');
        } else if (type === Strings.antigen) {
          navigateReset('RapidAntigenTest');
        } else if (type === Strings.molecular) {
          navigateReset('CueTest');
        } else if (type === Strings.other) {
          navigateReset('AcculaTests');
        }
      }
    }
  };
  const scanBarCode = async (type, data) => {
    isTorchOn && setTorchOn(false);
    if (
      typeof data === 'string' &&
      (type === 'CODE_93' ||
        type === 'QR_CODE' ||
        type === 256 ||
        type.toLowerCase().includes('qrcode'))
    ) {
      console.log('IN phone number');
      await getEmployeeInfoWithIdOrPhoneNumber(type, data);
    } else {
      await getEmployeeFromLicenceCard(type, data);
    }
  };
  const getEmployeeFromLicenceCard = async (type, data) => {
    console.log('license data is : ', data);
    dispatch(updateCreateSource(Strings.SCAN_LICENCE));
    let demoRecord = qrHelper.createRecordFromScan(qrHelper.parsePDF147(data));
    if (
      demoRecord.firstName === '' &&
      demoRecord.lastName === '' &&
      demoRecord.idNumber === '' &&
      demoRecord.dob === ''
    ) {
      setScreenFocus(true);
      setLoader(false);
      navigation.navigate('FormInput', {
        phone: data.length === 10 ? data : '',
      });
      return;
    } else {
      console.log('else invoked');
      setScreenFocus(true);
      setLoader(false);
      let recordToForward = qrHelper.generateRecord(demoRecord);
      if (recordToForward?.license) {
        checkEmployeeViaLicense(recordToForward);
      } else {
        navigation.navigate('FormInput', {
          record: recordToForward ? recordToForward : null,
          isListing: true,
        });
      }
    }
  };
  const getEmployeeInfoWithIdOrPhoneNumber = async (type, data) => {
    let userDemographics = '';
    let user = [];
    if (data.length < 20) {
      // user = await dataStoreHelper.searchEmployeeWithNum(data);
    }
    if (user.length === 0) {
      let siteId = printer?.eventData?.site?.id ? printer?.eventData?.site?.id : ''
      let userRecord = await dataStoreHelper.getPreRegisterEmployee(data, true, siteId, SCAN_TYPES.SCAN);
      setScreenFocus(true);
      setLoader(false);
      console.log('scanner userRecord : ',userRecord)
      if (userRecord.length != 0) {
        
        let latestEmp = userRecord[0];
        if (latestEmp?.isHR && userRecord.length === 1 && Utilits.hasTodaySchedule(latestEmp)) {
          console.log('scanner testTwo : ',latestEmp.testTwo)
          let isHRTestRequired = false;
          let testTypeString = null;
          let onLocationTests = [];
          let labelPrintingMessage = null;
          let atHomeTests = latestEmp?.testTwo ? latestEmp?.testTwo : [];
          let tasks = latestEmp?.testTwo ? latestEmp?.testTwo : [];
          let dailySchedule = latestEmp?.dailyTask ? latestEmp?.dailyTask : [];
          let onBoardingTest = null//latestEmp?.onBoardingTesting ? latestEmp?.onBoardingTesting : null;
          let isQuestionOnly = false;
          let isNewHrUser = true;
          let newHrVersionNumber = latestEmp._version;
          let hrEmployeeID = latestEmp.id;
          let isCreateOnBoardingTest = false;

          if (onBoardingTest) {
            let today = moment().format('YYYY-MM-DD');
            let testDate = onBoardingTest.date;
            let testDone = onBoardingTest.isDone
              ? onBoardingTest.isDone
              : false;
            let isLucira = onBoardingTest.lucira
              ? onBoardingTest.lucira
              : false;

            if (
              !testDone &&
              onBoardingTest.location.toLowerCase() === 'on location' &&
              today === testDate &&
              !isLucira
            ) {
              isCreateOnBoardingTest = true;
              isHRTestRequired = true;
              testTypeString = `${latestEmp.first.toUpperCase()} ${latestEmp.last.toUpperCase()} is an active employee with ${
                printer?.eventData?.site?.name
              }, they are scheduled to take a ${
                onBoardingTest.label
              } test, would you like to print this label?`;
              labelPrintingMessage = `Your ${onBoardingTest.label} test label is printing`;
              onLocationTests.push(onBoardingTest);
            }
          }
          if (
            atHomeTests.length === 0 &&
            tasks.length === 0 &&
            !isCreateOnBoardingTest
          ) {
            dailySchedule.forEach(element => {
              if (
                element.scheduleCategory.toLowerCase() === 'question' &&
                element.isDone
              ) {
                dataStoreHelper
                  .hrCheckIn(hrEmployeeID, newHrVersionNumber)
                  .then();
                isQuestionOnly = true;
                let checkIn = latestEmp.checkIn ? latestEmp.checkIn : '';
                console.log('checkin date is: ', checkIn);

                Alert.alert(
                  '',
                  checkIn
                    ? 'You already checked-In please proceed with your day.'
                    : 'You successfully checked-In please proceed with your day.',
                  [
                    {
                      text: 'Ok',
                      onPress: async () => {
                        navigateReset('StartTest');
                      },
                    },
                  ],
                );
              } else {
                Alert.alert(
                  '',
                  `${latestEmp.first.toUpperCase()} ${latestEmp.last.toUpperCase()} is an active employee with ${
                    printer?.eventData?.site?.name
                  }, they have not fulfilled their required pre screening. Please direct them to contact their production coordinator`,
                  [
                    {
                      text: 'Ok',
                      onPress: async () => {
                        navigateReset('StartTest');
                      },
                    },
                  ],
                );
              }
            });
            isQuestionOnly = true;
          }
          if (!isCreateOnBoardingTest) {
            for (let i = 0; i < tasks.length; i++) {
              console.log('log 2');
              let t = tasks[i];
              let isLuciraTest = t.lucira ? t.lucira : false;
              if (
                !t.isDone &&
                t.location.toLowerCase() === 'on location' &&
                !isLuciraTest
              ) {
                console.log('log 4');
                onLocationTests.push(t);
                if (testTypeString) {
                  console.log('log 5');
                  if (i === tasks.length - 1) {
                    testTypeString = `${testTypeString} and a ${t.label}`;
                    labelPrintingMessage = `${labelPrintingMessage} and a ${t.label}`;
                  } else {
                    testTypeString = `${testTypeString}, ${t.label}`;
                    labelPrintingMessage = `${labelPrintingMessage}, ${t.label}`;
                  }
                } else {
                  console.log('log 6');
                  testTypeString = t.label;
                  labelPrintingMessage = t.label;
                }
              }
            }
            if (testTypeString) {
              console.log('log 3');
              isHRTestRequired = true;
              testTypeString = `${latestEmp.first.toUpperCase()} ${latestEmp.last.toUpperCase()} is an active employee with ${
                printer?.eventData?.site?.name
              }, they are scheduled to take a ${testTypeString} test, would you like to print this label?`;
              labelPrintingMessage =
                tasks.length > 1
                  ? `Your ${labelPrintingMessage} test labels are printing`
                  : `Your ${labelPrintingMessage} test label is printing`;
            }
          }
          setScreenFocus(true);
          setLoader(false);
          if (testTypeString) {
            let testList = onLocationTests;
            latestEmp = {
              ...latestEmp,
              testTypeString,
              testList,
              labelPrintingMessage,
            };
            dispatch(
              updateCreateSource(
                latestEmp?.isHR
                  ? Strings.SCAN_HR_QR_CODE
                  : Strings.SCAN_PRE_REGISTERD,
              ),
            );
            navigation.navigate('FormInput', {
              record: latestEmp ? latestEmp : null,
              isHRScanned: true,
              isListing: true,
            });
          } else {
            dispatch(updateCreateSource(Strings.SCAN_QR_CODE));
            navigation.navigate('FormInput', {
              record: latestEmp ? latestEmp : null,
              isHRScanned: true,
              isListing: true,
            });
          }
        } else {
          setScreenFocus(true);
          setLoader(false);
          dispatch(updateCreateSource(Strings.SCAN_QR_CODE));
          if (userRecord.length == 1) {
            console.log("🚀 ~ file: index.js ~ line 485 ~ getEmployeeInfoWithIdOrPhoneNumber ~ userRecord", userRecord)
            let employee_demographics = await dataStoreHelper.getDemoGraphicData(
              userRecord[0],
            );
            console.log("🚀 ~ file: index.js ~ line 489 ~ getEmployeeInfoWithIdOrPhoneNumber ~ employee_demographics", employee_demographics)
            navigation.navigate('FormInput', {
              record: employee_demographics,
              isListing: true,
            });
          } else {
            Alert.alert(
              '',
              Strings.recordFound,
              [
                {
                  text: 'Ok',
                  onPress: () => {},
                },
              ],
              {
                cancelable: false,
                onDismiss: () => {},
              },
            );
            navigation.navigate('EmployeeListing', {
              employees: [...userRecord],
              fromScanner: true,
              scannedData: data,
              isPreRegister: true,
            });
          }
        }
      } else {
        setScreenFocus(true);
        setLoader(false);
        navigation.navigate('FormInput');
      }
    } else {
      setScreenFocus(true);
      setLoader(false);
      dispatch(updateCreateSource(Strings.SCAN_QR_CODE));
      Alert.alert(
        '',
        Strings.recordFound,
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {
          cancelable: false,
          onDismiss: () => {},
        },
      );
      navigation.navigate('EmployeeListing', {
        employees: [...user],
        fromScanner: true,
        scannedData: data,
        isPreRegister: true,
      });
    }
  };
  const checkEmployeeViaLicense = async value => {
    let employees = await dataStoreHelper.searchEmployeeWithLicense(
      value?.license,
    );
    if (employees?.length > 1) {
      Alert.alert(
        '',
        Strings.recordFoundLicense,
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {
          cancelable: false,
          onDismiss: () => {},
        },
      );
      navigation.navigate('EmployeeListing', {
        employees: [...employees],
        fromScanner: true,
        scannedData: value,
      });
    } else {
      if (employees?.length == 1) {
        let employee_demographics = await dataStoreHelper.getDemoGraphicData(
          employees[0],
        );
        navigation.navigate('FormInput', {
          record: employee_demographics,
          isListing: true,
        });
      } else {
        let emp = {...value, newScan: true}
        navigation.navigate('FormInput', {
          record: emp ? emp : null,
          isListing: true,
        });
      }
    }
  };

  const checkCameraPermission = () => {
    check(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        console.log('premission status is: ', result);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            setUseCamera(false);
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            setUseCamera(true);
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setUseCamera(true);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            setUseCamera(false);
            break;
        }
      })
      .catch(error => {
        // …
      });
  };

  const backHandler = () => {
    popScreen();
  };

  const toggleSwitch = () => {
    if (scanType === App_Constants.BAR_CODE) {
      setScanType(App_Constants.QR_CODE);
    } else {
      setScanType(App_Constants.BAR_CODE);
    }
  };

  const toggleTorch = () => {
    // Torch.switchState(!isTorchOn)
    setTorchOn(!isTorchOn);
  };
  const toggleScanType = () => {
    setIsPassport(!isPassport);
  };

  const onScan = e => {
    console.log('scan data is: ', e);
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err),
    // );
  };
  const getSelectedTests = () => {
    let newList = [];
    let message = '';
    testType.map((item, index) => {
      if (item.testCreated) newList.push(item);
    });
    newList.map((item, index) => {
      if (message) {
        message = `${message}${index === newList.length - 1 ? ' and ' : ', '} ${
          item.label
        }`;
      } else {
        message = item.label;
      }
    });

    return message;
    // let newList = [];
    // testType.map((item, index) => {
    //   if (item.testCreated) newList.push(item.label);
    // });
    // return newList;
  };
  const getSelectedTestsLength = () => {
    let newList = [];
    testType.map((item, index) => {
      if (item.testCreated) newList.push(item.label);
    });
    return newList.length;
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{backgroundColor: Colors.BLACK.background}} />
      {screenFocus ? (
        <>
          <HeaderWithBack
            onBackPress={backHandler}
            // title={isPassport ? Strings.scanPassport : Strings.scanIdQr}
            title={
              isPassport
                ? 'Scan Passport'
                : route?.params?.testType == Strings.pcr
                ? Strings.scanTestTube
                : Strings.scanIdQr
            }
            onSwitchPress={
              route?.params?.testType == Strings.pcr ? false : toggleSwitch
            }
            switchVal={scanType === App_Constants.QR_CODE}
            hideSwitch={
              (route?.params?.testType &&
                route?.params?.testType == Strings.pcr) ||
              isPassport
            }
          />
          {!useCamera ? (
            <View style={styles.noCameraAccessView}>
              <Text style={styles.noCameraAccessText}>
                {Strings.NoCameraAccess}
              </Text>
            </View>
          ) : (
            <>
              {isPassport ? (
                <View style={[{flex: 1}]}>
                  <View
                    style={[
                      styles.cameraContainerStyle,
                      {height: '102%', width: '102%'},
                    ]}
                  >
                    <PassportScanner
                      scanning={value => {
                        setLoader(value);
                      }}
                      scanResult={async result => {
                        let employeeData = await dataStoreHelper.covertPassportJson(
                          result,
                        );
                        checkEmployeeViaLicense(employeeData);
                      }}
                      flashMode={
                        isTorchOn
                          ? RNCamera.Constants.FlashMode.torch
                          : RNCamera.Constants.FlashMode.off
                      }
                    />
                  </View>
                </View>
              ) : (
                <QRCodeScanner
                  vibrate={false}
                  cameraStyle={styles.cameraStyle}
                  topViewStyle={styles.topViewStyle}
                  bottomViewStyle={styles.bottomViewStyle}
                  cameraContainerStyle={styles.cameraContainerStyle}
                  onRead={onScanHandler}
                  reactivate={true}
                  reactivateTimeout={2000}
                  flashMode={
                    isTorchOn
                      ? RNCamera.Constants.FlashMode.torch
                      : RNCamera.Constants.FlashMode.off
                  }
                />
              )}
            </>
          )}
          {isPassport ? null : (
            <View
              style={[
                styles.scannerOutline,
                scanType === App_Constants.BAR_CODE && styles.barcodeOutline,
              ]}
            />
          )}

          <TouchableOpacity style={styles.torchBtn} onPress={toggleTorch}>
            <ICON_CONSTANTS.MCIcon
              name={isTorchOn ? 'flashlight' : 'flashlight-off'}
              style={{fontSize: wp(6)}}
            />
          </TouchableOpacity>
          {!(
            route?.params?.testType && route?.params?.testType == Strings.pcr
          ) && (
            <TouchableOpacity
              style={[styles.torchBtn, {start: 0}]}
              onPress={toggleScanType}
            >
              <ICON_CONSTANTS.Fontisto
                name={!isPassport ? 'passport-alt' : 'qrcode'}
                style={{fontSize: wp(6)}}
              />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={{flex: 1, backgroundColor: Colors.BLACK.background}} />
      )}
      {isLoading && <LoadingView />}
      {/* {!useCamera && (
        
      )} */}
      <TestConfirmation
        display={displayConfirmation}
        setDisplay={setDisplayConfirmation}
        message={`Your ${getSelectedTests()} test ${
          getSelectedTestsLength() > 1 ? 'labels have' : 'label has'
        } been printed.`}
      />
    </View>
  );
};

export default Scanner;
