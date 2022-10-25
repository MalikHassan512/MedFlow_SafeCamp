import {
  Client,
  Site,
  Lab,
  Employee,
  Test,
  TestConsent,
  TestTypes,
  LencoBarcodes,
  EmployeeBarCodes,
  EmployeeTestCounter,
  ExternalTest,
} from '../models';
import {
  Auth,
  Storage,
  API,
  DataStore,
  syncExpression,
  SortDirection,
} from 'aws-amplify';
import { Alert } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import api from './api';
import { isNull } from 'lodash';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import { Strings, TestTypes as tType, TestStatus } from '../constants';
import { customAlphabet } from 'nanoid/non-secure';
import printerHelper from './printerHelper';
import { AWS_ENDPOINT, MED_FLOW_WALLET_URL } from '../constants/endpoints';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';
import Utilits from './utilityMethods';
import { getTodayDate } from '../store/util';
import { Utils } from '@react-native-firebase/app';
import { jsonToCSV } from 'react-native-csv';
axios.defaults.timeout = 5000;

const syncStoreData = async () => {
  const user = await api.getCurrentUser();
  if (!isNull(user)) {
    let number = user.phone_number.slice(2);
    let today = getTodayDate();
    let lambdaExpressions = [
      syncExpression(ExternalTest, () => {
        return data => data.id('eq', '9999');
      }),
      syncExpression(EmployeeTestCounter, () => {
        return data => data.id('eq', '9999');
      }),
      syncExpression(EmployeeBarCodes, () => {
        return data => data.id('eq', '9999');
      }),
      syncExpression(TestConsent, () => {
        return data => data.id('eq', '9999');
      }),
      syncExpression(LencoBarcodes, () => {
        return data => data.id('eq', '9999');
      }),
    ];
    console.log('IsAdmin||NOT', user.isAdmin());
    if (!user.isAdmin()) {
      lambdaExpressions.push(
        syncExpression(Employee, () => {
          return data => data.phone_number('eq', number);
        }),
        syncExpression(Test, () => {
          return test => test.phoneNumber('eq', number);
        }),
      );
    } else {
      lambdaExpressions.push(
        syncExpression(Test, () => {
          return test =>
            test.or(test =>
              test.phoneNumber('eq', number).createdAt('gt', today).status('eq', Strings.PENDING),
            );
        }),
      );
    }
    DataStore.configure({
      syncExpressions: lambdaExpressions,
      maxRecordsToSync: 50000,
    });
  } else {
    console.log('Nothing');
  }
};
const resetDatastore = async () => {
  await syncStoreData();
  await DataStore.clear();
  await DataStore.start();
};

