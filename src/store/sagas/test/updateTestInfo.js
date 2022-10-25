import {put, takeEvery, call} from 'redux-saga/effects';
import {
  UPDATE_TEST_CONFIG_REQUEST,
  UPDATE_TEST_CONFIG_SUCCESS,
  UPDATE_TEST_CONFIG_FAILURE,
} from '../../actions/types';
import { Test} from '../../../models';
import {DataStore} from 'aws-amplify';

function* fetchData(action) {
  try {

    const {testObj, updatedInfo, type} = action.payload;

    const models = yield call(() => DataStore.query(Test, (test) => test.id('eq', testObj.id)))
    if (models.length > 0) {
      if (type !== "PCR") {
        const updatedObject = yield call(() => DataStore.save(
            Test.copyOf(models[0], (updated) => {
              updated.siteID = updatedInfo.siteID;
              updated.site_name = updatedInfo.siteName;
              updated.clientID = updatedInfo.clientID;
              updated.clientName = updatedInfo.clientName;
            }),
        ));

        console.log("updatedObject - > ", updatedObject)
      } else {
        const updatedObject = yield call(() => DataStore.save(
            Test.copyOf(models[0], (updated) => {
              updated.siteID = updatedInfo.siteID;
              updated.site_name = updatedInfo.siteName;
              updated.clientID = updatedInfo.clientID;
              updated.clientName = updatedInfo.clientName;
              updated.labID = updatedInfo.labID;
              updated.labName = updatedInfo.labName;
            }),
        ))

        console.log("updatedObject - > ", updatedObject)
      }
    }

    yield put({
      type: UPDATE_TEST_CONFIG_SUCCESS,
    });

  } catch (error) {
      console.log('update test info error: ', error)
    yield put({
      type: UPDATE_TEST_CONFIG_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(UPDATE_TEST_CONFIG_REQUEST, fetchData);
}

export default dataSaga;
