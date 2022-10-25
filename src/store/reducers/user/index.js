import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from '../../actions/types';

const initialState = {
  errorMessage: 'Something went wrong. Please try again',
  isLoading: false,
  user: {},
  isUserLoggedIn: false,
  pendingLabTests: [],
  pendingAntigenTests: [],
  pendingOtherTests: [],
  pendingMolecularTests: [],
  nonPendingTests: [],
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case LOGIN_SUCCESS:
      console.log('Login successful in reducer:::>>', action.payload);
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
        isUserLoggedIn: true,
        user: action?.payload,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };

    case UPDATE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
        isUserLoggedIn: true,
        user: action.payload,
      };

    case UPDATE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };

    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };

    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
        isUserLoggedIn: false,
      };

    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };

    default:
      return state;
  }
};

export default userReducer;