const getClients = async () => {
  try {
    const models = await DataStore.query(
      Client,
      client => client.whiteLabel('eq', false),
      {
        sort: test => test.name(SortDirection.ASCENDING),
      },
    );
    return models;
  } catch (error) {
    console.log('fetch client error', error);
    return [];
  }
};
const getSitesByClient = async clientID => {
  try {
    const models = await DataStore.query(
      Site,
      site => site.clientID('eq', clientID).isArchive('eq', false),
      {
        sort: test => test.name(SortDirection.ASCENDING),
      },
    );
    return models;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getAllSites = async () => {
  try {
    const models = await DataStore.query(
      Site,
      // site => site.clientID('eq', false),
      null,
      {
        sort: site => site.name(SortDirection.ASCENDING),
      },
    );
    return models;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getLabs = async () => {
  try {
    const models = await DataStore.query(
      Lab,
      lab => lab.whiteLabel('eq', false),
      {
        sort: test => test.name(SortDirection.ASCENDING),
      },
    );
    return models;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const getLabsWithInsurance = async type => {
  try {
    const models = await DataStore.query(
      Lab,
      lab => lab.whiteLabel('eq', false).sendInsurance('eq', type),
      {
        sort: test => test.name(SortDirection.ASCENDING),
      },
    );
    return models;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const searchEmployeeWithNum = async mobile => {
  try {
    console.log('here is mobile: ', mobile);
    var number = mobile.replace(/\D/g, '').slice(-10);
    const employees = await DataStore.query(Employee, data =>
      data.phone_number('eq', number),
    );
    console.log('here is the number: ', number);
    console.log('here is the employee: ', employees);
    return employees;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const searchEmployeeWithId = async id => {
  try {
    const employees = await DataStore.query(Employee, data =>
      data.id('eq', id),
    );
    return employees;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const searchEmployeeWithEmail = async email => {
  try {
    const employees = await DataStore.query(Employee, data =>
      data.email('eq', email),
    );
    return employees;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const searchEmployeeWithLicense = async license => {
  try {
    const employees = await DataStore.query(Employee, data =>
      data.id_number('eq', license),
    );
    return employees;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const searchEmployeeWithFilledForm = async formData => {
  var mobile = formData?.phoneNumber?.replace(/\D/g, '').slice(-10);
  try {
    const employees = await DataStore.query(
      Employee,
      data =>
        data.or(data =>
          data
            .phone_number('eq', mobile)
            .email('eq', formData?.email)
            .id_number('eq', formData?.idNumber),
        ),
      // .first('eq', formData?.firstName)
      // .last('eq', formData?.lastName)
      // .dob('eq', formData?.fullDob),
    );
    console.log('here is employees : ', employees);
    let filteredEmployee = employees.filter(
      emp =>
        (emp.first.trim().toLocaleLowerCase() ===
          formData?.firstName.trim().toLocaleLowerCase() &&
          emp.dob === formData?.fullDob) ||
        (emp.last.trim().toLocaleLowerCase() ===
          formData?.lastName.trim().toLocaleLowerCase() &&
          emp.dob === formData?.fullDob) ||
        emp.phone_number === mobile ||
        emp.email.trim().toLocaleLowerCase() ===
        formData?.email.trim().toLocaleLowerCase() ||
        emp.id_number.trim() === formData?.idNumber.trim(),
    );
    let validEmployeeList = filteredEmployee.filter(
      emp =>
        emp?.phone_number?.length == 10 &&
        emp?.email &&
        Utilits.isEmailValid(emp?.email) &&
        emp?.first?.length > 1 &&
        emp?.last?.length > 1 &&
        emp?.street?.length > 2 &&
        emp?.city?.length > 2 &&
        emp?.state?.length > 1 &&
        emp?.zip?.length > 2 &&
        emp?.dob?.length > 2 &&
        emp?.id_number?.length > 4 &&
        emp?.sex?.length > 0,
    );
    console.log(
      'here is filteredEmployee : ',
      filteredEmployee.length,
      '<<<<<::::::>>>>',
      validEmployeeList.length,
    );
    return validEmployeeList;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const buildAWSDate = dobFromID => {
  const awsdob = [];
  awsdob.push(dobFromID.substring(4));
  awsdob.push(dobFromID.substring(0, 2));
  awsdob.push(dobFromID.substring(2, 4));
  return awsdob.join('-');
};
const createEmployee = async (employeeData, phone, clientID, location) => {
  //Must be new. Create it
  const employee = await DataStore.save(
    new Employee({
      first: employeeData?.firstName,
      last: employeeData?.lastName,
      dob: employeeData?.dob?.includes('-')
        ? employeeData?.dob
        : buildAWSDate(employeeData?.dob),
      id_number: employeeData?.idNumber,
      insurance_name: employeeData?.insurance_name,
      insurance_number: employeeData?.insurance_number,
      clientID: clientID,
      phone_number: phone,
      street: employeeData.street,
      street2: employeeData.street2,
      city: employeeData.city,
      state: employeeData.state,
      zip: employeeData.zip,
      sex: employeeData.sex,
      email: employeeData.email,
      site_name: location?.site?.name,
      isNew: false,
      isVaccinated: employeeData?.isVaccinated,
      employeeType: employeeData?.employeeType,
      whiteGlove: employeeData.whiteGlove,
    }),
  );
  return employee;
};
const getEmployeeTestCount = async employeeID => {
  const models = await DataStore.query(Test, test =>
    test.employeeID('eq', employeeID),
  );
  return models.length;
};
const updateEmployeeRecord = async data => {
  try {
    const originalEmployee = await DataStore.query(Employee, data?.id);
    console.log(
      '🚀 ~ file: dataStoreHelper.js ~ line 321 ~ originalEmployee',
      originalEmployee,
    );
    let updatedEmployee = await DataStore.save(
      Employee.copyOf(originalEmployee, update => {
        update.insurance_name = data.insurance_name;
        update.insurance_number = data.insurance_number;
        update.isVaccinated = data.isVaccinated;
        update.whiteGlove = data.whiteGlove;
        update.employeeType = data.employeeType;
      }),
    );
    return updatedEmployee;
  } catch (error) {
    console.log('🚀 ~ file: dataStoreHelper.js ~ line 251 ~ error', error);
    return false;
  }
};
const updateExistingEmployeeRecord = async (employee, data, isSensitive) => {
  try {
    const originalEmployee = await DataStore.query(Employee, employee?.id);
    let updatedEmployee = null;
    if (isSensitive) {
      let mobile = data?.phoneNumber?.replace(/\D/g, '')?.slice(-10);
      updatedEmployee = await DataStore.save(
        Employee.copyOf(originalEmployee, update => {
          update.phone_number = mobile;
          update.email = data?.email;
          update.id_number = data?.idNumber;
          update.dob = data?.dob?.includes('-')
            ? data?.dob
            : buildAWSDate(data?.dob);
          update.first = data.firstName;
          update.last = data.lastName;
          update.street = data.street;
          update.city = data.city;
          update.state = data.state;
          update.zip = data.zip;
          update.id_number = data.idNumber;
          update.sex = data.sex;
          update.insurance_name = data.insurance_name;
          update.insurance_number = data.insurance_number;
          update.isVaccinated = data.isVaccinated;
          update.whiteGlove = data.whiteGlove;
          update.employeeType = data.employeeType;
        }),
      );
    } else {
      updatedEmployee = await DataStore.save(
        Employee.copyOf(originalEmployee, update => {
          update.first = data.firstName;
          update.last = data.lastName;
          update.street = data.street;
          update.city = data.city;
          update.state = data.state;
          update.zip = data.zip;
          update.id_number = data.idNumber;
          update.sex = data.sex;
          update.insurance_name = data.insurance_name;
          update.insurance_number = data.insurance_number;
          update.isVaccinated = data.isVaccinated;
          update.whiteGlove = data.whiteGlove;
          update.employeeType = data.employeeType;
        }),
      );
    }

    return updatedEmployee;
  } catch (error) {
    console.log('🚀 ~ file: dataStoreHelper.js ~ line 251 ~ error', error);
    return false;
  }
};
const updateEmployeeHippaConsent = async (employeeID, siteId) => {
  try {
    const originalEmployee = await DataStore.query(Employee, employeeID);
    let hippaConsent = originalEmployee?.hippaConsent
      ? [...originalEmployee?.hippaConsent]
      : [];
    hippaConsent.push(siteId);
    let updatedEmployee = await DataStore.save(
      Employee.copyOf(originalEmployee, updated => {
        updated.hippaConsent = hippaConsent;
      }),
    );
    return updatedEmployee;
  } catch (error) {
    console.log('🚀 ~ file: dataStoreHelper.js ~ line 251 ~ error', error);
    return false;
  }
};
const updateEmployeePatternConsent = async (employeeID, siteId) => {
  try {
    const originalEmployee = await DataStore.query(Employee, employeeID);
    let patternConsent = originalEmployee?.patternConsent
      ? [...originalEmployee?.patternConsent]
      : [];
    patternConsent.push(siteId);
    let updatedEmployee = await DataStore.save(
      Employee.copyOf(originalEmployee, updated => {
        updated.patternConsent = patternConsent;
      }),
    );
    return updatedEmployee;
  } catch (error) {
    console.log('🚀 ~ file: dataStoreHelper.js ~ line 251 ~ error', error);
    return false;
  }
};

const getAllTestTypes = async () => {
  const testConsent = await DataStore.query(TestTypes);
  return testConsent;
};

const updateDB = async (tests = [], isEmailSend, testLogs = '') => {
  let dataList = [];
  for (const test of tests) {
    const testObj = await DataStore.query(Test, t => t.id('eq', test.id));
    const user = await api.getCurrentUser();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let date = yyyy + '-' + mm + '-' + dd;

    for (let tObj of testObj) {
      let nowDate = moment();
      const now = new Date();

      const userData = {
        sequenceNo: tObj.sequenceNo,
        user: JSON.stringify(user),
        timeZone: RNLocalize.getTimeZone(),
        momentDate: nowDate,
        action: test.result,
        nowIOS: now.toISOString(),
        version:
          DeviceInfo.getVersion() + ' (' + DeviceInfo.getBuildNumber() + ') ',
      };

      dataList.push(userData);
      let obj = await DataStore.save(
        Test.copyOf(tObj, updated => {
          updated.status = test.result
            ? test.result === Strings.POSITIVE
              ? Strings.PENDING
              : 'Processed'
            : 'Processed';
          updated.result = test.result;
          updated.StampBy = user?.sub;
          (updated.StampByName =
            user?.['custom:firstName'] &&
            user?.['custom:lastName'] &&
            user['custom:firstName'] + ' ' + user['custom:lastName']),
            (updated.resultDate = date);

          updated.timerStatus = test.result
            ? test.result === Strings.POSITIVE
              ? Strings.PENDING
              : 'Processed'
            : 'Processed';
        }),
      );
      // console.log('updated test: ', obj)
    }
  }
  // updateTestLogs(dataList)
};

const updateTestTypeDB = async (tests = [], isEmailSend, testLogs = '') => {
  let dataList = [];
  for (const test of tests) {
    const testObj = await DataStore.query(Test, t => t.id('eq', test.id));
    const user = await api.getCurrentUser();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let date = yyyy + '-' + mm + '-' + dd;

    for (let tObj of testObj) {
      let nowDate = moment();
      const now = new Date();

      const userData = {
        sequenceNo: tObj.sequenceNo,
        user: JSON.stringify(user),
        timeZone: RNLocalize.getTimeZone(),
        momentDate: nowDate,
        action: test.result,
        nowIOS: now.toISOString(),
        version:
          DeviceInfo.getVersion() + ' (' + DeviceInfo.getBuildNumber() + ') ',
      };

      dataList.push(userData);
      let obj = await DataStore.save(
        Test.copyOf(tObj, updated => {
          updated.test_type = test.test_type;
          updated.StampBy = user?.sub;
          (updated.StampByName =
            user?.['custom:firstName'] &&
            user?.['custom:lastName'] &&
            user['custom:firstName'] + ' ' + user['custom:lastName']),
            (updated.resultDate = date);
        }),
      );
    }
  }
};

const updateTestDemoGraphicDB = async (test, isEmailSend, testLogs = '') => {
  const testObj = await DataStore.query(Test, t => t.id('eq', test.id));
  const user = await api.getCurrentUser();
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let date = yyyy + '-' + mm + '-' + dd;

  let tObj = testObj[0];

  await DataStore.save(
    Test.copyOf(tObj, updated => {
      updated.employee_demographics = test.employee_demographics;
      updated.StampBy = user?.sub;
      (updated.StampByName =
        user?.['custom:firstName'] &&
        user?.['custom:lastName'] &&
        user['custom:firstName'] + ' ' + user['custom:lastName']),
        (updated.resultDate = date);
    }),
  );
};

const uploadInsuranceCard = async (
  employeeId,
  siteId,
  frontImg,
  backImg,
  response,
) => {
  try {
    const frontImage = `${employeeId}&&${siteId}&&ins-f.jpeg`;
    const backImage = `${employeeId}&&${siteId}&&ins-b.jpeg`;
    const firstImageResponse = await fetch(frontImg);
    const backImageResponse = await fetch(backImg);
    const frontBlob = await firstImageResponse.blob();
    const backBlob = await backImageResponse.blob();

    let fImageStored = await Storage.put(frontImage, frontBlob, {
      contentType: 'image/jpeg',
      completeCallback: event => {
        console.log(`frontImage Successfully uploaded ${event.key}`);
      },
      progressCallback: progress => {
        console.log(
          `frontImage Uploaded: ${progress.loaded}/${progress.total}`,
        );
      },
      errorCallback: err => {
        console.error('frontImage Unexpected error while uploading', err);
      },
    });

    let bImageStored = await Storage.put(backImage, backBlob, {
      contentType: 'image/jpeg',
      completeCallback: event => {
        console.log(`backImage Successfully uploaded ${event.key}`);
      },
      progressCallback: progress => {
        console.log(`backImage Uploaded: ${progress.loaded}/${progress.total}`);
      },
      errorCallback: err => {
        console.error('backImage Unexpected error while uploading', err);
      },
    });
    updateEmployeeInsuranceScan(employeeId, siteId, response);
    // response({status: true, message: 'Uploded!'});
  } catch (error) {
    console.log('🚀 ~ file: dataStoreHelper ~ line 284 ~ error', error);
    response({ status: false, message: error });
  }
};
const updateEmployeeInsuranceScan = async (employeeID, siteId, response) => {
  try {
    const originalEmployee = await DataStore.query(Employee, employeeID);
    let insuranceScan = originalEmployee?.insuranceScan
      ? [...originalEmployee?.insuranceScan]
      : [];
    insuranceScan.push(siteId);
    let updatedEmployee = await DataStore.save(
      Employee.copyOf(originalEmployee, updated => {
        updated.insuranceScan = insuranceScan;
      }),
    );
    response({ status: true, message: 'Uploded!', updatedEmployee });
  } catch (error) {
    console.log('🚀 ~ file: dataStoreHelper.js ~ line 251 ~ error', error);
    response({ status: false, message: error });
  }
};

const getTestAutoNumber = async () => {
  const path = '/getAutoNumber';

  const params = {
    body: {
      username: '',
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  };
  try {
    const apiName = 'AdminQueries';

    const counterData = await API.post(apiName, path, params);
    return counterData;
  } catch (e) { }
};

const updateAssociatedInfo = async (username, siteName) => {
  const path = '/updateAssociatedInfo';
  const params = {
    body: {
      username: username,
      note: siteName,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
  };
  try {
    const apiName = 'AdminQueries';
    const infoUpdated = await API.post(apiName, path, params);
  } catch (e) { }
};

const getTypeString = type => {
  if (type === Strings.pcr) {
    return 'PCR';
  } else if (type === Strings.antigen) {
    return 'Rapid Antigen';
  } else if (type === Strings.molecular) {
    return 'Cue';
  } else if (type === Strings.other) {
    return 'Accula/Rapid PCR';
  }
  return '';
};

const createTest = async (data, response) => {
  let isHRTest = data?.employeeInfo?.isHRTest
    ? data?.employeeInfo?.isHRTest
    : false;
  if (isHRTest) {
    testExistChecked(data, response);
  } else {
    const testExists = await getTodayTests(
      data?.eventData?.site?.id,
      data?.testType,
      data?.employeeInfo?.id,
    );
    if (testExists.length != 0) {
      Alert.alert(
        Strings.alert,
        `A ${getTypeString(data?.testType)} ${Strings.testAlreadyExist}`,
        [
          {
            text: Strings.no,
            onPress: () => response(null),
            style: 'cancel',
          },
          {
            text: Strings.yes,
            onPress: () => testExistChecked(data, response),
          },
        ],
      );
    } else {
      testExistChecked(data, response);
    }
  }
};
const limitizeEmployeeData = async data => {
  let date = Utilits.getFormattedDate(data?.dob)//moment(data?.dob).format('MM-DD-YYYY');
  // if (date.toLowerCase() == 'invalid date') {
  //   date = Utilits.formatDOB(data?.dob);
  // }
  let demoData = {
    city: data?.city,
    dob: date,
    formattedDate: data?.dob,
    email: data?.email,
    firstName: data?.firstName,
    idNumber: data?.idNumber,
    insurance_name: data?.insurance_name,
    insurance_number: data?.insurance_number,
    isVaccinated: data?.isVaccinated,
    lastName: data?.lastName,
    phoneNumber: data?.phoneNumber,
    sex: data?.sex,
    state: data?.state,
    street: data?.street,
    street2: data?.street2 ? data?.street2 : '',
    whiteGlove: data?.whiteGlove,
    zip: data?.zip,
    testerDes: data?.employeeType ? data?.employeeType : "Staff",
    employeeType: data?.employeeType ? data?.employeeType : "Staff",
    isLucira: data?.isLucira ? data?.isLucira : null,
  };
  return demoData;
};
const testExistChecked = async (data, response) => {
  try {
    let isHRTest = data?.employeeInfo?.isHRTest
      ? data?.employeeInfo?.isHRTest
      : false;
    const counterUpdated = await getTestAutoNumber();
    let myBarCode = data?.myBarCode
      ? data?.myBarCode
      : `${data?.employeeInfo?.idNumber ? data?.employeeInfo?.idNumber : data?.demographics?.idNumber}-${(30 + 0 + 1)}}`;
    if (myBarCode.split('-').length > 1) {
      myBarCode = myBarCode.split('-')[0] + '-' + counterUpdated.counter;
    }
    let testerName =
      data?.currentUser?.['custom:firstName'] &&
      data?.currentUser?.['custom:lastName'] &&
      data?.currentUser['custom:firstName'] +
      ' ' +
      data?.currentUser['custom:lastName'];

    let labObj = await fetchLabs(data?.testType);
    const referenceID = customAlphabet('0123456789', 10);
    let employee_demographics = await limitizeEmployeeData({
      ...data?.employeeInfo,
      ...data?.demographics,
    });
    const test = await DataStore.save(
      new Test({
        status: 'Pending',
        clientID: data?.eventData?.clientID,
        labID: labObj
          ? labObj?.id
            ? labObj?.id
            : data?.eventData?.lab?.id
          : data?.eventData?.lab?.id,
        employeeID: data?.employeeInfo?.id,
        siteID: data?.eventData?.site?.id,
        baseSiteID: data?.eventData?.site?.id,
        site_name: data?.eventData?.site?.name,
        clientName: data?.eventData?.clientName,
        labName: labObj
          ? labObj.name
            ? labObj.name
            : data?.eventData?.lab?.name
          : data?.eventData?.lab?.name,
        batch: new Date().toDateString(),
        barcode: myBarCode,
        employee_demographics: employee_demographics,
        phoneNumber: data?.employeeInfo?.phone_number,
        email: data?.employeeInfo?.email,
        tester_name: testerName,
        test_number: 0,
        isAntigen: false,
        referenceID: referenceID(),
        patternTestAnswer: data?.patternTestAnswer
          ? JSON.stringify(data?.patternTestAnswer)
          : null,
        test_type: data?.testType,
        createdBy: data?.currentUser?.sub,
        testerPhone: data?.currentUser?.phone_number,
        sr_no: '',
        sequenceNo: counterUpdated.counter,
        done: false,
        expired: false,
        timerStatus: Strings.started,
        beenTimed: true,
        startTimeStamp: new Date().toISOString(),
        emailSend: false,
        isFalsePositive: false,
        createSource: data?.sourceType,
        schrID: data?.employeeInfo?.schrID ? data?.employeeInfo?.schrID : '',
        isLucira: data?.demographics?.isLucira
          ? data?.demographics?.isLucira
          : null,
        timezone: RNLocalize.getTimeZone(),
        schrTestID: data?.employeeInfo?.schrTestID
          ? data?.employeeInfo?.schrTestID
          : '',
        appVer: `${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`,
      }),
    );
    linkTestInExternalDB(test).then();
    printerHelper.printBarcode(
      test?.employee_demographics,
      0,
      data?.printerData,
      test?.barcode,
      test?.test_type,
      test?.sequenceNo,
      result => {
        response(test);
      },
    );

    // setTimeout(() => {

    // }, 1000);

    const getEmployee = await DataStore.query(Employee, emp =>
      emp.id('eq', data?.employeeInfo?.id),
    );
    if (getEmployee.length > 0) {
      if (getEmployee[getEmployee.length - 1].subID) {
        await updateAssociatedInfo(
          getEmployee[getEmployee.length - 1].subID,
          data?.eventData?.site?.name,
        );
      }
      const employee = await DataStore.save(
        Employee.copyOf(getEmployee[getEmployee.length - 1], updated => {
          updated.site_name = data?.eventData?.site?.name;
        }),
      );
    }
    let notificationMessage = `Hello, thank you for testing with ${data?.eventData?.site?.name}. Your results will be emailed to you once processed.`;
    if (!data?.isCreated) {
      await sendSMSNotification(
        isHRTest
          ? data?.employeeInfo?.phone_number
          : `+1${data?.employeeInfo?.phone_number}`,
        notificationMessage,
      );
    }
  } catch (error) {
    console.log('🚀 ~ file: dataStoreHelper.js ~ line 493 ~ error', error);
    return false;
  }
};
const linkTestInExternalDB = async obj => {
  try {
    console.log('linkTestInExternalDB');
    axios
      .post(
        'https://vp1gloqowi.execute-api.eu-west-1.amazonaws.com/dev/testlink',
        obj,
      )
      .then(
        response => {
          if (response) {
            console.log('linkTestInExternalDB data ', response.data);
          }
          return response;
        },
        error => {
          console.log('linkTestInExternalDB api error: ', error);
          return null;
        },
      );
  } catch (error) {
    console.log('linkTestInExternalDB api exception ', error);
    return null;
  }
};
const hrCheckIn = async (safeCampEmployeeId, employeeVersion) => {
  console.log(
    'hrCheckIn params safeCampEmployeeId:  ',
    safeCampEmployeeId,
    'employeeVersion: ',
    employeeVersion,
  );
  try {
    const path = '/graphqlEmployeeCheckIn';
    const checkInDate = moment()
      .utc()
      .toISOString();
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
      body: {
        id: safeCampEmployeeId,
        version: employeeVersion,
        checkIn: checkInDate,
      },
    };
    const apiName = 'AdminQueries';
    const apiRes = await API.post(apiName, path, params);
    console.log('hrCheckIn - ? ', apiRes.data);
    return apiRes.data;
  } catch (error) {
    console.log('hrCheckIn api exception: ', error);
  }
};

const getDemoGraphicData = employee => {
  const data = {
    ...employee,
    city: employee.city,
    dob: employee.dob === null ? null : employee.dob.trim() === '' ? null : employee.dob ,
    email: employee.email,
    employeeType: employee.employeeType,
    firstName: employee.first,
    id: employee.id,
    idNumber: employee.id_number,
    insurance_name: employee.insurance_name,
    insurance_number: employee.insurance_number,
    isVaccinated: employee.isVaccinated ? Boolean(employee.isVaccinated) ? Boolean(employee.isVaccinated) : false : false,
    lastName: employee.last,
    phoneNumber: employee.phone_number.includes('+') ? employee.phone_number : '+1' + employee.phone_number,
    sex: employee.sex,
    state: employee.state,
    street: employee.street,
    street2: employee.street2,
    whiteGlove: employee.whiteGlove,
    zip: employee.zipcode ? employee.zipcode : employee.zip,
    countryCode: '+1',
  };
  return data;
};

const fetchLabs = async testType => {
  const models = await getLabs();
  let defaultAntigenOrMolecularLab = [];

  if (models && models.length > 0) {
    if (testType === 'Antigen') {
      defaultAntigenOrMolecularLab = models.filter(
        item => item.default_antigen,
      );
    } else if (testType === 'Molecular') {
      defaultAntigenOrMolecularLab = models.filter(
        item => item.default_molecular,
      );
    } else if (testType === 'Other') {
      defaultAntigenOrMolecularLab = models.filter(item => item.default_other);
    }
  }
  if (defaultAntigenOrMolecularLab.length === 0) {
    defaultAntigenOrMolecularLab = {};
  }
  return defaultAntigenOrMolecularLab
    ? defaultAntigenOrMolecularLab.length > 0
      ? defaultAntigenOrMolecularLab[0]
      : defaultAntigenOrMolecularLab
    : defaultAntigenOrMolecularLab;
};

const isBarcodeAlreadyExist = async barcode => {
  const models = await DataStore.query(Test);
  return models.filter(item => item.barcode === barcode);
};

const getAvailableBarcod = async labId => {
  try {
    const apiName = 'AdminQueries';
    console.log("[getLabProvidedBarCode] labId : ", labId);
    const path = "/getLabProvidedBarCode";

    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        params: { id: labId },
      },
    };

    const res = await API.post(apiName, path, params);
    console.log("getLabProvidedBarCode response is ", res);
    if(res && res.barcode){
      return res
    }
    return null;

    // let mAvailableBarcode = null;
    // const models = await DataStore.query(LencoBarcodes, lencoBarcode =>
    //   lencoBarcode.labID('eq', labId).available('eq', true),
    // );
    // if (models.length > 0) {
    //   mAvailableBarcode = models[Math.floor(Math.random() * models.length)];
    // } else {
    //   Alert.alert('', Strings.noBarCodeAvailable, [
    //     {text: 'OK', onPress: () => console.log('OK Pressed')},
    //   ]);
    //   mAvailableBarcode = null;
    // }
    // await updateUsedBarCode(mAvailableBarcode.id);
    // return mAvailableBarcode;
  } catch (error) {
    console.log('🚀 ~ file: line 559 ~ error', error);
    return null;
  }
};



// const updateUsedBarCode = async barCodeID => {
//   try {
//     const requiredBarCode = await DataStore.query(LencoBarcodes, barCodeID);
//     let updatedBarCode = await DataStore.save(
//       LencoBarcodes.copyOf(requiredBarCode, updated => {
//         updated.available = false;
//       }),
//     );
//     return true;
//   } catch (error) {
//     console.log('🚀 dataStoreHelper.js~line 372~updateUsedTest', error);
//     return false;
//   }
// };
const sendSMSNotification = async (phoneNumber, message) => {
  console.log(
    'sendSMSNotification phoneNumber : ',
    phoneNumber,
    'message : ',
    message,
  );
  try {
    const notification = await axios.post(AWS_ENDPOINT + '/notification', {
      phone_number: phoneNumber,
      message: message,
    });
    return notification;
  } catch (error) {
    console.log(
      '🚀 ~ file: dataStoreHelper.js ~ line 609 ~ sendSMSNotification ~ error',
      error,
    );
  }
};

const getUserTestResults = async user => {
  let models = [];
  if (user) {
    models = await DataStore.query(
      Test,
      test => test.phoneNumber('eq', user.phone_number.substring(2)),
      {
        sort: test => test.createdAt(SortDirection.DESCENDING),
      },
    );
  }

  let list = [];
  models.map(item => {
    if (item.result && item.result.toLowerCase() === 'expired') {
      return;
    }
    list.push(item);
  });

  // console.log('list', list);

  const newList = list.map(item => {
    let i = {
      ...item,
      filterRes: item.status !== 'Processed' ? 'Processing' : item.result,
    };
    return i;
  });

  // console.log('newList', newList);
  return { newList, list };
};

// const getClients = async () => {

//   const clients = await DataStore.query(
//     await DataStore.query(Client, client => client.whiteLabel('eq', false), {
//       sort: test => test.name(SortDirection.ASCENDING),
//     }),
//   );

//   console.log('clients', clients);
//   return clients;
// }

const getEmplyeeIdFromBarCode = async barcode => {
  const models = await DataStore.query(EmployeeBarCodes, emp =>
    emp.barcode('eq', barcode),
  );
  return models[models.length - 1];
};
const getAppVersion = async () => {
  console.log('[getAppVersion]');
  const path = '/appVersion';
  const apiName = 'AdminQueries';

  try {
    let response = await axios.post(
      'https://9dpj6yddw2.execute-api.eu-west-1.amazonaws.com/default/appversion',
      { name: Platform.OS },
    );
    if (response) {
      console.log('getAppVersion data ', response.data);
      let appVersion = response.data;
      if (
        DeviceInfo.getVersion() >= Number(appVersion.Version) &&
        DeviceInfo.getBuildNumber() >= Number(appVersion.Build)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true; //null
  } catch (error) {
    console.log('getAppVersion error is : ', error);
    return true; //null
  }
};
const getPreRegisterEmployee = async (data, isListRequired, siteID = '', scanType = "") => {
  const path = '/getPreRegisterRecordNewOne'//'/getPreRegisterRecordNew';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    body: {
      phone_number: data,
      siteID: siteID,
      scanType: scanType
    },
  };
  console.log('getPreRegisterEmployee params: ', params)
  try {
    const apiName = 'AdminQueries';
    const preRegister = await API.post(apiName, path, params);
    if (preRegister?.Items?.length > 0 && preRegister.Items[0] != null) {
      const latestEmp = preRegister.Items[0];
      const demoRecord = await createPreRegisterDemoRecord(latestEmp);
      return isListRequired
        ? preRegister?.Items
          ? preRegister?.Items
          : []
        : demoRecord;
    } else {
      return [];
    }
    return preRegister ? preRegister : [];
  } catch (e) {
    console.log('getPreRegisterEmployee Err - > ', e);
    return [];
  }
};

const createPreRegisterDemoRecord = async (latestEmp, formatted) => {
  let date = latestEmp?.dob?.split('');
  let dob = '';
  if (formatted)
    dob = `${date[5]}${date[6]}${date[8]}${date[9]}${date[0]}${date[1]}${date[2]}${date[3]}`;
  try {
    const demoRecord = {
      ...latestEmp,
      firstName: latestEmp?.first?.toUpperCase(),
      lastName: latestEmp?.last?.toUpperCase(),
      phoneNumber: latestEmp?.phone_number,
      email: latestEmp?.email,
      insurance_name: '',
      insurance_number: '',
      dob: formatted
        ? dob
        : latestEmp?.dob
          .split('-')
          .join('')
          .substring(4) +
        latestEmp?.dob
          .split('-')
          .join('')
          .substring(0, 4),
      idNumber: latestEmp?.id_number,
      sex: latestEmp?.sex?.toUpperCase(),
      street: latestEmp?.street,
      street2: '',
      city: latestEmp?.city ? latestEmp.city : '',
      state: latestEmp?.state ? latestEmp.state : '',
      zip: latestEmp?.zipcode
        ? latestEmp?.zipcode
        : latestEmp?.zip
          ? latestEmp?.zip
          : '',
      isVaccinated: latestEmp?.isVaccinated === 'true' ? true : false,
      whiteGlove: null,
      isLucira: null,
    };
    return demoRecord;
  } catch (error) {
    console.log(
      '🚀 ~ file: dataStoreHelper.js ~ line 871 ~ createPreRegisterDemoRecord ~ error',
      error,
    );
  }
};

// const updateLabTestType = async (tests = [], type, config) => {
//     let lab  = await getDefaultLab(type)
//     console.log('here is the defaultLab : ', lab)
//     for (const test of tests) {
//         const testObj = await DataStore.query(Test, (t) => t.id('eq', test.id));
//         await DataStore.save(
//             Test.copyOf(testObj[0], (updated) => {
//                 updated.test_type = type;
//                 updated.labID = lab ? lab.id : config ? config.labID : testObj[0].labID
//                 updated.labName = lab ? lab.name : config ? config.labName : testObj[0].labName
//             }),
//         );
//     }
// };

const getDefaultLab = async type => {
  const models = await getLabs();
  let defaultAntigenOrMolecularLab = [];
  if (models && models.length > 0) {
    if (type === tType.ANTIGEN) {
      defaultAntigenOrMolecularLab = models.filter(
        item => item.default_antigen,
      );
    } else if (type === tType.MOLECULAR) {
      defaultAntigenOrMolecularLab = models.filter(
        item => item.default_molecular,
      );
    } else if (type === tType.OTHER) {
      defaultAntigenOrMolecularLab = models.filter(item => item.default_other);
    }
  }
  if (defaultAntigenOrMolecularLab.length === 0) {
    defaultAntigenOrMolecularLab = {};
  }

  return defaultAntigenOrMolecularLab
    ? defaultAntigenOrMolecularLab.length > 0
      ? defaultAntigenOrMolecularLab[0]
      : defaultAntigenOrMolecularLab
    : defaultAntigenOrMolecularLab;
};
const applePksPassGenerator = async (name, email, barcodeMessage) => {
  try {
    let finalURL =
      MED_FLOW_WALLET_URL +
      '?name=' +
      name +
      '&email=' +
      email +
      '&barcode_message=' +
      barcodeMessage;
    finalURL = finalURL.replace(' ', '%20');
    let result = await ReactNativeBlobUtil.fetch('GET', finalURL, {});

    return result.data;
  } catch (e) {
    return null;
  }
};

const covertPassportJson = async result => {
  let dob = '';
  if (result?.fields?.birthDate) {
    let date = result?.fields?.birthDate.split('');
    let currentYear = moment().format('YY');
    let year = `${date[0]}${date[1]}`;
    dob = `${date[2]}${date[3]}${date[4]}${date[5]}${year > currentYear ? '19' : '20'
      }${date[0]}${date[1]}`;
  }
  const data = {
    // dob: dob,
    firstName: result?.fields?.firstName,
    idNumber: result?.fields?.documentNumber,
    license: result?.fields?.documentNumber,
    lastName: result?.fields?.lastName,
    sex:
      result?.fields?.sex == 'male'
        ? 'M'
        : result?.fields?.sex == 'female'
          ? 'F'
          : result?.fields?.sex
            ? 'X'
            : '',
  };
  if (dob && dob != '') {
    data.dob = dob;
  }
  return data;
};

const getTodayTests = async (siteID, testType, employeeId) => {
  var today = moment()
    .subtract(0, 'days')
    .format('YYYY-MM-DD');
  const data = await DataStore.query(
    Test,
    test =>
      test
        .createdAt('gt', today)
        .siteID('eq', siteID)
        .test_type('eq', testType)
        .employeeID('eq', employeeId),
    {
      sort: test => test.createdAt(SortDirection.ASCENDING),
    },
  );
  return data;
};

const getLabByID = async id => {
  const model = await DataStore.query(Lab, lab => lab.id('eq', id));
  return model[0];
};

const getSentLabTests = async (siteId, status) => {
  let today = getTodayDate();

  // console.log('today is: ', today);
  // console.log('status is: ', status);
  // console.log('site id is: ', siteId);

  const data = await DataStore.query(
    Test,
    test =>
      test
        .test_type('eq', Strings.pcr)
        .status('eq', status)
        .siteID('eq', siteId)
        .createdAt('gt', today),
    {
      sort: test => test.createdAt(SortDirection.DESCENDING),
    },
  );
  console.log('tests fetched... ', data);
  if (status === TestStatus.PENDING) {
    return data.filter(d => d?.result !== 'Positive');
  } else {
    return data;
  }
};

const getClientHippa = async id => {
  const clientObj = await DataStore.query(Client, client =>
    client.id('eq', id),
  );
  if (clientObj && clientObj[0]) {
    return clientObj[0];
  }
  return '';
};
const sendEmailOnUpdate = async (tests) => {
  let formattedTest = []
  for (let i = 0; i < tests.length; i++) {
    let tObj = tests[i]
    object = {
      id: tObj.id,
      sequenceNo: tObj.sequenceNo,
    }
    formattedTest.push(object)
  }
  if (formattedTest.length > 0) {
    console.log('here are the formattedTest : ', formattedTest)
    await Storage.put(`${moment().format("DD_MM_YYYY_HH_mm_ss.SSS")}_email.csv`, jsonToCSV(formattedTest), { bucket: "result-update" });
  }
};

export default {
  getSentLabTests,
  syncStoreData,
  resetDatastore,
  getClients,
  getSitesByClient,
  getLabs,
  getLabsWithInsurance,
  getLabByID,
  searchEmployeeWithNum,
  searchEmployeeWithEmail,
  searchEmployeeWithLicense,
  searchEmployeeWithFilledForm,
  getAllSites,
  createEmployee,
  getEmployeeTestCount,
  updateEmployeeHippaConsent,
  getAllTestTypes,
  updateDB,
  uploadInsuranceCard,
  createTest,
  getDemoGraphicData,
  isBarcodeAlreadyExist,
  getAvailableBarcod,
  // updateUsedBarCode,
  updateTestTypeDB,
  sendSMSNotification,
  getUserTestResults,
  getEmplyeeIdFromBarCode,
  getPreRegisterEmployee,
  searchEmployeeWithId,
  getDefaultLab,
  updateEmployeePatternConsent,
  applePksPassGenerator,
  covertPassportJson,
  getTodayTests,
  createPreRegisterDemoRecord,
  getAppVersion,
  hrCheckIn,
  getTypeString,
  updateEmployeeRecord,
  updateExistingEmployeeRecord,
  getClientHippa,
  sendEmailOnUpdate,
};
