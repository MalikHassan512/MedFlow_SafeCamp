import {updateEmployeeTestCount} from '../../actions/tests';
import {
  GET_LAB_TEST_FAILURE,
  GET_LAB_TEST_REQUEST,
  GET_LAB_TEST_SUCCESS,
  GET_ACCULA_TEST_FAILURE,
  GET_ACCULA_TEST_REQUEST,
  GET_ACCULA_TEST_SUCCESS,
  GET_CUE_TEST_FAILURE,
  GET_CUE_TEST_REQUEST,
  GET_CUE_TEST_SUCCESS,
  GET_RAPID_ANTIGEN_TEST_FAILURE,
  GET_RAPID_ANTIGEN_TEST_REQUEST,
  GET_RAPID_ANTIGEN_TEST_SUCCESS,
  UPDATE_SELECTED_SITE,
  DELETE_TEST_REQUEST,
  DELETE_TEST_SUCCESS,
  DELETE_TEST_FAILURE,
  UPDATE_EMPLOYEE_TEST_COUNT,
  UPDATE_TEST_CONFIG_REQUEST,
  UPDATE_TEST_CONFIG_SUCCESS,
  UPDATE_TEST_CONFIG_FAILURE,
  CREATE_SOURCE,
  UPDATE_TEST_TYPE,
  SEND_TEST_TO_LAB_REQUEST,
  SEND_TEST_TO_LAB_SUCCESS,
  SEND_TEST_TO_LAB_FAILURE,
  UPDATE_TEST_TYPE_REQUEST,
  UPDATE_TEST_TYPE_FAILURE,
  UPDATE_TEST_TYPE_SUCCESS,
  UPDATE_TEST_EMP_INFO_REQUEST,
  UPDATE_TEST_EMP_INFO_FAILURE,
  UPDATE_TEST_EMP_INFO_SUCCESS,
} from '../../actions/types';

const initialState = {
  errorMessage: 'Something went wrong. Please try again',
  isLoading: false,
  sendingToLab: false,
  pendingLabTests: [],
  pendingAntigenTests: [],
  pendingCueTests: [],
  pendingAcculaTests: [],
  nonPendingTests: [],
  selectedSite: null,
  employeeTestCount: null,
  createSourceType: null,
  testType: null,
  updateInProgress: false,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {

    case UPDATE_TEST_EMP_INFO_REQUEST:
      return {
        ...state,
      };
    case UPDATE_TEST_EMP_INFO_SUCCESS:
      return {
        ...state,
      };
    case UPDATE_TEST_EMP_INFO_FAILURE:
      return {
        ...state,
      };
    case UPDATE_TEST_TYPE_REQUEST:
      return {
        ...state,
        updateInProgress: true,
      };
    case UPDATE_TEST_TYPE_SUCCESS:
      return {
        ...state,
        updateInProgress: false,
      };
    case UPDATE_TEST_TYPE_FAILURE:
      return {
        ...state,
        updateInProgress: false,
      };

    case SEND_TEST_TO_LAB_REQUEST:
      return {
        ...state,
        sendingToLab: true,
        // isLoading: true,
      };
    case SEND_TEST_TO_LAB_SUCCESS:
      return {
        ...state,
        sendingToLab: false,
        // isLoading: false,
      };
    case SEND_TEST_TO_LAB_FAILURE:
      return {
        ...state,
        sendingToLab: false,
        // isLoading: false,
        errorMessage: action.error
      };

    case UPDATE_SELECTED_SITE:
      return {
        ...state,
        selectedSite: action.payload.site,
      };
    case GET_LAB_TEST_REQUEST:
      return {
        ...state,
        isLoading: (action.payload.loading !== null &&  action.payload.loading !== undefined) ? action.payload.loading : true,
        errorMessage: '',
      };
    case GET_LAB_TEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pendingLabTests: action.data,
      };
    case GET_LAB_TEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };

    case GET_ACCULA_TEST_REQUEST:
      return {
        ...state,
        isLoading: (action.payload.loading !== null &&  action.payload.loading !== undefined) ? action.payload.loading : true,
        errorMessage: '',
      };
    case GET_ACCULA_TEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pendingAcculaTests: action.data,
      };
    case GET_ACCULA_TEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };

    case GET_RAPID_ANTIGEN_TEST_REQUEST:
      console.log('action.payload.loading: ', action.payload)
      return {
        ...state,
        isLoading: (action.payload.loading !== null &&  action.payload.loading !== undefined) ? action.payload.loading :  true,
        errorMessage: '',
      };
    case GET_RAPID_ANTIGEN_TEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pendingAntigenTests: action.data,
      };
    case GET_RAPID_ANTIGEN_TEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };

    case GET_CUE_TEST_REQUEST:
      return {
        ...state,
        isLoading: (action.payload.loading !== null &&  action.payload.loading !== undefined) ? action.payload.loading : true,
        errorMessage: '',
      };
    case GET_CUE_TEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pendingCueTests: action.data,
      };
    case GET_CUE_TEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };
    case UPDATE_EMPLOYEE_TEST_COUNT:
      return {
        ...state,
        employeeTestCount: action.payload,
      };

    case DELETE_TEST_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case DELETE_TEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case DELETE_TEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };
    case CREATE_SOURCE:
      return {
        ...state,
        createSourceType: action.payload,
        errorMessage: action.error,
      };

    case UPDATE_TEST_CONFIG_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case UPDATE_TEST_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case UPDATE_TEST_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error,
      };
    case UPDATE_TEST_TYPE:
      return {
        ...state,
        testType: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
