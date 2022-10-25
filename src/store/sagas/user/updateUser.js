import {put, takeEvery, call} from 'redux-saga/effects';
import {
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from '../../actions/types';
import api from '../../../utils/api';

function* fetchData() {
  try {
    const user = yield api.getCurrentUser();

    console.log('USer from updateUser saga::::>>', user);

    yield put({
      type: UPDATE_USER_SUCCESS,
      payload: user,
    });
  } catch (error) {
    yield put({
      type: UPDATE_USER_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(UPDATE_USER_REQUEST, fetchData);
}

export default dataSaga;
