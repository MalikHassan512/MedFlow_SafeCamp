import {put, takeEvery, call} from 'redux-saga/effects';
import {
  GET_ACCULA_TEST_FAILURE,
  GET_ACCULA_TEST_REQUEST,
  GET_ACCULA_TEST_SUCCESS
} from '../../actions/types';
import { Test} from '../../../models';
import {DataStore, SortDirection} from 'aws-amplify';
import { Strings } from '../../../constants';
import moment from "moment";
import { getTodayDate, getTodayDateOnly } from '../../util';

function* fetchData(action) {
  try {

    const {id} = action.payload;
    let today = getTodayDate()
    let todayDate = getTodayDateOnly()


    const pendingTest = yield call(() => DataStore.query(
        Test,
        (test) => test.siteID('eq', id).test_type('eq', Strings.other).createdAt('gt', today),
        {
          sort: (test) => test.createdAt(SortDirection.ASCENDING),
        },
    ));
    const unResultTests = yield call(() => DataStore.query(
      Test,
      (test) => test.siteID('eq', id).test_type('eq', Strings.other).createdAt('lt', today).status('eq', Strings.PENDING).result('eq', null).sequenceNo('ne', null),
      {
        sort: (test) => test.createdAt(SortDirection.DESCENDING),
      },
    ));
    const oldResultedTests = yield call(() => DataStore.query(
      Test,
      (test) => test.siteID('eq', id).test_type('eq', Strings.other).createdAt('lt', today).resultDate('eq', todayDate).sequenceNo('ne', null),
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
      type: GET_ACCULA_TEST_SUCCESS,
      data: allTests,
    });
  } catch (error) {
    yield put({
      type: GET_ACCULA_TEST_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(GET_ACCULA_TEST_REQUEST, fetchData);
}

export default dataSaga;
