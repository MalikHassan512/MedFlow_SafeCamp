import { put, takeEvery, call } from 'redux-saga/effects';
import {
  GET_RAPID_ANTIGEN_TEST_REQUEST,
  GET_RAPID_ANTIGEN_TEST_SUCCESS,
  GET_RAPID_ANTIGEN_TEST_FAILURE
} from '../../actions/types';
import { Test } from '../../../models';
import { DataStore, SortDirection } from 'aws-amplify';
import { Strings } from '../../../constants';
import moment from "moment";
import dataStoreHelper from '../../../utils/dataStoreHelper';
import { getTodayDate, getTodayDateOnly } from '../../util';

function* fetchData(action) {
  try {

    const { id } = action.payload;
    let today = getTodayDate()
    let todayDate = getTodayDateOnly()

    const pendingTest = yield call(() => DataStore.query(
      Test,
      (test) => test.siteID('eq', id).test_type('eq', Strings.antigen).createdAt('gt', today),
      {
        sort: (test) => test.createdAt(SortDirection.DESCENDING),
      },
    ));
    const unResultTests = yield call(() => DataStore.query(
      Test,
      (test) => test.siteID('eq', id).test_type('eq', Strings.antigen).createdAt('lt', today).status('eq', Strings.PENDING).result('eq', null).sequenceNo('ne', null),
      {
        sort: (test) => test.createdAt(SortDirection.DESCENDING),
      },
    ));
    const oldResultedTests = yield call(() => DataStore.query(
      Test,
      (test) => test.siteID('eq', id).test_type('eq', Strings.antigen).createdAt('lt', today).resultDate('eq', todayDate).sequenceNo('ne', null),
      {
        sort: (test) => test.createdAt(SortDirection.DESCENDING),
      },
    ));
    console.log('pendingTest length is : ', pendingTest.length)
    console.log('unResultTests length is : ', unResultTests.length)
    console.log('oldResultedTests length is : ', oldResultedTests.length)
    
    let allTests = pendingTest.concat(unResultTests, oldResultedTests)
    console.log('allTests length is : ', allTests.length)

    yield put({
      type: GET_RAPID_ANTIGEN_TEST_SUCCESS,
      data: allTests,
    });
  } catch (error) {
    console.log('rapid antigen list error: ', error)
    yield put({
      type: GET_RAPID_ANTIGEN_TEST_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(GET_RAPID_ANTIGEN_TEST_REQUEST, fetchData);
}

export default dataSaga;
