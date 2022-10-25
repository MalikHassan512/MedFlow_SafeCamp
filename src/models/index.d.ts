import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type LabMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TestMetaData = {
  readOnlyFields: 'updatedAt';
}

type EmployeeMetaData = {
  readOnlyFields: 'updatedAt';
}

type ClientMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SiteMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LencoBarcodesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TestConsentMetaData = {
  readOnlyFields: 'updatedAt';
}

type TestTypesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EmployeeBarCodesMetaData = {
  readOnlyFields: 'updatedAt';
}

type EmployeeTestCounterMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ExternalTestMetaData = {
  readOnlyFields: 'updatedAt';
}

export declare class Lab {
  readonly id: string;
  readonly name?: string | null;
  readonly logo?: string | null;
  readonly contact_name?: string | null;
  readonly contact_phone?: string | null;
  readonly user_id?: string | null;
  readonly contact_email?: string | null;
  readonly tubes_provided?: boolean | null;
  readonly lab_director?: string | null;
  readonly clia_number?: string | null;
  readonly testing_notes?: string | null;
  readonly street?: string | null;
  readonly city_state_zip?: string | null;
  readonly lab_contacts?: (string | null)[] | null;
  readonly default_antigen?: boolean | null;
  readonly antigen_notes?: string | null;
  readonly default_molecular?: boolean | null;
  readonly default_other?: boolean | null;
  readonly molecular_notes?: string | null;
  readonly other_notes?: string | null;
  readonly sendInsurance?: boolean | null;
  readonly barCodeProvided?: boolean | null;
  readonly barCodeAlertLimit?: number | null;
  readonly whiteLabel?: boolean | null;
  readonly whiteLabelPackage?: string | null;
  readonly showOnSummaryScreen?: boolean | null;
  readonly orderCodes?: (string | null)[] | null;
  readonly isArchive?: boolean | null;
  readonly positiveCount?: number | null;
  readonly negativeCount?: number | null;
  readonly postitiveDate?: string | null;
  readonly totalTest?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Lab, LabMetaData>);
  static copyOf(source: Lab, mutator: (draft: MutableModel<Lab, LabMetaData>) => MutableModel<Lab, LabMetaData> | void): Lab;
}

export declare class Test {
  readonly id: string;
  readonly status?: string | null;
  readonly clientID?: string | null;
  readonly labID?: string | null;
  readonly employeeID?: string | null;
  readonly siteID?: string | null;
  readonly baseSiteID?: string | null;
  readonly batch?: string | null;
  readonly barcode?: string | null;
  readonly owner?: string | null;
  readonly result?: string | null;
  readonly resultDate?: string | null;
  readonly resultDateTime?: string | null;
  readonly employee_demographics?: string | null;
  readonly site_name?: string | null;
  readonly clientName?: string | null;
  readonly labName?: string | null;
  readonly phoneNumber?: string | null;
  readonly test_number?: number | null;
  readonly email?: string | null;
  readonly tester_name?: string | null;
  readonly isAntigen?: boolean | null;
  readonly referenceID?: string | null;
  readonly test_type?: string | null;
  readonly createdBy?: string | null;
  readonly testerPhone?: string | null;
  readonly submittedBy?: string | null;
  readonly submittedByName?: string | null;
  readonly StampBy?: string | null;
  readonly StampByName?: string | null;
  readonly emailSend?: boolean | null;
  readonly quarantinedStart?: string | null;
  readonly quarantinedEnd?: string | null;
  readonly startTimeStamp?: string | null;
  readonly timerStatus?: string | null;
  readonly startDate?: string | null;
  readonly expired?: boolean | null;
  readonly beenTimed?: boolean | null;
  readonly done?: boolean | null;
  readonly sr_no?: string | null;
  readonly appVer?: string | null;
  readonly sequenceNo?: number | null;
  readonly createSource?: string | null;
  readonly isFalsePositive?: boolean | null;
  readonly invalidResultStatus?: number | null;
  readonly isLucira?: boolean | null;
  readonly patternTestAnswer?: string | null;
  readonly schrID?: string | null;
  readonly schrTestID?: string | null;
  readonly createdAt?: string | null;
  readonly timezone?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Test, TestMetaData>);
  static copyOf(source: Test, mutator: (draft: MutableModel<Test, TestMetaData>) => MutableModel<Test, TestMetaData> | void): Test;
}

