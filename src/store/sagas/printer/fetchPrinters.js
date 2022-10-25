import {put, takeEvery, call} from 'redux-saga/effects';
import printerHelper from '../../../utils/printerHelper';
import {
  PRINTER_REQUEST,
  PRINTER_REQUEST_SUCCESS,
  PRINTER_REQUEST_FAILURE,
} from '../../actions/types';

function* fetchData(actions) {
  try {
    let printerData = null;
    printerHelper.getBluetoothState(actions.payload, data => {
      printerData = data;
    });
    console.log(
      '🚀 ~ file: fetchPrinters.js ~ line 25 ~ function*fetchData ~ printerData',
      printerData,
    );
    yield put({
      type: printerData.isSuccess
        ? PRINTER_REQUEST_SUCCESS
        : PRINTER_REQUEST_FAILURE,
    });
  } catch (error) {
    // console.log('THis is printer success failure saga');
    yield put({
      type: PRINTER_REQUEST_FAILURE,
    });
  }
}

function* dataSaga() {
  console.log('THis is printer request from saga');
  yield takeEvery(PRINTER_REQUEST, fetchData);
}

export default dataSaga;
