import {
  UPDATE_PRINTER,
  PRINTER_REQUEST,
  PRINTER_REQUEST_SUCCESS,
  PRINTER_REQUEST_FAILURE,
  UPDATE_EVENT_DATA,
  GET_CLIENTS_REQUEST,
  UPDATE_LAB_LIST,
  UPDATE_SITE_LIST,
  UPDATE_CLIENT_LIST,
  UPDATE_TEST_SETTINGS,
} from '../types';

export const updatePrinter = (payload, onResponse) => {
  return {type: UPDATE_PRINTER, payload, onResponse};
};

export const printerRequest = (payload, onResponse) => {
  return {type: PRINTER_REQUEST, payload, onResponse};
};

export const printerRequestSuccess = (payload, onResponse) => {
  return {type: PRINTER_REQUEST_SUCCESS, payload, onResponse};
};

export const printerRequestFailure = (payload, onResponse) => {
  return {type: PRINTER_REQUEST_FAILURE, payload, onResponse};
};

export const updateEventData = (payload, onResponse) => {
  return {type: UPDATE_EVENT_DATA, payload, onResponse};
};

export const updateSites = payload => {
  return {type: UPDATE_SITE_LIST, payload};
};
export const updateClients = payload => {
  return {type: UPDATE_CLIENT_LIST, payload};
};
export const updateLabs = payload => {
  return {type: UPDATE_LAB_LIST, payload};
};
export const updateTestSettings = payload => {
  return {type: UPDATE_TEST_SETTINGS, payload};
};

// export const getClients = () => {
//   return {type: GET_CLIENTS_REQUEST}
// }
