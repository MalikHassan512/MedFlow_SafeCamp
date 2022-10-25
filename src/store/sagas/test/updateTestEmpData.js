import {put, takeEvery, call} from 'redux-saga/effects';
import {
  UPDATE_TEST_EMP_INFO_REQUEST,
  UPDATE_TEST_EMP_INFO_SUCCESS,
  UPDATE_TEST_EMP_INFO_FAILURE,
} from '../../actions/types';
import {Test} from '../../../models';
import {DataStore} from 'aws-amplify';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import api from '../../../utils/api';

function* fetchData(action) {
  try {
    const {payload, onResponse} = action;
    const test = payload;
    // const test = action.payload;

    console.log('current test is: ', test);
    // return

    const testObj = yield call(() =>
      DataStore.query(Test, t => t.id('eq', test.id)),
    );
    const user = yield call(() => api.getCurrentUser());
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let date = yyyy + '-' + mm + '-' + dd;

    let tObj = testObj[0];

    const res = yield call(() =>
      DataStore.save(
        Test.copyOf(tObj, updated => {
          updated.employee_demographics = test.employee_demographics;
          (updated.email = test.employee_demographics.email),
            (updated.phoneNumber = test.employee_demographics.phoneNumber),
            (updated.isLucira = test.employee_demographics.isLucira);
        }),
      ),
    );

    yield put({
      type: UPDATE_TEST_EMP_INFO_SUCCESS,
    });
    yield call(onResponse, 'Success');
  } catch (error) {
    console.log('update test info error: ', error);
    yield put({
      type: UPDATE_TEST_EMP_INFO_FAILURE,
      error,
    });
    yield call(onResponse, error);
  }
}

function* dataSaga() {
  yield takeEvery(UPDATE_TEST_EMP_INFO_REQUEST, fetchData);
}

export default dataSaga;
