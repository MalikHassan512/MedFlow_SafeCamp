import {put, takeEvery, call} from 'redux-saga/effects';
import {
  DELETE_TEST_SUCCESS,
  DELETE_TEST_FAILURE,
  DELETE_TEST_REQUEST,
} from '../../actions/types';
import { Test} from '../../../models';
import {DataStore, SortDirection} from 'aws-amplify';

function* fetchData(action) {
  try {

    const {test} = action.payload;

    // const data = yield call(() => DataStore.query(
    //     Test,
    //     (test) => test.siteID('eq', id).test_type('eq', 'Other'),
    //     {
    //       sort: (test) => test.createdAt(SortDirection.ASCENDING),
    //     },
    // ));


    const testToDel = yield call (() => DataStore.query(Test, test.id))
    const del = yield call (() => DataStore.delete(testToDel))
    // const t = await DataStore.query(Test, test.id)
    // const del = await DataStore.delete(t)

    console.log('delete test response is: ', del)

    yield put({
      type: DELETE_TEST_SUCCESS,
      // data: data,
    });

  } catch (error) {
    yield put({
      type: DELETE_TEST_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(DELETE_TEST_REQUEST, fetchData);
}

export default dataSaga;
