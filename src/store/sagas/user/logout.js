import {put, takeEvery, call} from 'redux-saga/effects';
import {
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
} from '../../actions/types';
import {Auth, DataStore} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* fetchData(action) {
  try {
    yield Auth.signOut();
    yield DataStore.clear();
    yield AsyncStorage.clear();

    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: LOGOUT_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(LOGOUT_REQUEST, fetchData);
}

export default dataSaga;
