import {put, takeEvery, call} from 'redux-saga/effects';
import {
  GET_LAB_TEST_FAILURE,
  GET_LAB_TEST_SUCCESS,
  GET_LAB_TEST_REQUEST,
} from '../../actions/types';
import {Test} from '../../../models';
import {DataStore, SortDirection} from 'aws-amplify';
import {Strings} from '../../../constants';
import moment from 'moment';
import {getTodayDate} from '../../util';

function* fetchData(action) {
  try {
    const {siteId, labId, sentTest} = action.payload;
    let today = getTodayDate();

    let nData = null;
    if (sentTest) {
      const data = yield call(() =>
        DataStore.query(
          Test,
          test =>
            test
              .test_type('eq', Strings.pcr)
              .status('eq', 'Sent')
              .siteID('eq', siteId)
              .createdAt('gt', today),
          {
            sort: test => test.createdAt(SortDirection.DESCENDING),
          },
        ),
      );
      console.log('sent test data is: ', data);
      nData = data;
    } else {
      const data = yield call(() =>
        DataStore.query(
          Test,
          test =>
            test
              .status('eq', 'Pending')
              .test_type('eq', Strings.pcr)
              .siteID('eq', siteId)
              .createdAt('gt', today),
          {
            sort: test => test.createdAt(SortDirection.DESCENDING),
          },
        ),
      );
      nData = data.filter(d => d?.result !== 'Positive');
    }

    yield put({
      type: GET_LAB_TEST_SUCCESS,
      data: nData,
      // data: data,
    });
  } catch (error) {
    console.log('get lab test list error: ', error);
    yield put({
      type: GET_LAB_TEST_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(GET_LAB_TEST_REQUEST, fetchData);
}

export default dataSaga;
