import React, {useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './styles';
import {
  InputField,
  Button,
  PhoneInputField,
  RadioButtonItem,
  AvoidKeyboard,
  TestConfirmation,
} from '../../../components';
import {LoaderContext} from '../../../components/hooks';
import {useDispatch, useSelector} from 'react-redux';
import useState from 'react-usestateref';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  Colors,
  ICON_CONSTANTS,
  Strings,
  hp,
  wp,
  IS_IPHONE,
  TestTypes,
} from '../../../constants';
import utilityMethods from '../../../utils/utilityMethods';
import Icon from 'react-native-vector-icons/Ionicons';
import {isPossiblePhoneNumber, AsYouType} from 'libphonenumber-js';
import moment from 'moment';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {saveEmployeeInfo} from '../../../store/actions/employeeInfo';
import {
  updateCreateSource,
  updateTestEmpInfo,
  updateTestType,
} from '../../../store/actions';
import {CommonActions} from '@react-navigation/native';
import {navigateReset} from '../../../navigator/navigationRef';
import {getTestTypeName} from '../../../utils/printerHelper';
import Utilits from '../../../utils/utilityMethods';
import { SCAN_TYPES } from '../../../constants/Strings';

const FormInput = props => {
  const {navigation, route} = props;
  const {params} = route;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const {user} = useSelector(state => state.reducer.user);
  const [testCreated, setTestCreated, testCreatedRef] = useState(false);
  const {setLoader} = useContext(LoaderContext);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [lnRef, setLNRef] = useState(useRef(null));
  const [buttonActive, setButtonActive] = useState(false);
  const [fnRef, setFNRef] = useState(useRef(null));
  const [pRef, setPRef] = useState(useRef(null));
  const [eRef, setERef] = useState(useRef(null));
  const [stAddressRef, setStAddressRef] = useState(useRef(null));
  const [cityRef, setCityRef] = useState(useRef(null));
  const [stateRef, setStateRef] = useState(useRef(null));
  const [zipCodeRef, setZipCodeRef] = useState(useRef(null));
  const [dobRef, setDobRef] = useState(useRef(null));
  const [licenseRef, setLicenseRef] = useState(useRef(null));
  const [genderRef, setGenderRef] = useState(useRef(null));
  const [insuranceNameRef, setInsuranceNameRef] = useState(useRef(null));
  const [insuranceIdRef, setInsuranceIdRef] = useState(useRef(null));
  const [disableVaccineRadioBtn, setDisableVaccineRadioBtn] = useState(false);
  const {printer, test, employee} = useSelector(state => state.reducer);
  const {site, lab} = useSelector(state => state.reducer.printer.eventData);
  const scrollViewRef = useRef(null);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [isFutureDate, setIsFutureDate] = useState(false);
  const [allCreatedTest, setAllTest, allCreatedTestRef] = useState([]);
  const [updateData, setUpdateData] = useState(null);

  const backHandler = () => {
    if (params?.updateEmp && params?.screen) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      navigation.navigate(params.screen);
    } else if (navigation.canGoBack()) {
      navigation.navigate('StartTest');
    } else {
      navigation.navigate('StartTest');
    }
  };
  useEffect(() => {
    if (params?.record) {
      if (
        params?.isHRScanned &&
        params?.record?.isHR &&
        params?.record?.testTypeString
      ) {
        Alert.alert('', params?.record?.testTypeString, [
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
                params?.record,
              );
              setDisplayMessage(params?.record?.labelPrintingMessage);
              setDisplayConfirmation(true);
              createHrTests(0, params?.record?.testList, employeeDemographic);
            },
          },
          // },
        ]);
      }
      if (params?.record.isVaccinated) {
        setDisableVaccineRadioBtn(true);
      } else {
        setDisableVaccineRadioBtn(false);
      }
      let phNo = params?.record?.phoneNumber?.includes('+')
        ? params?.record?.phoneNumber
        : `+1${params?.record?.phoneNumber}`;
      if (params?.isListing) {
        setUpdateData({...params?.record});
      }
      setFormData({
        ...formData,
        ...params?.record,
        countryCode: 'us',
        phoneNumber: phNo,
        dob: params?.record?.dob ? params?.record?.dob === null ? null : params?.record?.dob.trim() === '' ? null : params?.record?.dob: null,
        isLucira: params?.record?.isLucira ? params?.record?.isLucira : false,
        isVaccinated: params?.record?.isVaccinated
          ? params?.record?.isVaccinated
          : false,
        whiteGlove: params?.record?.whiteGlove
          ? params?.record?.whiteGlove
          : false,
        employeeType: params?.record?.employeeType
          ? params?.record?.employeeType
          : Strings.staff,
        // dob: moment(params?.record?.dob).format('MMDDYYYY'),
      });
      // pRef?.current?.setValue(`+1${params?.record?.phoneNumber}`);
    } else {
      setFormData({
        ...formData,
        isLucira: false,
        isVaccinated: false,
        whiteGlove: false,
        employeeType: Strings.staff,
      });
    }
  }, []);

  useEffect(() => {
    if (pRef?.current) {
      if (params?.record) {
        let phNo = params?.record?.phoneNumber?.includes('+')
          ? params?.record?.phoneNumber
          : `+1${params?.record?.phoneNumber}`;
        pRef?.current?.setValue(phNo);
        // pRef?.current?.setValue(`+1 ${params?.record?.phoneNumber}`);
      }
    }
  }, [pRef?.current]);

  const patternConsent = (index, data, hrData) => {
    Alert.alert(Strings.alert, Strings.patternTestAlert, [
      {
        text: Strings.no,
        onPress: () => createHrTests(index, data, hrData),
        style: 'cancel',
      },
      {
        text: Strings.yes,
        onPress: async () => onPatternPress(data, hrData),
      },
    ]);
  };
  const handleHrRecord = emp => {
    let latestEmp = emp;
    if (latestEmp?.isHR && Utilits.hasTodaySchedule(latestEmp)) {
      console.log('scanner testTwo : ', latestEmp.testTwo);
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
        let testDone = onBoardingTest.isDone ? onBoardingTest.isDone : false;
        let isLucira = onBoardingTest.lucira ? onBoardingTest.lucira : false;

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
            dataStoreHelper.hrCheckIn(hrEmployeeID, newHrVersionNumber).then();
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
        Alert.alert('', testTypeString, [
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
                latestEmp,
              );
              setDisplayMessage(labelPrintingMessage);
              setDisplayConfirmation(true);
              createHrTests(0, testList, employeeDemographic);
            },
          },
          // },
        ]);
      }
    }
  };
  const createHrTests = async (index, data, hrData) => {
    let hrTest =  data[index]
    let schrTestID = hrTest.id;
    let isHRTest = true;
    let updateHrData = {...hrData, schrTestID, isHRTest};
    console.log('data[index] is ', data[index])
    let availableBarCode = null
    if(hrTest.value === TestTypes.PCR){
      if (lab?.barCodeProvided) {
        availableBarCode = await dataStoreHelper.getAvailableBarcod(
          lab?.id,
        );
      }
    }
    createNewTest(
      data[index].value,
      updateHrData,
      availableBarCode?.barcode ? availableBarCode?.barcode : null,
      null,
      null,
      testCreatedRef?.current,
      result => {
        setTestCreated(true);
        allCreatedTestRef.current.push(result);
        if (index == data.length - 1) {
          setLoader(false);
          setDisplayConfirmation(false);
          if (data.length > 1) {
            showCreatedTestAlert();
          } else {
            navigateReset('StartTest');
          }
        } else {
          createHrTests(index + 1, data, hrData);
        }
        // setTimeout(() => {

        // }, 3000);
      },
    );
  };
  const showCreatedTestAlert = () => {
    let testlist = allCreatedTestRef.current ? allCreatedTestRef.current : [];
    let message = 'The following tests have been created successfully.';
    for (let j = 0; j < testlist.length; j++) {
      let sequence = testlist[j].sequenceNo;
      let type = getTestTypeName(testlist[j].test_type);
      message = message + ` \n\n ${type} -> ${sequence}`;
    }

    Alert.alert('', message, [
      {
        text: 'Ok',
        onPress: async () => {
          navigateReset('StartTest');
        },
      },
    ]);
  };
  const onPatternPress = async (testList, data) => {
    let patternList = await data?.patternConsent;
    let isExistSiteId = false;
    if (patternList) {
      patternList.map(obj => {
        const mObj = JSON.parse(obj);
        if (mObj[eventData?.site?.id]) {
          isExistSiteId = true;
        }
      });
    }
    setLoader(false);
    if (isExistSiteId) {
      navigation.navigate('Questions', {
        createNewTest: createNewTest,
        isPattern: true,
        testTypes: testList,
      });
    } else {
      navigation.push('Signature', {
        createNewTest: createNewTest,
        isPattern: true,
        testTypes: testList,
      });
    }
  };

  const onPhoneChange = text => {
    setFormData({...formData, phoneNumber: text});
    if (text.length === 15) {
      let mobile = text.replace(/\D/g, '').slice(-10);
      eRef.current.focus();
    }
  };
  const onChangeZip = text => {
    if (formData?.zip === '' || formData?.zip === undefined) {
      setFormData({
        ...formData,
        zip: text.replace(/\D/g, ''),
      });
    } else {
      if (
        text.length > formData?.zip?.length &&
        text.replace(/\D/g, '') === formData?.zip
      ) {
        text = text.slice(0, -1);
      }
      setFormData({
        ...formData,
        zip: text.replace(/\D/g, ''),
      });
    }
    if (text.length === 5) {
      licenseRef.current.focus();
      setDatePickerOpen(!isDatePickerOpen);
    }
  };

  // const onChangeDob = text => {
  //   setFormData({...formData, dob: text});
  //   if (formData?.dob === '' || formData?.dob === undefined) {
  //     setFormData({
  //       ...formData,
  //       dob: text.replace(/\D/g, ''),
  //     });
  //   } else {
  //     if (
  //       text.length > formData?.dob.length &&
  //       text.replace(/\D/g, '') === formData?.dob
  //     ) {
  //       text = text.slice(0, -1);
  //     }
  //     setFormData({
  //       ...formData,
  //       dob: text.replace(/\D/g, ''),
  //     });
  //   }
  // };

  const onChangeLicense = text => {
    if (formData?.idNumber === '' || formData?.idNumber === undefined) {
      setFormData({...formData, idNumber: text.toUpperCase()});
    } else {
      if (
        text.length > formData?.idNumber?.length &&
        text.replace(/\D/g, '') === formData?.idNumber
      ) {
        text = text.slice(0, -1);
      }

      setFormData({...formData, idNumber: text.replace('-', '').toUpperCase()});
    }
  };

  const onChangeGender = text => {
    if (text !== '') {
      let gender = text.toLocaleLowerCase();
      if (gender === 'm' || gender === 'f' || gender === 'x') {
        setFormData({...formData, sex: text.toUpperCase()});
      } else {
        setFormData({...formData, sex: ''});
      }
    } else {
      setFormData({...formData, sex: text.toUpperCase()});
    }
  };

  const canMoveForward = () => {
    return (
      formData?.phoneNumber?.length > 10 &&
      isPossiblePhoneNumber(
        new AsYouType(formData?.countryCode).input(formData?.phoneNumber),
        formData?.countryCode,
      ) &&
      formData?.email &&
      utilityMethods.isEmailValid(formData?.email) &&
      formData?.firstName?.length > 1 &&
      formData?.lastName?.length > 1 &&
      formData?.street?.length > 2 &&
      formData?.city?.length > 2 &&
      formData?.state?.length > 1 &&
      formData?.zip?.length > 2 &&
      formData?.dob?.length > 2 &&
      !isFutureDate &&
      formData?.idNumber?.length > 4 &&
      formData?.sex?.length > 0 &&
      (site?.insurance_required
        ? formData?.insurance_name?.length > 2
          ? true
          : false
        : true) &&
      (site?.insurance_required
        ? formData?.insurance_number?.length > 2
          ? true
          : false
        : true) &&
      formData?.isVaccinated != null &&
      // formData?.isLucira != null &&
      (site?.isLucira ? formData?.isLucira != null : true) &&
      formData?.whiteGlove != null &&
      // formData?.testerDes != null
      formData?.employeeType != null
    );
  };
  const onDobConfirm = date => {
    let today = new Date();
    setIsFutureDate(date > today);
    const yearDiff = moment().diff(moment(date).format('YYYY-MM-DD'), 'years');
    setFormData({
      ...formData,
      dob: moment(date).format('MMDDYYYY'),
      fullDob: moment(date).format('YYYY-MM-DD'),
      isEighteenPlus: yearDiff ? (yearDiff > 17 ? true : false) : false,
    });
    setDatePickerOpen(false);
    setTimeout(() => {
      licenseRef.current.focus();
    }, 600);
  };
  const searchEmployeeViaNum = async value => {
    setLoader(true);
    var mobile = value.replace(/\D/g, '').slice(-10);
    let userRecord = await dataStoreHelper.getPreRegisterEmployee(mobile, true, site?.id, SCAN_TYPES.LOOK_UP);
    console.log('here are the user records: ', userRecord);
    if (userRecord.length == 0) {
      // let employees = await dataStoreHelper.searchEmployeeWithNum(mobile);
      // if (employees?.length > 0) {
      //   setLoader(false);
      //   navigation.navigate('EmployeeListing', { employees: [...employees] });
      // } else {
      setLoader(false);
      Keyboard.dismiss();
      alert(Strings.noRecord);
      // }
    } else {
      setLoader(false);
      if (userRecord.length == 1) {
        handleHrRecord(userRecord[0]);
        let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
          userRecord[0],
        );
        setUpdateData({...employeeDemographic});
        if (userRecord[0]?.isVaccinated) {
          setDisableVaccineRadioBtn(true);
        } else {
          setDisableVaccineRadioBtn(false);
        }
        setFormData({
          ...employeeDemographic,
          isLucira: employeeDemographic?.isLucira
            ? employeeDemographic?.isLucira
            : false,
          isVaccinated: employeeDemographic?.isVaccinated
            ? employeeDemographic?.isVaccinated
            : false,
          whiteGlove: employeeDemographic?.whiteGlove
            ? employeeDemographic?.whiteGlove
            : false,
          employeeType: employeeDemographic?.employeeType
            ? employeeDemographic?.employeeType
            : Strings.staff,
        });
        pRef?.current?.setValue(`${employeeDemographic.phoneNumber}`);
        canMoveForward();
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
          isPreRegister: true,
        });
      }
    }
  };
  const searchEmployeeViaEmail = async value => {
    setLoader(true);
    let userRecord = await dataStoreHelper.getPreRegisterEmployee(value, true, site?.id, SCAN_TYPES.LOOK_UP);
    console.log('here are the user records: ', userRecord);
    if (userRecord.length == 0) {
      // let employees = await dataStoreHelper.searchEmployeeWithEmail(value);
      // if (employees?.length > 0) {
      //   setLoader(false);
      //   navigation.navigate('EmployeeListing', { employees: [...employees] });
      // } else {
      setLoader(false);
      Keyboard.dismiss();
      alert(Strings.noRecord);
      // }
    } else {
      setLoader(false);
      if (userRecord.length == 1) {
        handleHrRecord(userRecord[0]);
        let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
          userRecord[0],
        );
        setUpdateData({...employeeDemographic});
        if (userRecord[0]?.isVaccinated) {
          setDisableVaccineRadioBtn(true);
        } else {
          setDisableVaccineRadioBtn(false);
        }
        setFormData({
          ...employeeDemographic,
          isLucira: employeeDemographic?.isLucira
            ? employeeDemographic?.isLucira
            : false,
          isVaccinated: employeeDemographic?.isVaccinated
            ? employeeDemographic?.isVaccinated
            : false,
          whiteGlove: employeeDemographic?.whiteGlove
            ? employeeDemographic?.whiteGlove
            : false,
          employeeType: employeeDemographic?.employeeType
            ? employeeDemographic?.employeeType
            : Strings.staff,
        });
        pRef?.current?.setValue(`${employeeDemographic.phoneNumber}`);
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
          isPreRegister: true,
        });
      }
    }
  };
  const searchEmployeeViaLicense = async value => {
    let employees = await dataStoreHelper.searchEmployeeWithLicense(value);
    if (employees?.length > 0) {
      navigation.navigate('EmployeeListing', {employees: [...employees]});
    } else {
      alert(Strings.noRecord);
    }
  };
  const searchEmployeeViaFilledRecord = async value => {
    setLoader(true);
    let employees = await dataStoreHelper.searchEmployeeWithFilledForm(value);
    if (employees?.length > 0) {
      let findIndex = null;
      var promises = employees.map((updateData, index) => {
        let localMobile = formData?.phoneNumber?.replace(/\D/g, '')?.slice(-10);
        let inputDate = formData?.fullDob ? formData?.fullDob : formData?.dob;
        if (
          formData?.idNumber.trim() === updateData?.id_number.trim() &&
          formData.email.trim().toLocaleLowerCase() ===
            updateData?.email.trim().toLocaleLowerCase() &&
          localMobile === updateData.phone_number &&
          inputDate === updateData?.dob &&
          formData.lastName.trim().toLocaleLowerCase() ===
            updateData?.last.trim().toLocaleLowerCase() &&
          formData.firstName.trim().toLocaleLowerCase() ===
            updateData?.first.trim().toLocaleLowerCase()
        ) {
          findIndex = index;
          return index;
        }
      });
      Promise.all(promises).then(async () => {
        if (findIndex != null) {
          let updatedEmployee = await dataStoreHelper.updateExistingEmployeeRecord(
            employees[findIndex],
            formData,
          );
          dispatch(updateCreateSource(Strings.manual));
          dispatch(saveEmployeeInfo(updatedEmployee));
          checkHippaConsent(updatedEmployee);
        } else {
          createNewEmployee(formData);
        }
      });
    } else {
      createNewEmployee(formData);
    }
  };

  const checkRecordUpdated = async value => {
    if (updateData != null) {
      console.log('here is updated data: ', updateData);
      if (updateData.fetchFrom == 'preRegistration') {
        setLoader(true);
        createNewEmployee(formData);
      } else {
        let localMobile = formData?.phoneNumber?.replace(/\D/g, '')?.slice(-10);
        let liveMobile = updateData?.phoneNumber
          ?.replace(/\D/g, '')
          ?.slice(-10);
        let inputDate = formData?.fullDob ? formData?.fullDob : formData?.dob;
        let isIdNumberSame =
          formData?.idNumber.trim() === updateData?.idNumber.trim();
        let isEmailSame =
          formData.email.trim().toLocaleLowerCase() ===
          updateData?.email.trim().toLocaleLowerCase();
        let isPhoneNumSame = localMobile === liveMobile;
        let isDOBSame = inputDate === updateData?.dob;
        console.log('inputDate is : ', inputDate, "updateData?.dob : ", updateData?.dob)
        let isFirstNameSame =
          formData.firstName.trim().toLocaleLowerCase() ===
          updateData?.firstName.trim().toLocaleLowerCase();
        let isLastNameSame =
          formData.lastName.trim().toLocaleLowerCase() ===
          updateData?.lastName.trim().toLocaleLowerCase();
        if (
          isIdNumberSame &&
          isEmailSame &&
          isPhoneNumSame &&
          isDOBSame &&
          isFirstNameSame &&
          isLastNameSame
        ) {
          setLoader(true);
          let updatedEmployee = await dataStoreHelper.updateExistingEmployeeRecord(
            updateData,
            formData,
          );
          dispatch(updateCreateSource(Strings.manual));
          dispatch(saveEmployeeInfo(updatedEmployee));
          // setLoader(false);
          checkHippaConsent(updatedEmployee);
        } else {
          console.log('form data is : ', formData)
          console.log('updateData is : ', updateData)
          if(formData && formData.newScan){
            createNewEmployee(formData);
            return
          }
          let dataPoints = getUniquePointTitle(
            isPhoneNumSame,
            isEmailSame,
            isFirstNameSame,
            isLastNameSame,
            isDOBSame,
            isIdNumberSame,
          );
          Alert.alert('', `${dataPoints} ${Strings.createNewOrUpdate}`, [
            {
              text: 'Use Old',
              onPress: () => {
                checkHippaConsent(updateData);
              },
            },
            {
              text: 'Create New',
              onPress: () => {
                setLoader(true);
                createNewEmployee(formData);
              },
            },
            {
              text: 'Update',
              onPress: async () => {
                setLoader(true);
                let updatedEmployee = await dataStoreHelper.updateExistingEmployeeRecord(
                  updateData,
                  formData,
                  true,
                );
                dispatch(updateCreateSource(Strings.manual));
                dispatch(saveEmployeeInfo(updatedEmployee));
                // setLoader(false);
                checkHippaConsent(updatedEmployee);
              },
            },
          ]);
        }
      }
    } else {
      searchEmployeeViaFilledRecord(value);
    }
  };
  const getUniquePointTitle = (
    isPhoneNumSame,
    isEmailSame,
    isFirstNameSame,
    isLastNameSame,
    isDOBSame,
    isIdNumberSame,
  ) => {
    let point = null;
    if (!isPhoneNumSame) {
      point = 'Phone Number';
    }
    if (!isEmailSame) {
      if (isFirstNameSame && isLastNameSame && isDOBSame && isIdNumberSame) {
        point = point ? point + ' and Email' : 'Email';
      } else {
        point = point ? point + ', Email' : 'Email';
      }
    }
    if (!isFirstNameSame) {
      if (isLastNameSame && isDOBSame && isIdNumberSame) {
        point = point ? point + ' and First Name' : 'First Name';
      } else {
        point = point ? point + ', First Name' : 'First Name';
      }
    }
    if (!isLastNameSame) {
      if (isDOBSame && isIdNumberSame) {
        point = point ? point + ' and Last Name' : 'Last Name';
      } else {
        point = point ? point + ', Last Name' : 'Last Name';
      }
    }
    if (!isDOBSame) {
      if (isIdNumberSame) {
        point = point ? point + ' and DOB' : 'DOB';
      } else {
        point = point ? point + ', DOB' : 'DOB';
      }
    }
    if (!isIdNumberSame) {
      point = point ? point + ' and License Number' : 'License Number';
    }
    return point ? point : '';
  };
  const checkHippaConsent = data => {
    if (data?.hippaConsent?.includes(site?.id)) {
      checkInsuranceCard(data);
    } else {
      navigateToHippa();
    }
  };
  const navigateToHippa = () => {
    setLoader(false);
    navigation.navigate('Signature', {createNewTest: createNewTest});
  };
  const checkInsuranceCard = data => {
    if (site?.sendInsuranceCard) {
      if (data?.insuranceScan?.includes(site?.id)) {
        checkTestType(data);
      } else {
        setLoader(false);
        navigation.navigate('InsuranceCardImages', {
          createNewTest: createNewTest,
        });
      }
    } else {
      checkTestType(data);
    }
  };
  const checkTestType = async data => {
    let availableBarCode = null;
    if (test.testType) {
      if (test.testType == Strings.pcr) {
        if (printer?.eventData?.lab?.barCodeProvided) {
          availableBarCode = await dataStoreHelper.getAvailableBarcod(
            printer?.eventData?.lab?.id,
          );
          if (availableBarCode == null) {
            setLoader(false);
            alert(
              'No available barcode in this lab. Please select any other lab or wait for some time.',
            );
            return;
          }
        }
        if (!printer?.eventData?.lab?.tubes_provided) {
          setLoader(false);
          navigation.navigate('Scanner', {
            createNewTest: createNewTest,
            testType: Strings.pcr,
            selectedTests: [{label: 'PCR', value: Strings.pcr, selected: true}],
          });
        } else {
          if (site?.patternTesting && test.testType == Strings.pcr) {
            simplePatternConsent(data, availableBarCode);
          } else {
            createTest(data, availableBarCode);
          }
        }
      } else {
        if (
          printer?.eventData?.site?.patternTesting &&
          test.testType == Strings.pcr
        ) {
          simplePatternConsent(data, availableBarCode);
        } else {
          createTest(data, availableBarCode);
        }
      }
    } else {
      setLoader(false);
      navigation.navigate('TestSelection', {createNewTest: createNewTest});
    }
  };
  const simplePatternConsent = (data, availableBarCode) => {
    Alert.alert(Strings.alert, Strings.patternTestAlert, [
      {
        text: Strings.no,
        onPress: () => createTest(data, availableBarCode),
        style: 'cancel',
      },
      {
        text: Strings.yes,
        onPress: async () => onSimplePatternPress(),
      },
    ]);
  };
  const onSimplePatternPress = async () => {
    let patternList = await employee?.employeeInfo?.patternConsent;
    let isExistSiteId = false;
    if (patternList) {
      patternList.map(obj => {
        const mObj = JSON.parse(obj);
        if (mObj[site?.id]) {
          isExistSiteId = true;
        }
      });
    }
    setLoader(false);
    if (isExistSiteId) {
      navigation.navigate('Questions', {
        createNewTest: createNewTest,
        isPattern: true,
        testTypes: [{label: 'PCR', value: Strings.pcr, selected: true}],
      });
    } else {
      navigation.push('Signature', {
        createNewTest: createNewTest,
        isPattern: true,
        testTypes: [{label: 'PCR', value: Strings.pcr, selected: true}],
      });
    }
  };
  const createTest = async (data, availableBarCode) => {
    createNewTest(
      test.testType,
      data,
      availableBarCode?.barcode ? availableBarCode?.barcode : null,
      null,
      null,
      false,
      result => {
        setLoader(false);
        if (result) {
          setDisplayConfirmation(true);
          setTimeout(() => {
            setDisplayConfirmation(false);
            dispatch(updateTestType(null));
            navigationToRespectiveScreen(test.testType);
          }, 3000);
        } else {
          setLoader(false);
        }
      },
    );
  };
  const navigationToRespectiveScreen = type => {
    if (type === Strings.pcr) {
      navigateReset('StartTest');
    } else if (type === Strings.antigen) {
      navigateReset('RapidAntigenTest');
    } else if (type === Strings.molecular) {
      navigateReset('CueTest');
    } else if (type === Strings.other) {
      navigateReset('AcculaTests');
    }
  };

  const updateTestEmpData = data => {
    setLoader(true);
    let payload = {...params.test, employee_demographics: data};
    dispatch(
      updateTestEmpInfo(payload, res => {
        setTimeout(() => {
          if (res === 'Success') {
            if (
              params.test &&
              data.email !== params.test.email &&
              params.test.result &&
              params.test.result !== '' &&
              params.test.result.toLocaleLowerCase() === 'negative'
            ) {
              Alert.alert('', Strings.resendEmailConfirmation, [
                {
                  text: 'No',
                  onPress: () => {
                    if (params?.screen) {
                      setLoader(false);
                      navigation.navigate(params?.screen);
                    }
                  },
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    dataStoreHelper.sendEmailOnUpdate([params.test]);
                    if (params?.screen) {
                      setLoader(false);
                      navigation.navigate(params?.screen);
                    }
                  },
                },
              ]);
            } else {
              if (params?.screen) {
                console.log('going back');
                // setTimeout(() => {
                setLoader(false);
                navigation.navigate(params?.screen, {reload: true});
                // }, 1000);
              }
            }
          }
        }, 1000);
      }),
    );
  };

  const createNewEmployee = async data => {
    var mobile = data?.phoneNumber.replace(/\D/g, '').slice(-10);
    const employee = await dataStoreHelper.createEmployee(
      data,
      mobile,
      printer?.eventData?.clientID,
      printer?.eventData,
    );
    dispatch(updateCreateSource(Strings.manual));
    let employeeDemographic = await dataStoreHelper.getDemoGraphicData({
      ...data,
      ...employee,
    });
    dispatch(saveEmployeeInfo(employeeDemographic));
    setLoader(false);
    navigation.navigate('Signature', {createNewTest: createNewTest});
  };

  const scrollToEnd = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({animated: true});
    }, 200);
  };

  const createNewTest = async (
    testType,
    employeeData,
    myBarCode,
    patternTestAnswer,
    demographics,
    isCreated,
    testResponse,
  ) => {
    let data = {
      sourceType: test.createSourceType,
      eventData: printer?.eventData,
      employeeInfo: employeeData ? employeeData : employee?.employeeInfo,
      currentUser: user,
      testType: testType,
      myBarCode: myBarCode ? myBarCode : null,
      printerData: printer?.printer ? printer?.printer : null,
      patternTestAnswer: patternTestAnswer ? patternTestAnswer : null,
      demographics: formData ? formData : demographics ? demographics : null,
      isCreated: isCreated,
    };
    dataStoreHelper.createTest(data, testCreated => {
      testResponse(testCreated);
    });
  };
  const _renderInputFields = () => {
    return (
      <>
        <PhoneInputField
          onRef={ref => setPRef(ref)}
          placeholder={Strings.phonePH}
          leftIconType={ICON_CONSTANTS.Fontisto}
          onSubmitEditing={() => eRef.current.focus()}
          keyboardType={'phone-pad'}
          initialValue={formData?.phoneNumber}
          value={formData?.phoneNumber}
          onChangeText={onPhoneChange}
          onChangeCountry={code => {
            setFormData({...formData, countryCode: code});
          }}
          iconLeft={
            !params?.updateEmp && formData?.phoneNumber?.length > 5
              ? 'search'
              : null
          }
          onPressLeftIcon={() => {
            if (
              formData?.phoneNumber?.length > 0 &&
              !isPossiblePhoneNumber(
                new AsYouType('US').input(formData?.phoneNumber),
                'US',
              )
            )
              Alert.alert('', Strings.pleaseEnterPhoneNumber);
            else searchEmployeeViaNum(formData?.phoneNumber);
          }}
        />
        {formData?.phoneNumber?.length > 0 &&
          !isPossiblePhoneNumber(
            new AsYouType('US').input(formData?.phoneNumber),
            'US',
          ) && (
            <Text style={styles.errorMsgText}>
              {Strings.invalidPhoneNumber}
            </Text>
          )}
        <InputField
          onRef={ref => setERef(ref)}
          type={ICON_CONSTANTS.MCIcon}
          leftIconType={ICON_CONSTANTS.Fontisto}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
          autoCorrect={false}
          placeholder={Strings.emailAddress}
          onSubmitEditing={() => fnRef.current.focus()}
          value={formData?.email}
          // value={formData?.email?.replace(/[^a-zA-Z0-9.@_]+/g, '')}
          onChangeText={text => {
            let updatedText = text.replaceAll(' ', '')
            setFormData({...formData, email: updatedText})
          }}
          iconLeft={
            !params?.updateEmp &&
            utilityMethods.isEmailValid(formData?.email?.replace(/\s/g, ''))
              ? 'search'
              : null
          }
          onPressLeftIcon={() => searchEmployeeViaEmail(formData?.email)}
        />
        {/* {formData?.email?.replace(/[^a-zA-Z0-9.@_]+/g, '')?.length > 0 &&
          utilityMethods.isEmailValid(
            formData?.email?.replace(/[^a-zA-Z0-9.@_]+/g, ''),
          ) === false && (
            <Text style={styles.errorMsgText}>
              {Strings.inValidEmailAddress}
            </Text>
          )} */}

        {formData?.email?.replace(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,20}$/g, '')
          ?.length > 0 &&
          reg.test(formData?.email?.replace(/\s/g, '')) === false && (
            <Text style={styles.errorMsgText}>
              {Strings.inValidEmailAddress}
            </Text>
          )}

        {/* {email?.replace(/^[\w-\.]+@([\w-]+\.)+[\w-]{2}$/g, '')?.length > 0 &&
          reg.test(email?.replace(/\s/g, '')) === false && (
            <ErrorMessage myErrorMsg={Strings.inValidEmailAddress} alignStart />
          )} */}

        <InputField
          onRef={ref => setFNRef(ref)}
          placeholder={Strings.firstName}
          onSubmitEditing={() => lnRef.current.focus()}
          value={formData?.firstName?.replace(/[^a-zA-Z.\s]+/g, '').trimStart()}
          autoCapitalize={'words'}
          autoCorrect={false}
          onChangeText={text => setFormData({...formData, firstName: text})}
        />
        {formData?.firstName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim().length >
          0 &&
          formData?.firstName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim()?.length <
            2 && (
            <Text style={styles.errorMsgText}>{Strings.invalidFirstName}</Text>
          )}
        <InputField
          onRef={ref => setLNRef(ref)}
          value={formData?.lastName?.replace(/[^a-zA-Z.\s]+/g, '')?.trimStart()}
          placeholder={Strings.lastName}
          autoCapitalize={'words'}
          autoCorrect={false}
          onSubmitEditing={() => stAddressRef.current.focus()}
          onChangeText={text => setFormData({...formData, lastName: text})}
        />
        {formData?.lastName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim().length > 0 &&
          formData?.lastName?.replace(/[^a-zA-Z.\s]+/g, '')?.trim().length <
            2 && (
            <Text style={styles.errorMsgText}>{Strings.invalidLastName}</Text>
          )}
        <InputField
          onRef={ref => setStAddressRef(ref)}
          value={formData?.street?.trimStart()}
          placeholder={Strings.streetAddress}
          autoCapitalize={'words'}
          autoCorrect={false}
          onSubmitEditing={() => cityRef.current.focus()}
          onChangeText={text => setFormData({...formData, street: text})}
        />
        {formData?.street?.trim().length > 0 &&
          formData?.street?.trim().length < 3 && (
            <Text style={styles.errorMsgText}>{Strings.invalidAddress}</Text>
          )}
        <InputField
          onRef={ref => setCityRef(ref)}
          value={formData?.city?.replace(/[^a-zA-Z\s]+/g, '').trimStart()}
          placeholder={Strings.city}
          autoCorrect={false}
          autoCapitalize={'words'}
          onSubmitEditing={() => stateRef.current.focus()}
          onChangeText={text => setFormData({...formData, city: text})}
        />
        {formData?.city?.replace(/[^a-zA-Z\s]+/g, '')?.trim().length > 0 &&
          formData?.city?.replace(/[^a-zA-Z\s]+/g, '').trim().length < 3 && (
            <Text style={styles.errorMsgText}>{Strings.invalidCity}</Text>
          )}
        <InputField
          onRef={ref => setStateRef(ref)}
          value={formData?.state?.replace(/[^a-zA-Z]+/g, '')}
          placeholder={Strings.statePH}
          autoCapitalize={'characters'}
          autoCorrect={false}
          maxLength={2}
          onSubmitEditing={() => zipCodeRef.current.focus()}
          onChangeText={text => {
            setFormData({
              ...formData,
              state: utilityMethods.returnLettersOnly(text).toUpperCase(),
            });
            if (text.length > 1) {
              zipCodeRef.current.focus();
            }
          }}
        />
        {formData?.state?.replace(/[^a-zA-Z]+/g, '')?.trim().length > 0 &&
          formData?.state?.length < 2 && (
            <Text style={styles.errorMsgText}>{Strings.invalidState}</Text>
          )}
        <InputField
          onRef={ref => setZipCodeRef(ref)}
          maxLength={5}
          value={formData?.zip ? utilityMethods.formatZIP(formData?.zip) : ''}
          placeholder={Strings.zipCodePH}
          keyboardType={'number-pad'}
          onSubmitEditing={() => dobRef.current.focus()}
          onChangeText={onChangeZip}
          autoCorrect={false}
        />
        {formData?.zip?.trim().length > 0 && formData?.zip?.length < 5 && (
          <Text style={styles.errorMsgText}>{Strings.invalidZip}</Text>
        )}
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setDatePickerOpen(!isDatePickerOpen);
            }}
          >
            <View style={styles.floatingView} />
          </TouchableWithoutFeedback>
          <InputField
            onRef={ref => setDobRef(ref)}
            value={
              formData?.dob
                ? params?.updateEmp
                  ? utilityMethods.getViewAbleDateFormate(formData?.dob)//formData?.dob
                  : utilityMethods.getViewAbleDateFormate(formData?.dob)
                : ''
            }
            placeholder={Strings.dobPH}
            onSubmitEditing={() => licenseRef.current.focus()}
            // onChangeText={onChangeDob}
            autoCorrect={false}
          />
        </View>
        {formData?.dob && isFutureDate && (
          <Text style={styles.errorMsgText}>
            {Strings.dobCannotBeFutureData}
          </Text>
        )}
        <InputField
          onRef={ref => setLicenseRef(ref)}
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          autoCapitalize={'characters'}
          autoCorrect={false}
          value={
            formData?.idNumber
              ? utilityMethods.formatSnnOrIdNumber(formData?.idNumber)
                ? utilityMethods.formatSnnOrIdNumber(formData?.idNumber)
                : formData?.idNumber
                    ?.replace(/[^a-zA-Z0-9\s]+/g, '')
                    .trimStart()
              : ''
          }
          placeholder={Strings.licensePH}
          onSubmitEditing={() => genderRef.current.focus()}
          maxLength={!formData.isEighteenPlus ? 16 : 16}
          onChangeText={onChangeLicense}
          // editable={!params?.updateEmp}
          // iconLeft={
          //   !params?.updateEmp && formData?.idNumber?.length > 2
          //     ? 'cloud-search-outline'
          //     : null
          // }
          onPressLeftIcon={() => searchEmployeeViaLicense(formData?.idNumber)}
        />
        {formData?.idNumber?.length > 0 && formData?.idNumber?.length < 5 && (
          <Text style={styles.errorMsgText}>{Strings.invalidLicense}</Text>
        )}
        <InputField
          onRef={ref => setGenderRef(ref)}
          value={formData?.sex}
          placeholder={Strings.gender}
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          autoCapitalize={'characters'}
          autoCorrect={false}
          maxLength={1}
          onSubmitEditing={() => {
            site?.insurance_required
              ? insuranceNameRef.current.focus()
              : scrollToEnd();
            // : Keyboard.dismiss();
          }}
          returnKeyType={site?.insurance_required ? 'next' : 'done'}
          // onSubmitEditing={() => insuranceNameRef.current.focus()}
          onChangeText={onChangeGender}
        />
        {printer?.eventData?.site?.insurance_required && (
          <InputField
            onRef={ref => setInsuranceNameRef(ref)}
            value={formData?.insurance_name
              ?.replace(/[^a-zA-Z\s]+/g, '')
              .trimStart()}
            placeholder={Strings.insuranceName}
            autoCapitalize={'words'}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            autoCorrect={false}
            onSubmitEditing={() => insuranceIdRef.current.focus()}
            onChangeText={text =>
              setFormData({...formData, insurance_name: text})
            }
          />
        )}
        {printer?.eventData?.site?.insurance_required &&
          formData?.insurance_name?.replace(/[^a-zA-Z\s]+/g, '')?.length > 0 &&
          formData?.insurance_name?.replace(/[^a-zA-Z\s]+/g, '')?.length <
            3 && (
            <Text style={styles.errorMsgText}>
              {Strings.invalidInsuranceName}
            </Text>
          )}
        {printer?.eventData?.site?.insurance_required && (
          <InputField
            onRef={ref => setInsuranceIdRef(ref)}
            value={formData?.insurance_number?.trimStart()}
            placeholder={Strings.insuranceID}
            // onSubmitEditing={() => pRef.current.focus()}
            onChangeText={text =>
              setFormData({...formData, insurance_number: text})
            }
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            returnKeyType={'done'}
            autoCapitalize={'characters'}
            autoCorrect={false}
            blurOnSubmit={true}
            onSubmitEditing={() => {
              canMoveForward();
              scrollToEnd();
            }}
          />
        )}
        {printer?.eventData?.site?.insurance_required &&
          formData?.insurance_number?.length > 0 &&
          formData?.insurance_number?.length < 3 && (
            <Text style={styles.errorMsgText}>
              {Strings.invalidInsuranceNumber}
            </Text>
          )}
      </>
    );
  };

  const RenderRadioButtons = ({state, onPress, labels, isDisabled}) => {
    const radio_props = labels
      ? labels
      : [
          {label: 'Yes', value: 0},
          {label: 'No', value: 1},
        ];
    return (
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={styles.radioLabel}>
          <RadioButtonItem
            isDisabled={isDisabled}
            obj={radio_props[0]}
            index={0}
            isSelected={state === true}
            onPress={onPress}
            // labelStyle={styles.radioLabel}
          />
        </View>
        {/*<View style={{ margin: 10 }} />*/}
        <View style={styles.radioLabel}>
          <RadioButtonItem
            isDisabled={isDisabled}
            obj={radio_props[1]}
            index={1}
            isSelected={state === false}
            onPress={onPress}
            disabled={true}
            // labelStyle={styles.radioLabel}
          />
        </View>
        {!labels && <View style={{margin: 10}} />}
      </View>
    );
  };

  const _renderRadioSelection = () => {
    const radio_props = [
      {label: 'Staff', value: 0},
      {label: 'Guest', value: 1},
    ];

    return (
      <>
        <View style={[styles.radioContainerView]}>
          <Text
            style={[styles.radioText, disableVaccineRadioBtn && {opacity: 0.5}]}
          >
            {Strings.areYouVaccinated}
          </Text>
          <RenderRadioButtons
            isDisabled={disableVaccineRadioBtn}
            state={formData?.isVaccinated ? true : false}
            onPress={ind =>
              setFormData({...formData, isVaccinated: ind == 0 ? true : false})
            }
          />
        </View>

        {printer?.eventData?.site?.isLucira &&
          params?.updateEmp &&
          params?.test.test_type == TestTypes.ANTIGEN && (
            <View style={styles.radioContainerView}>
              <Text style={styles.radioText}>{Strings.isLucira}</Text>
              <RenderRadioButtons
                state={formData?.isLucira}
                onPress={ind =>
                  setFormData({...formData, isLucira: ind == 0 ? true : false})
                }
              />
            </View>
          )}
        {printer?.eventData?.site?.isLucira && !params?.updateEmp && (
          <View style={styles.radioContainerView}>
            <Text style={styles.radioText}>{Strings.isLucira}</Text>
            <RenderRadioButtons
              state={formData?.isLucira}
              onPress={ind =>
                setFormData({...formData, isLucira: ind == 0 ? true : false})
              }
            />
          </View>
        )}

        <View style={styles.radioContainerView}>
          <Text style={styles.radioText}>{Strings.whiteGlove}</Text>
          <RenderRadioButtons
            state={formData?.whiteGlove ? true : false}
            onPress={ind =>
              setFormData({...formData, whiteGlove: ind == 0 ? true : false})
            }
          />
        </View>

        <View style={styles.radioContainerView}>
          <Text style={styles.radioText}>{Strings.testerDesignation}</Text>
          <RenderRadioButtons
            labels={radio_props}
            // state={formData?.testerDes}
            state={formData?.employeeType === Strings.guest ? false : true}
            onPress={ind => {
              setFormData({
                ...formData,
                // testerDes: ind == 0 ? true : false,
                employeeType: ind == 0 ? Strings.staff : Strings.guest,
                // isLucira: formData?.isLucira == true ? true : false,
                // isVaccinated: formData?.isVaccinated == true ? true : false,
                // whiteGlove: formData?.whiteGlove == true ? true : false,
              });
            }}
          />
        </View>
      </>
    );
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
      {/*<AvoidKeyboard>*/}
      <KeyboardAvoidingView
        {...(IS_IPHONE ? {behavior: 'padding'} : {behavior: 'height'})}
        style={{flex: 1}}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titleText}>{Strings.employeeInfo}</Text>
          {_renderInputFields()}
          {_renderRadioSelection()}
          <Button
            onPress={() => {
              setButtonActive(true);
              setTimeout(() => {
                setButtonActive(false);
              }, 300);
              params?.updateEmp
                ? updateTestEmpData(formData)
                : checkRecordUpdated(formData);
            }}
            // disabled={false}
            // onPress={() => navigation.navigate('InsuranceCardImages')}
            disabled={!canMoveForward() || buttonActive}
            title={params?.updateEmp ? Strings.update : Strings.next}
          />
          <View style={{marginBottom: 25}} />
        </ScrollView>
      </KeyboardAvoidingView>
      {/*</AvoidKeyboard>*/}
      <DateTimePickerModal
        isVisible={isDatePickerOpen}
        mode="date"
        // maximumDate={new Date()}
        onConfirm={onDobConfirm}
        onCancel={() => setDatePickerOpen(false)}
      />
      <TestConfirmation
        display={displayConfirmation}
        setDisplay={setDisplayConfirmation}
        message={
          displayMessage
            ? displayMessage
            : `Your ${
                test?.testType
                  ? dataStoreHelper.getTypeString(test?.testType)
                  : ''
              } test label has been printed.`
        }
      />
    </View>
  );
};

export default FormInput;