export declare class Employee {
  readonly id: string;
  readonly first?: string | null;
  readonly last?: string | null;
  readonly dob?: string | null;
  readonly id_number?: string | null;
  readonly clientID?: string | null;
  readonly street?: string | null;
  readonly street2?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly zip?: string | null;
  readonly countryCode?: string | null;
  readonly phone_number?: string | null;
  readonly sex?: string | null;
  readonly email?: string | null;
  readonly isVaccinated?: boolean | null;
  readonly insurance_name?: string | null;
  readonly insurance_number?: string | null;
  readonly subID?: string | null;
  readonly site_name?: string | null;
  readonly isNew?: boolean | null;
  readonly isPreRegistered?: boolean | null;
  readonly medflowDomain?: string | null;
  readonly mdID?: number | null;
  readonly schrID?: string | null;
  readonly whiteGlove?: boolean | null;
  readonly employeeType?: string | null;
  readonly profileImage?: string | null;
  readonly vaccinationCardUpload?: boolean | null;
  readonly vaccinationCardImage?: string | null;
  readonly vaccinationDetails?: string | null;
  readonly vaccinationType?: string | null;
  readonly vaccinationDate?: string | null;
  readonly vaccinationLocation?: string | null;
  readonly vaccinationDateS?: string | null;
  readonly vaccinationLocationS?: string | null;
  readonly isExternalTest?: boolean | null;
  readonly externalTestImage?: string | null;
  readonly externalTestDate?: string | null;
  readonly externalTestType?: string | null;
  readonly externalTestResult?: string | null;
  readonly preRegisterShowId?: string | null;
  readonly patternConsent?: (string | null)[] | null;
  readonly hippaConsent?: (string | null)[] | null;
  readonly insuranceScan?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Employee, EmployeeMetaData>);
  static copyOf(source: Employee, mutator: (draft: MutableModel<Employee, EmployeeMetaData>) => MutableModel<Employee, EmployeeMetaData> | void): Employee;
}

export declare class Client {
  readonly id: string;
  readonly name?: string | null;
  readonly contact_name?: string | null;
  readonly contact_phone?: string | null;
  readonly contact_email?: string | null;
  readonly hippa?: string | null;
  readonly hippaFile?: string | null;
  readonly resultType?: string | null;
  readonly showOnSummaryScreen?: boolean | null;
  readonly whiteLabel?: boolean | null;
  readonly whiteLabelPackage?: string | null;
  readonly isArchive?: boolean | null;
  readonly positiveCount?: number | null;
  readonly negativeCount?: number | null;
  readonly postitiveDate?: string | null;
  readonly totalTest?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Client, ClientMetaData>);
  static copyOf(source: Client, mutator: (draft: MutableModel<Client, ClientMetaData>) => MutableModel<Client, ClientMetaData> | void): Client;
}

export declare class Site {
  readonly id: string;
  readonly name?: string | null;
  readonly clientID?: string | null;
  readonly contact_name?: string | null;
  readonly contact_phone?: string | null;
  readonly contact_email?: string | null;
  readonly antigen?: boolean | null;
  readonly automateTestType?: string | null;
  readonly user_id?: string | null;
  readonly show_contacts?: (string | null)[] | null;
  readonly insurance_required?: boolean | null;
  readonly sendInsuranceCard?: boolean | null;
  readonly resetTestDay?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly orderKitDate?: string | null;
  readonly orderQuantity?: number | null;
  readonly enableShipment?: boolean | null;
  readonly showOnSummaryScreen?: boolean | null;
  readonly messageTested?: string | null;
  readonly messageResulted?: string | null;
  readonly messagePositive?: string | null;
  readonly printLabel?: string | null;
  readonly isArchive?: boolean | null;
  readonly isLucira?: boolean | null;
  readonly vaccinationCard?: boolean | null;
  readonly externalTest?: boolean | null;
  readonly externalTestType?: string | null;
  readonly externalTestDuration?: string | null;
  readonly externalTestAdmit?: boolean | null;
  readonly patternTesting?: boolean | null;
  readonly patternHippa?: string | null;
  readonly preRegistration?: boolean | null;
  readonly admit?: boolean | null;
  readonly positiveCount?: number | null;
  readonly negativeCount?: number | null;
  readonly postitiveDate?: string | null;
  readonly totalTest?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Site, SiteMetaData>);
  static copyOf(source: Site, mutator: (draft: MutableModel<Site, SiteMetaData>) => MutableModel<Site, SiteMetaData> | void): Site;
}

