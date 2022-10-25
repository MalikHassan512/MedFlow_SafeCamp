import React, {useState, useRef, useContext} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Strings} from '../../../constants';
import {
  Button,
  TestConfirmation,
  RadioButtonItem,
  InputField,
} from '../../../components';
import {LoaderContext} from '../../../components/hooks';
import styles from './styles';
import {saveEmployeeInfo} from '../../../store/actions/employeeInfo';
import {updateCreateSource} from '../../../store/actions';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import _ from 'lodash';
import {
  updateEmployeeTestCount,
  updateTestType,
} from '../../../store/actions/tests';
import {navigateReset} from '../../../navigator/navigationRef';
import {useFocusEffect} from '@react-navigation/native';
import Utilits from '../../../utils/utilityMethods';
import moment from 'moment';

const list = [1, 2, 3, 4, 5, 6, 7];
const EmployeeListing = props => {
  const {navigation, route} = props;

  const {user} = useSelector(state => state.reducer.user);
  const {setLoader} = useContext(LoaderContext);
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [formData, setFormData] = useState({});
  const [disableVaccineRadioBtn, setDisableVaccineRadioBtn] = useState(false);
  const [insuranceNameRef, setInsuranceNameRef] = useState(useRef(null));
  const [insuranceIdRef, setInsuranceIdRef] = useState(useRef(null));
  const {test, employee, printer} = useSelector(state => state.reducer);
  const {eventData} = useSelector(state => state?.reducer?.printer);
  const backHandler = () => {
    navigation.goBack();
  };
  useFocusEffect(
    React.useCallback(() => {
      setEmployeeList(_.cloneDeep(route?.params?.employees));
    }, [route?.params?.employees]),
  );
  const canMoveForward = () => {
    if (eventData?.site?.insurance_required) {
      return (
        formData?.insurance_name?.length > 2 &&
        formData?.insurance_number?.length > 2 &&
        formData?.isVaccinated != null &&
        // formData?.isLucira != null &&
        (eventData?.site?.isLucira ? formData?.isLucira != null : true) &&
        formData?.whiteGlove != null &&
        formData?.testerDes != null
      );
    } else {
      return (
        formData?.isVaccinated != null &&
        // formData?.isLucira != null &&
        (eventData?.site?.isLucira ? formData?.isLucira != null : true) &&
        formData?.whiteGlove != null &&
        formData?.testerDes != null
      );
    }
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
      eventData: eventData,
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
  const handleOnPress = async (emp, index) => {
    let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
      emp,
    );
    let latestEmp = employeeDemographic;
    console.log('latestEmp emp is : ', emp)
    if (latestEmp?.isHR && Utilits.hasTodaySchedule(latestEmp)) {
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
      // setScreenFocus(true);
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
        navigation.push('FormInput', {
          record: latestEmp ? latestEmp : null,
          isHRScanned: true,
          isListing: true,
        });
      } else {
        dispatch(updateCreateSource(Strings.SCAN_QR_CODE));
        navigation.push('FormInput', {
          record: latestEmp ? latestEmp : null,
          isHRScanned: true,
          isListing: true,
        });
      }
    } else {
      
      navigation.replace('FormInput', {
        record: employeeDemographic,
        isListing: true,
        selectedIndex: index,
        listingData:employeeList
      })
    }
  }
  const renderItem = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={async() => {
            handleOnPress(item, index)
            // let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
            //   item,
            // );
            // navigation.replace('FormInput', {
            //   record: employeeDemographic,
            //   isListing: true,
            //   selectedIndex: index,
            //   listingData:employeeList
            // })
          }}
          // onPress={() => openCloseDetail(index)}
          style={[styles.newCotainer, Utilits.hasTodaySchedule(item) ? {borderColor: Colors.PINK.default, borderWidth: 5} : {}]}
        >
          <View style={styles.itemContainer}>
            <View style={styles.containerTextStyle}>
              <Text style={styles.itemTextStyle}>{`${Strings.phone}: `}</Text>
              <Text style={styles.itemNameStyle}>
                {item?.phone_number ? item?.phone_number : ''}
              </Text>
            </View>
            <View style={styles.containerTextStyle}>
              <Text style={styles.itemTextStyle}>{`${Strings.email}: `}</Text>
              <Text style={styles.itemNameStyle}>
                {item?.email ? item?.email : ''}
              </Text>
            </View>
            <View style={styles.containerTextStyle}>
              <Text
                style={styles.itemTextStyle}
              >{`${Strings.firstName}: `}</Text>
              <Text style={styles.itemNameStyle}>
                {item?.first ? item?.first : ''}
              </Text>
            </View>
            <View style={styles.containerTextStyle}>
              <Text
                style={styles.itemTextStyle}
              >{`${Strings.lastName}: `}</Text>
              <Text style={styles.itemNameStyle}>
                {item?.last ? item?.last : ''}
              </Text>
            </View>
            <View style={styles.containerTextStyle}>
              <Text style={styles.itemTextStyle}>{`${Strings.dob}: `}</Text>
              <Text style={styles.itemNameStyle}>
                {item?.dob ? Utilits.getViewAbleDateFormate(item?.dob): ''}
              </Text>
            </View>
            <View style={styles.containerTextStyle}>
              <Text
                style={styles.itemTextStyle}
              >{`${Strings.licensePH}: `}</Text>
              <Text style={styles.itemNameStyle}>
                {item?.id_number ? item?.id_number : ''}
              </Text>
            </View>
            <View style={styles.containerTextStyle}>
              <Text style={styles.itemTextStyle}>{`${Strings.gender}: `}</Text>
              <Text style={styles.itemNameStyle}>
                {item?.sex ? item?.sex?.toUpperCase() : ''}
              </Text>
            </View>
            <View style={styles.containerTextStyle}>
              <Text style={[styles.itemTextStyle]}>{`${Strings.employeeType}: `}</Text>
              <Text style={[styles.itemNameStyle]}>
                {item?.isHR ? "HR" : "MD"}
              </Text>
            </View>
          </View>
          
        </TouchableOpacity>
        {item.showDetail && _renderRadioSelection(item)}
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
        <View style={{width: '50%'}}>
          <RadioButtonItem
            isDisabled={isDisabled}
            obj={radio_props[0]}
            index={0}
            isSelected={state === true}
            onPress={onPress}
          />
        </View>
        <View style={{width: '50%'}}>
          <RadioButtonItem
            isDisabled={isDisabled}
            obj={radio_props[1]}
            index={1}
            isSelected={state === false}
            onPress={onPress}
            disabled={true}
          />
        </View>
        {!labels && <View style={{margin: 10}} />}
      </View>
    );
  };
  const _renderRadioSelection = item => {
    const radio_props = [
      {label: 'Staff', value: 0},
      {label: 'Guest', value: 1},
    ];

    return (
      <>
        {eventData?.site?.insurance_required && (
          <InputField
            onRef={ref => setInsuranceNameRef(ref)}
            value={formData?.insurance_name}
            placeholder={Strings.insuranceName}
            autoCapitalize={'words'}
            autoCorrect={false}
            onSubmitEditing={() => insuranceIdRef.current.focus()}
            onChangeText={text =>
              setFormData({...formData, insurance_name: text})
            }
          />
        )}
        {eventData?.site?.insurance_required && (
          <InputField
            onRef={ref => setInsuranceIdRef(ref)}
            value={formData?.insurance_number}
            placeholder={Strings.insuranceID}
            // onSubmitEditing={() => pRef.current.focus()}
            onChangeText={text =>
              setFormData({...formData, insurance_number: text})
            }
            returnKeyType={'done'}
            autoCapitalize={'characters'}
            autoCorrect={false}
            blurOnSubmit={true}
            onSubmitEditing={() => canMoveForward()}
          />
        )}
        <View style={styles.radioContainerView}>
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
          {disableVaccineRadioBtn && <View style={styles.disableView} />}
        </View>
        {printer?.eventData?.site?.isLucira && (
          <View style={styles.radioContainerView}>
            <Text style={styles.radioText}>{Strings.isLucira}</Text>
            <RenderRadioButtons
              state={formData?.isLucira ? true : false}
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
            state={formData?.testerDes}
            onPress={ind => {
              setFormData({
                ...formData,
                testerDes: ind == 0 ? true : false,
                employeeType: ind == 0 ? Strings.staff : Strings.guest,
                isLucira: formData?.isLucira == true ? true : false,
                isVaccinated: formData?.isVaccinated == true ? true : false,
                whiteGlove: formData?.whiteGlove == true ? true : false,
              });
            }}
          />
        </View>
        <Button
          onPress={async () => {
            setLoader(true);
            if (
              route?.params?.isPreRegister &&
              item?.fetchFrom == 'preRegistration'
            ) {
              const employee_demographics = await dataStoreHelper.createPreRegisterDemoRecord(
                item,
                true,
              );
              await createNewEmployee({...formData, ...employee_demographics});
              return;
            }
            setTimeout(() => {
              saveData(formData);
            }, 300);
          }}
          disabled={!canMoveForward()}
          title={'Proceed'}
        />
      </>
    );
  };

  const openCloseDetail = index => {
    let tempList = _.cloneDeep(route?.params?.employees);
    if (tempList[index].isVaccinated) {
      setDisableVaccineRadioBtn(true);
    } else {
      setDisableVaccineRadioBtn(false);
    }
    setFormData({
      ...tempList[index],
      whiteGlove: null,
      employeeType: null,
      isLucira: null,
    });
    tempList[index].showDetail = !tempList[index].showDetail;
    setEmployeeList([...tempList]);
  };
  const saveData = async data => {
    console.log('🚀 ~ file: index.js ~ line 333 ~ data', data);
    let updatedEmployee = await dataStoreHelper.updateEmployeeRecord(data);
    let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
      updatedEmployee,
    );
    dispatch(
      updateCreateSource(
        route?.params?.fromScanner ? test?.createSourceType : Strings.manual,
      ),
    );
    dispatch(saveEmployeeInfo(employeeDemographic));
    checkHippaConsent(employeeDemographic);
  };
  const navigateToHippa = () => {
    setLoader(false);
    navigation.navigate('Signature', {createNewTest: createNewTest});
  };
  const checkHippaConsent = data => {
    if (data?.hippaConsent?.includes(eventData?.site?.id)) {
      checkInsuranceCard(data);
    } else {
      navigateToHippa();
    }
  };
  const checkInsuranceCard = data => {
    if (eventData?.site?.sendInsuranceCard) {
      if (data?.insuranceScan?.includes(eventData?.site?.id)) {
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
        if (eventData?.lab?.barCodeProvided) {
          availableBarCode = await dataStoreHelper.getAvailableBarcod(
            eventData?.lab?.id,
          );
          if (availableBarCode == null) {
            setLoader(false);
            alert(
              'No available barcode in this lab. Please select any other lab or wait for some time.',
            );
            return;
          }
        }
        if (!eventData?.lab?.tubes_provided) {
          setLoader(false);
          navigation.navigate('Scanner', {
            createNewTest: createNewTest,
            testType: Strings.pcr,
            selectedTests: [{label: 'PCR', value: Strings.pcr, selected: true}],
          });
        } else {
          if (
            eventData?.site?.patternTesting &&
            test.testType == Strings.pcr
          ) {
            patternConsent(data, availableBarCode);
          } else {
            createTest(data, availableBarCode);
          }
        }
      } else {
        if (eventData?.site?.patternTesting && test.testType == Strings.pcr) {
          patternConsent(data, availableBarCode);
        } else {
          createTest(data, availableBarCode);
        }
      }
    } else {
      setLoader(false);
      navigation.navigate('TestSelection', {createNewTest: createNewTest});
    }
  };
  const patternConsent = (data, availableBarCode) => {
    Alert.alert(Strings.alert, Strings.patternTestAlert, [
      {
        text: Strings.no,
        onPress: () => createTest(data, availableBarCode),
        style: 'cancel',
      },
      {
        text: Strings.yes,
        onPress: async () => onPatternPress(),
      },
    ]);
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
  const onPatternPress = async () => {
    let patternList = await employee?.employeeInfo?.patternConsent;
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
  const checkDuplicateEmployee = formData => {
    var mobile = formData?.phoneNumber?.replace(/\D/g, '').slice(-10);
    let filteredEmployee = employeeList.filter(
      emp =>
        emp.id_number.trim() === formData?.idNumber.trim() &&
        emp.email.trim().toLocaleLowerCase() ===
          formData?.email.trim().toLocaleLowerCase() &&
        emp.phone_number === mobile &&
        ((emp.last.trim().toLocaleLowerCase() ===
          formData?.lastName.trim().toLocaleLowerCase() &&
        emp.dob === formData?.fullDob
          ? formData?.fullDob
          : formData?.dob) ||
          (emp.first.trim().toLocaleLowerCase() ===
            formData?.firstName.trim().toLocaleLowerCase() &&
          emp.dob === formData?.fullDob
            ? formData?.fullDob
            : formData?.dob)),
    );
    if (filteredEmployee?.length == 0) {
      createNewEmployee(route?.params?.formData);
    } else {
      updateExistingRecord(filteredEmployee[0], route?.params?.formData);
    }
    // createNewEmployee(route?.params?.formData)
  };
  const updateExistingRecord = async (oldRecord, newRecord) => {
    setLoader(true);
    let updatedEmployee = await dataStoreHelper.updateExistingEmployeeRecord(
      oldRecord,
      newRecord,
    );
    let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
      updatedEmployee,
    );
    dispatch(updateCreateSource(Strings.manual));
    dispatch(saveEmployeeInfo(employeeDemographic));
    checkHippaConsent(employeeDemographic);
  };
  const renderFooter = () => {
    if (route?.params?.addNew || route?.params?.fromScanner) {
      return (
        <Button
          buttonStyle={styles.bottomButtonReducedStyling}
          onPress={() =>
            route?.params?.fromScanner
              ? navigation.replace('FormInput', {
                  record: route?.params?.scannedData
                    ? route?.params?.scannedData
                    : null,
                })
              : checkDuplicateEmployee(route?.params?.formData)
          }
          title={route?.params?.fromScanner ? Strings.Close : Strings.addNew}
        />
      );
    } else {
      return null;
    }
  };
  const createNewEmployee = async data => {
    setLoader(true);
    var mobile = data?.phoneNumber?.replace(/\D/g, '').slice(-10);
    const employee = await dataStoreHelper.createEmployee(
      data,
      mobile,
      eventData?.clientID,
      eventData,
    );
    let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
      employee,
    );
    dispatch(saveEmployeeInfo(employeeDemographic));
    navigateToHippa();
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView />
      <TouchableOpacity onPress={backHandler} style={styles.backButton}>
        <Icon
          size={32}
          name={'arrow-back-outline'}
          color={Colors.WHITE.default}
        />
      </TouchableOpacity>

      <View style={{marginLeft: 20}}>
        <Text style={styles.titleTxt}>Employee Listing</Text>
      </View>

      <FlatList
        data={employeeList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={renderFooter}
      />
      {renderFooter()}
      <TestConfirmation
        display={displayConfirmation}
        setDisplay={setDisplayConfirmation}
        message={`Your ${
          test?.testType ? dataStoreHelper.getTypeString(test?.testType) : ''
        } test label has been printed.`}
      />
    </View>
  );
};

export default EmployeeListing;
