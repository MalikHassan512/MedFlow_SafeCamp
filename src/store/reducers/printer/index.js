import {
  UPDATE_PRINTER,
  PRINTER_REQUEST,
  PRINTER_REQUEST_SUCCESS,
  PRINTER_REQUEST_FAILURE,
  UPDATE_EVENT_DATA,
} from '../../actions/types';

const initialState = {
  errorMessage: 'Something went wrong. Please try again',
  isLoading: false,
  isUserLoggedIn: false,
  printer: {},
  eventData: {},
};
const printerReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRINTER:
      return {...state, printer: action.payload};

    case PRINTER_REQUEST:
      console.log('THis is printer request::::>>', action);
      return {...state, isLoading: true};
    // return {...state};
    case PRINTER_REQUEST_SUCCESS:
      console.log('THis is printer request Success::::>>', action.payload);
      return {...state};
    case PRINTER_REQUEST_FAILURE:
      console.log('THis is printer request Failure::::>>', action.payload);
      return {...state, errorMessage: action.payload};

    case UPDATE_EVENT_DATA:
      return {...state, eventData: action.payload};
    default:
      return state;
  }
};

export default printerReducer;
