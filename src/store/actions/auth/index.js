// Auth Actions

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from '../types';

export const loginRequest = (payload, onResponse) => {
  return {type: LOGIN_REQUEST, payload, onResponse};
};

export const loginSuccess = (payload, onResponse) => {
  return {type: LOGIN_SUCCESS, payload, onResponse};
};

export const loginFailure = (payload, onResponse) => {
  return {type: LOGIN_FAILURE, payload, onResponse};
};

export const updateUserRequest = (payload, onResponse) => {
  return {type: UPDATE_USER_REQUEST, payload, onResponse};
};

export const updateUserSuccess = (payload, onResponse) => {
  return {type: UPDATE_USER_SUCCESS, payload, onResponse};
};

export const updateUserFailure = (payload, onResponse) => {
  return {type: UPDATE_USER_FAILURE, payload, onResponse};
};

export const logoutRequest = (payload, onResponse) => {
  return {type: LOGOUT_REQUEST, payload, onResponse};
};

export const logoutSuccess = (payload, onResponse) => {
  return {type: LOGOUT_SUCCESS, payload, onResponse};
};

export const logoutFailure = (payload, onResponse) => {
  return {type: LOGOUT_FAILURE, payload, onResponse};
};
