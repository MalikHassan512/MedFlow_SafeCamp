import {SAVE_EMPLOYEE_INFO} from '../../actions/types';

const initialState = {
  errorMessage: 'Something went wrong. Please try again',
  isLoading: false,
  employeeInfo: {},
};
const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_EMPLOYEE_INFO:
      return {...state, employeeInfo: action.payload};
    default:
      return state;
  }
};

export default employeeReducer;
