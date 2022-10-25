import {Linking, Alert} from 'react-native';
import {Strings, TestStatus, AWS_ENDPOINT, App_Constants} from '../constants';
import {useDispatch} from 'react-redux';
import {deleteTest} from '../store/actions';
import moment from 'moment';
import bigInt from 'big-integer';
import dataStoreHelper from '../utils/dataStoreHelper';
import axios from 'axios';

export const openLinkInBrowser = url => {
  console.log('url is: ', url);
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url).catch(e =>
        console.log('Error in opening url in browser: ', e),
      );
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  });
};
export const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
export const parseError = error => {
  let message = '';
  console.log('error: ', error);
  if (error.response) {
    console.log('error response 1: ', error.response);
    message = error.response.data.message;
  } else if (error.request) {
    console.log('error response 2: ', error.request);
    message = 'Network Error!';
  } else {
    console.log('error response 3: ', error.message);
    message = error.message;
  }

  console.log('error msg: ', message);

  if (message === undefined) {
    console.log('THIS IS MESSAGE 4: ', message);
    message = 'Service Unavailable';
  }
  return message;
};

export const timerCheck = (startTime, totalTime) => {
  // return 200;
  // console.log('timer check total time: ', totalTime)
  let diff = new Date().getTime() - new Date(startTime).getTime();
  diff = diff / 1000;
  if (diff > totalTime) {
    return 0;
  }
  if (diff < totalTime) {
    let time = totalTime - diff;
    // console.log('diff time: ', time)
    //   console.log('returning time: ', Math.abs(time.toFixed(0)))
    return Math.abs(time.toFixed(0));
  }
};

export const calculateTestTotalTime = time => {
  if (time) {
    const mSplitList = time?.split(':');
    let totalSeconds = 0;
    if (mSplitList.length > 1) {
      const mMinutes = mSplitList[0];
      const mSec = mSplitList[1];
      if (mMinutes !== '' && mSec !== '') {
        const minCon = Number(mMinutes);
        const secCon = Number(mSec);
        totalSeconds = minCon * 60;
        totalSeconds += secCon;
        // console.log("printMinutes: ", totalSeconds)
      }
    }
    return totalSeconds;
  }
};

export const labFilter = (companyId, siteId, labs) => {
  let fLabs = labs;
  if (
    companyId !== App_Constants.safeCampCompanyId ||
    siteId !== App_Constants.safeCampSiteId
  ) {
    fLabs = labs.filter(item => item.id !== App_Constants.safeCampLabId);
  }
  return fLabs;
};

export const crewTestedName = test => {
  if (typeof test?.employee_demographics === 'string') {
    const demoObj = JSON.parse(test.employee_demographics);
    return demoObj.firstName + ' ' + demoObj.lastName;
  } else {
    return (
      test.employee_demographics.firstName +
      ' ' +
      test.employee_demographics.lastName
    );
  }
};

export const sortTestList = (testsArray: []) => {
  let sortedList = testsArray.sort(function(a, b) {
    return (
      bigInt(a.sequenceNo ? a.sequenceNo : 9999999999) -
      bigInt(b.sequenceNo ? b.sequenceNo : 9999999999)
    );
  });
  const nonResultList = sortedList.filter(item => item.result == null);
  const resultedList = sortedList.filter(item => item.result !== null);
  let sortedResultedList = resultedList.sort(function(a, b) {
    return (
      bigInt(b.sequenceNo ? b.sequenceNo : 9999999999) -
      bigInt(a.sequenceNo ? a.sequenceNo : 9999999999)
    );
  });
  return [...nonResultList, ...sortedResultedList];
};

export const updatedResultedRecordsToDatabase = async (
  mTest,
  onlyUpdateTestToDb = false,
  testLogs,
) => {
  try {
    dataStoreHelper.updateDB(mTest, false, testLogs).then();
  } catch (error) {
    console.log('updated test to db error: ', error);
  } finally {
  }
};

