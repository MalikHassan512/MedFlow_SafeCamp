import {put, takeEvery, call} from 'redux-saga/effects';
import {
  UPDATE_TEST_TYPE_REQUEST,
  UPDATE_TEST_TYPE_SUCCESS,
  UPDATE_TEST_TYPE_FAILURE,
} from '../../actions/types';
import {Test} from '../../../models';
import {DataStore} from 'aws-amplify';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {App_Constants, Strings, TestStatus, TestTypes} from '../../../constants';

function* fetchData(action) {
  try {
    const {tests, type, config, isTimerTest} = action.payload;
    console.log('test type (saga) is: ', type);
    console.log('test length ', tests.length);

    if (isTimerTest) {
      for (const test of tests) {
        const testObj = yield call(() =>
          DataStore.query(Test, t => t.id('eq', test.id)),
        );
        // console.log('test obj update to type: ', type);
        // console.log('test obj while updating type: ', testObj);
        // console.log('config item while updating type: ', config);

        console.log('test obj lab ', testObj[0].labID);
        console.log('config lab obj ', config?.lab?.id);

        if (type === TestTypes.PCR) {
          yield call(() =>
            DataStore.save(
              Test.copyOf(testObj[0], updated => {
                updated.status = Strings.PENDING
                updated.result = null
                updated.StampBy = null
                updated.StampByName = null
                updated.resultDate = null
                updated.resultDateTime = null
                updated.timerStatus = Strings.started
                updated.test_type = type;
                updated.labID = config?.lab
                  ? config?.lab?.id
                  : testObj[0]?.labID;
                updated.labName = config?.lab
                  ? config?.lab?.name
                  : testObj[0]?.labName;
              }),
            ),
          );
        } else {
          let defaultLab = yield call(() =>
            dataStoreHelper.getDefaultLab(type),
          );
          yield call(() =>
            DataStore.save(
              Test.copyOf(testObj[0], updated => {
                updated.test_type = type;
                updated.labID = defaultLab ? defaultLab?.id : testObj[0].labID;
                updated.labName = defaultLab
                  ? defaultLab?.name
                  : testObj[0].labName;
              }),
            ),
          );
        }
      }
    } else {
      let lab = yield call(() => dataStoreHelper.getDefaultLab(type));
      console.log('here is the defaultLab : ', lab);
      for (const test of tests) {
        const testObj = yield call(() =>
          DataStore.query(Test, t => t.id('eq', test.id)),
        );
        yield call(() =>
          DataStore.save(
            Test.copyOf(testObj[0], updated => {
              updated.test_type = type;
              updated.status =
                testObj[0].status === TestStatus.SENT
                  ? TestStatus.PENDING
                  : testObj[0].status;
              updated.labID = lab
                ? lab.id
                : config
                ? config.labID
                : testObj[0].labID;
              updated.labName = lab
                ? lab.name
                : config
                ? config.labName
                : testObj[0].labName;
            }),
          ),
        );
      }
    }

    yield put({
      type: UPDATE_TEST_TYPE_SUCCESS,
    });
  } catch (error) {
    console.log('update test info error: ', error);
    yield put({
      type: UPDATE_TEST_TYPE_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(UPDATE_TEST_TYPE_REQUEST, fetchData);
}

export default dataSaga;
