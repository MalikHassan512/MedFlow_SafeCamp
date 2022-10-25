import {combineReducers} from 'redux';
//Reducers
import userReducer from './user';
import printerReducer from './printer';
import testReducer from './test';
import employeeReducer from './employee';
import eventConfigReducer from "./eventConfig";

const appReducer = combineReducers({
  user: userReducer,
  printer: printerReducer,
  test: testReducer,
  employee: employeeReducer,
  eventConfig: eventConfigReducer,
});

const reducer = (state, action) => {
  return appReducer(state, action);
};

export default reducer;
