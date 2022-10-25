import {all, fork} from 'redux-saga/effects';
import {login, logout, updateUser} from './user';

import {
  getLabTest,
  getAcculaTest,
  getRapidAntigenTest,
  getCueTest,
  deleteTest,
  updateTestInfo,
  sendTestToLab,
  updateTestType,
  updateTestEmpData,
} from './test';

import {fetchPrinters} from './printer';

export default function* saga() {
  yield all([
    fork(login),
    fork(logout),
    fork(getLabTest),
    fork(getAcculaTest),
    fork(getRapidAntigenTest),
    fork(getCueTest),
    fork(deleteTest),
    fork(updateTestInfo),
    fork(sendTestToLab),
    fork(updateTestType),
    fork(updateTestEmpData),
    fork(fetchPrinters),
    fork(updateUser),
  ]);
}
