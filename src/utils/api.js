import {
  DataStore,
  Predicates,
  SortDirection,
  syncExpression,
} from '@aws-amplify/datastore';
import {
  Client,
  Site,
  Lab,
  Employee,
  Test,
  TestConsent,
  TestTypes,
  LencoBarcodes,
  EmployeeBarCodes,
} from '../models';
import {Auth, Storage, API} from 'aws-amplify';
import axios from 'axios';

const signIn = async (username, password) => {
  try {
    const response = await Auth.signIn(username, password);
    return {
      ...response.attributes,
      roles:
        response.signInUserSession.accessToken.payload['cognito:groups'] || [],
      isAdmin: function() {
        return this.roles.some(role => role === 'Admins' || role === 'Testers');
      },
      isUser: function() {
        return this.roles.some(role => role === 'Employees');
      },
    };
  } catch (err) {
    return undefined;
  }
};
const updateEmployeeSubID = async (employeeUser, signInnUser) => {
  try {
    const employee =  await DataStore.save(
      Employee.copyOf(employeeUser[employeeUser.length - 1], updated => {
        updated.subID = signInnUser.sub;
      }),
    );
    return employee;
  } catch (err) {
    return undefined;
  }
};
const createNewEmployee = async (username, signInnUser) => {
  try {
   const newEmployee = await DataStore.save(
      new Employee({
        first: signInnUser?.['custom:firstName'].toLowerCase(),
        last: signInnUser?.['custom:lastName'].toLowerCase(),
        phone_number: username.substring(2),
        email: signInnUser.email,
        isNew: true,
        subID: signInnUser.sub,
      }),
    );
    return newEmployee;
  } catch (err) {
    return undefined;
  }
};

const userSignIn = async (phone, password) => {
  try {
    const response = await Auth.signIn(`+${phone.replace(/\D/g, '')}`, password);
    return {
      ...response.attributes,
      roles:
        response.signInUserSession.accessToken.payload['cognito:groups'] || [],
      isAdmin: function () {
        return this.roles.some(
          (role) => role === 'Admins' || role === 'Testers',
        );
      },
      isUser: function () {
        return this.roles.some((role) => role === 'Employees');
      },
    };
  } catch (err) {
    return undefined;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await Auth.currentAuthenticatedUser();
    return {
      ...response.attributes,
      roles:
        response.signInUserSession.accessToken.payload['cognito:groups'] || [],
      isAdmin: function () {
        return this.roles.some(
          (role) => role === 'Admins' || role === 'Testers',
        );
      },
      isUser: function () {
        return this.roles.some((role) => role === 'Employees');
      },
    };
  } catch (err) {
    return null;
  }
};

export default {
  signIn,
  updateEmployeeSubID,
  createNewEmployee,
  userSignIn,
  getCurrentUser
};
