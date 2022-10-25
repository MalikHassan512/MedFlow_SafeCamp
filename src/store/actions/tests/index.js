import {
  GET_LAB_TEST_REQUEST,
  UPDATE_SELECTED_SITE,
  GET_ACCULA_TEST_REQUEST,
  GET_RAPID_ANTIGEN_TEST_REQUEST,
  GET_CUE_TEST_REQUEST,
  DELETE_TEST_REQUEST,
  UPDATE_EMPLOYEE_TEST_COUNT,
  UPDATE_TEST_CONFIG_REQUEST,
  CREATE_SOURCE,
  UPDATE_TEST_TYPE,
  SEND_TEST_TO_LAB_REQUEST,
  UPDATE_TEST_TYPE_REQUEST,
  UPDATE_TEST_EMP_INFO_REQUEST,
} from '../types';

export const updateTestEmpInfo = (payload, onResponse) => {
  return {type: UPDATE_TEST_EMP_INFO_REQUEST, payload, onResponse};
};

export const updateTestLabType = payload => {
  return {type: UPDATE_TEST_TYPE_REQUEST, payload};
};

export const updateSelectedSite = payload => {
  return {type: UPDATE_SELECTED_SITE, payload};
};

export const sendTestToLab = (payload, onResponse) => {
  return {type: SEND_TEST_TO_LAB_REQUEST, payload, onResponse};
};

export const getPendingLabTest = (payload, onResponse) => {
  return {type: GET_LAB_TEST_REQUEST, payload, onResponse};
};

export const getAcculaLabTests = payload => {
  return {type: GET_ACCULA_TEST_REQUEST, payload};
};

export const getRapidAntigenTests = payload => {
  return {type: GET_RAPID_ANTIGEN_TEST_REQUEST, payload};
};

export const getCueLabTests = payload => {
  return {type: GET_CUE_TEST_REQUEST, payload};
};
export const deleteTest = (payload, onResponse) => {
  return {type: DELETE_TEST_REQUEST, payload, onResponse};
};
export const updateEmployeeTestCount = payload => {
  return {
    type: UPDATE_EMPLOYEE_TEST_COUNT,
    payload,
  };
};
export const updateTestConfig = payload => {
  return {type: UPDATE_TEST_CONFIG_REQUEST, payload};
};
export const updateCreateSource = payload => {
  return {
    type: CREATE_SOURCE,
    payload,
  };
};
export const updateTestType = payload => {
  return {
    type: UPDATE_TEST_TYPE,
    payload,
  };
};
