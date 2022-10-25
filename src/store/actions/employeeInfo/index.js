import {SAVE_EMPLOYEE_INFO} from '../types';

export const saveEmployeeInfo = (payload, onResponse) => {
  return {type: SAVE_EMPLOYEE_INFO, payload, onResponse};
};
