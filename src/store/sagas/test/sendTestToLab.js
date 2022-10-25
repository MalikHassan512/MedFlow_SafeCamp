import { put, takeEvery, call } from 'redux-saga/effects';
import {
  SEND_TEST_TO_LAB_REQUEST,
  SEND_TEST_TO_LAB_SUCCESS,
  SEND_TEST_TO_LAB_FAILURE,
} from '../../actions/types';
import { Test, Lab } from '../../../models';
import { DataStore, SortDirection, Storage } from 'aws-amplify';

import { formateLabLogs, formatTests } from './sendTestHelper';
import api from '../../../utils/api';
import Global from '../../../constants/Global';
import dataStoreHelper from '../../../utils/dataStoreHelper';

function* fetchData(action) {
  try {
    const { tests } = action.payload;
    const lab = yield call(() => DataStore.query(Lab, tests[0].labID));
    let user = yield call(() => api.getCurrentUser());
    if (!user) {
      user = Global.loginUser;
    }
    // console.log('user is ==> : ', user);
    const updatedTests = [];
    for (let i = 0; i < tests.length; i++) {
      let t = { ...tests[i] };
      t.status = 'Sent';
      t.test_type = 'PCR';
      t.submittedBy = user?.sub;
      t.submittedByName =
        user?.['custom:firstName'] &&
        user?.['custom:lastName'] &&
        user['custom:firstName'] + ' ' + user['custom:lastName'];

      updatedTests.push(t);
    }

    console.log('here are the updated test: ', updatedTests);
    const [formattedTests, bucket, batch] = formatTests(lab.name, tests);
    const [testLogsJSon, logBucket, logBatch] = formateLabLogs(updatedTests);

    try {
      yield call(() =>
        Storage.put(`${batch}.csv`, formattedTests, { bucket: bucket }),
      );
      yield call(() =>
        Storage.put(`${logBatch}.csv`, testLogsJSon, { bucket: logBucket }),
      );
      let labPhoneNumber = lab ? lab.contact_phone : null
      if (labPhoneNumber) {
        console.log('lab phone number is this : ', labPhoneNumber)
        dataStoreHelper.sendSMSNotification(labPhoneNumber, 'Your lab has newly submitted tests.');
      }
    } catch (e) {
      console.log('storage error', e);
    }

    // for (let i = 0; i < tests.length; i++) {
    //   let test = tests[i]
    //   const testObj = yield call (() => DataStore.query(Test, test.id))
    //   yield call(() => DataStore.save(
    //       Test.copyOf(testObj, (updated) => {
    //         updated.submittedBy = user?.sub;
    //         updated.submittedByName = user?.['custom:firstName'] &&
    //             user?.['custom:lastName'] &&
    //             user['custom:firstName'] + ' ' + user['custom:lastName'];
    //         updated.status = 'Sent';
    //         updated.test_type = "PCR";
    //       }),
    //   ))
    // };

    yield put({
      type: SEND_TEST_TO_LAB_SUCCESS,
      // data: data,
    });
  } catch (error) {
    yield put({
      type: SEND_TEST_TO_LAB_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(SEND_TEST_TO_LAB_REQUEST, fetchData);
}

export default dataSaga;