export declare class LencoBarcodes {
  readonly id: string;
  readonly labID?: string | null;
  readonly barcode?: string | null;
  readonly available?: boolean | null;
  readonly isActive?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<LencoBarcodes, LencoBarcodesMetaData>);
  static copyOf(source: LencoBarcodes, mutator: (draft: MutableModel<LencoBarcodes, LencoBarcodesMetaData>) => MutableModel<LencoBarcodes, LencoBarcodesMetaData> | void): LencoBarcodes;
}

export declare class TestConsent {
  readonly id: string;
  readonly employeeID?: string | null;
  readonly siteID?: string | null;
  readonly isConsent?: boolean | null;
  readonly isInsuranceCardScan?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<TestConsent, TestConsentMetaData>);
  static copyOf(source: TestConsent, mutator: (draft: MutableModel<TestConsent, TestConsentMetaData>) => MutableModel<TestConsent, TestConsentMetaData> | void): TestConsent;
}

export declare class TestTypes {
  readonly id: string;
  readonly name?: string | null;
  readonly totalTime?: string | null;
  readonly firstAlert?: string | null;
  readonly secondAlert?: string | null;
  readonly duration?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<TestTypes, TestTypesMetaData>);
  static copyOf(source: TestTypes, mutator: (draft: MutableModel<TestTypes, TestTypesMetaData>) => MutableModel<TestTypes, TestTypesMetaData> | void): TestTypes;
}

export declare class EmployeeBarCodes {
  readonly id: string;
  readonly employeeID?: string | null;
  readonly barcode?: string | null;
  readonly phone_number?: string | null;
  readonly licenceNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EmployeeBarCodes, EmployeeBarCodesMetaData>);
  static copyOf(source: EmployeeBarCodes, mutator: (draft: MutableModel<EmployeeBarCodes, EmployeeBarCodesMetaData>) => MutableModel<EmployeeBarCodes, EmployeeBarCodesMetaData> | void): EmployeeBarCodes;
}

export declare class EmployeeTestCounter {
  readonly id: string;
  readonly counter?: number | null;
  readonly employeeCounter?: number | null;
  readonly patternQuestion?: string | null;
  readonly totalTest?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EmployeeTestCounter, EmployeeTestCounterMetaData>);
  static copyOf(source: EmployeeTestCounter, mutator: (draft: MutableModel<EmployeeTestCounter, EmployeeTestCounterMetaData>) => MutableModel<EmployeeTestCounter, EmployeeTestCounterMetaData> | void): EmployeeTestCounter;
}

export declare class ExternalTest {
  readonly id: string;
  readonly status?: string | null;
  readonly clientID?: string | null;
  readonly employeeID?: string | null;
  readonly siteID?: string | null;
  readonly owner?: string | null;
  readonly reason?: string | null;
  readonly employee_demographics?: string | null;
  readonly site_name?: string | null;
  readonly phoneNumber?: string | null;
  readonly tester_name?: string | null;
  readonly email?: string | null;
  readonly vaccineCardFile?: string | null;
  readonly externalTestFile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ExternalTest, ExternalTestMetaData>);
  static copyOf(source: ExternalTest, mutator: (draft: MutableModel<ExternalTest, ExternalTestMetaData>) => MutableModel<ExternalTest, ExternalTestMetaData> | void): ExternalTest;
}