import {put, takeEvery, call} from 'redux-saga/effects';
import {LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST} from '../../actions/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../utils/api';
import dataStoreHelper from '../../../utils/dataStoreHelper';

function* fetchData(action) {
  console.log('Fetching data action::', action);
  const {payload, onResponse} = action;
  const {phone, password} = payload;
  try {
    AsyncStorage.setItem(
      'signInData',
      JSON.stringify({phone: `+${phone.replace(/\D/g, '')}`, password}),
    );

    let userSignIn = yield api.userSignIn(phone, password);

    dataStoreHelper.resetDatastore();

    console.log('This is login success from saga:::', userSignIn);

    if(onResponse) {
      yield call(onResponse, '')
    }
    yield put({
      type: LOGIN_SUCCESS,
      payload: userSignIn,
    });
  } catch (error) {
    console.log('This is login failure from saga:::');
    console.log(error)
    yield put({
      type: LOGIN_FAILURE,
      error,
    });
  }
}

function* dataSaga() {
  yield takeEvery(LOGIN_REQUEST, fetchData);
}

export default dataSaga;