export const updatedTestTypeRecordsToDatabase = async (
  mTest,
  onlyUpdateTestToDb = false,
  testLogs,
) => {
  try {
    dataStoreHelper.updateTestTypeDB(mTest, false, testLogs).then();
  } catch (error) {
    console.log('updated test type to db error: ', error);
  } finally {
  }
};
export const filterTestList = (testList, text) => {
  return text === ''
    ? testList
    : testList.filter(
        item =>
        item.sequenceNo.toString().includes(text) ||
        (item.tester_name && item.tester_name.toLowerCase().includes(text.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(text.toLowerCase())) ||
        item.employee_demographics.firstName
          ?.toLowerCase()
          .includes(text.toLowerCase()) ||
        item.employee_demographics.lastName
          ?.toLowerCase()
          .includes(text.toLowerCase()));
};
export const filterLabTestList = (testList, text) => {
  // console.log('test obj: ==> ', testList[0]);

  return text === ''
    ? testList
    : testList.filter(
        item =>
          item?.sequenceNo.toString().includes(text) ||
          item?.barcode.toLowerCase().includes(text.toLowerCase()) ||
          (item?.site_name && item?.site_name.toLowerCase().includes(text.toLowerCase())) ||
          (item.tester_name && item?.tester_name.toLowerCase().includes(text.toLowerCase())) ||
          (item.status && item?.status.toLowerCase().includes(text.toLowerCase())) ||
          (item?.labName && item?.labName.toLowerCase().includes(text.toLowerCase())) ||
          item?.employee_demographics?.firstName
            ?.toLowerCase()
            .includes(text.toLowerCase()) ||
          item?.employee_demographics?.lastName
            ?.toLowerCase()
            .includes(text.toLowerCase()),
      );
};

export const onDeleteTest = async (test, dispatch, onResponse) => {
  Alert.alert(
    Strings.CONFIRMATION,
    `${Strings.DELETE_MESSAGE} ${test.sequenceNo}?`,
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          dispatch(deleteTest({test: test}));
          onResponse();
        },
      },
    ],
  );
};

export const itemSelection = (item, selectedTests) => {
  let tempArray = selectedTests;
  let alreadyConsist = tempArray.filter(test => test.id === item.id);

  if (alreadyConsist.length > 0) {
    tempArray = tempArray.filter(test => test.id !== item.id);
  } else {
    tempArray = [...tempArray, item];
  }
  return tempArray;
};

export const getTodayDate = () => {
  // console.log('current date : ', moment().local().format('YYYY-MM-DD HH:mm:ss'))
  let today = moment()
    .local()
    .format('YYYY-MM-DD');
  console.log('moment().tz() : ', today);
  today = today + ' 00:00:00';
  today = moment(today).utc();
  console.log('data is : ', today.toISOString());
  return today.toISOString();
};
export const getTodayDateOnly = () => {
  let today = moment().format('YYYY-MM-DD');
  console.log('data is : ', today);
  return today;
};

export const sendSMSNotification = async (phoneNumber, message) => {
  try {
    const notification = await axios.post(AWS_ENDPOINT + '/notification', {
      phone_number: phoneNumber,
      message: message,
    });
    return notification;
  } catch (error) {}
};
export const getArrangedTestList = (testList) => {
  let arrangedObj = {}
  for (let i = 0; i < testList.length; i++) {
    let test = testList[i]
    let keys = Object.keys(arrangedObj)
    if (keys.includes(test.labID)) {
      arrangedObj[test.labID].push(test)
    } else {
      arrangedObj[test.labID] = []
      arrangedObj[test.labID].push(test)
    }
  }
  return arrangedObj

}

export let testDummyData = {
  id: '12345',
  name: 'John smith',
  batch: 'Mon May 2020',
  show: 'Elon Show',
  labName: 'Alpha Lab',
  tester: 'User Tester',
  status: 'Pending',
  timer: 60,
  result: '',
};
