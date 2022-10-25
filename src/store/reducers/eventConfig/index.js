import {
  GET_CLIENTS_REQUEST,
  GET_CLIENTS_FAILURE,
    GET_CLIENTS_SUCCESS,
  UPDATE_CLIENT_LIST,
  UPDATE_SITE_LIST,
  UPDATE_LAB_LIST,
  UPDATE_TEST_SETTINGS,
} from '../../actions/types';

const initialState = {
  errorMessage: 'Something went wrong. Please try again',
  isLoading: false,
  isUserLoggedIn: false,
  clients: [],
  sites: [],
  labs: [],
  testSettings: null,
};
const eventConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TEST_SETTINGS:
      return {
        ...state,
        testSettings: action.payload
      }

    case GET_CLIENTS_REQUEST:
      return {...state};
      case GET_CLIENTS_SUCCESS:
      return {...state};
      case GET_CLIENTS_FAILURE:
      return {...state};
    case UPDATE_CLIENT_LIST:
      return {
        ...state,
        clients: action.payload
      }
    case UPDATE_SITE_LIST:
      return {
        ...state,
        sites: action.payload
      }
    case UPDATE_LAB_LIST:
      return {
        ...state,
        labs: action.payload
      }


    default:
      return state;
  }
};

export default eventConfigReducer;
