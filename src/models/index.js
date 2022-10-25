// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Lab, Test, Employee, Client, Site, LencoBarcodes, TestConsent, TestTypes, EmployeeBarCodes, EmployeeTestCounter, ExternalTest } = initSchema(schema);

export {
  Lab,
  Test,
  Employee,
  Client,
  Site,
  LencoBarcodes,
  TestConsent,
  TestTypes,
  EmployeeBarCodes,
  EmployeeTestCounter,
  ExternalTest
};