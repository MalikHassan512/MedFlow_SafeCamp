const parsePDF147 = msgBody => {
  const DLAbbrDesMap = {
    DCA: 'Jurisdiction-specific vehicle class',
    DBA: 'Expiry Date',
    DCT: 'Under 21 - First Name',
    DCS: 'Last Name',
    DAC: 'First Name',
    DBD: 'Issue Date',
    DBB: 'Birth Date',
    DBC: 'Gender',
    DAY: 'Eye Color',
    DAU: 'Height',
    DAG: 'Street',
    DAI: 'City',
    DAJ: 'State',
    DAK: 'Zip',
    DAQ: 'License Number',
    DCF: 'Document Discriminator',
    DCG: 'Issue Country',
    DAH: 'Street 2',
    DAZ: 'Hair Color',
    DCI: 'Place of birth',
    DCJ: 'Audit information',
    DCK: 'Inventory Control Number',
    DBN: 'Alias / AKA Family Name',
    DBG: 'Alias / AKA Given Name',
    DBS: 'Alias / AKA Suffix Name',
    DCU: 'Name Suffix',
    DCE: 'Physical Description Weight Range',
    DCL: 'Race / Ethnicity',
    DCM: 'Standard vehicle classification',
    DCN: 'Standard endorsement code',
    DCO: 'Standard restriction code',
    DCP: 'Jurisdiction-specific vehicle classification description',
    DCQ: 'Jurisdiction-specific endorsement code description',
    DCR: 'Jurisdiction-specific restriction code description',
    DDA: 'Compliance Type',
    DDB: 'Card Revision Date',
    DDC: 'HazMat Endorsement Expiration Date',
    DDD: 'Limited Duration Document Indicator',
    DAW: 'Weight(pounds)',
    DAX: 'Weight(kilograms)',
    DDH: 'Under 18 Until',
    DDI: 'Under 19 Until',
    DDJ: 'Under 21 Until',
    DDK: 'Organ Donor Indicator',
    DDL: 'Veteran Indicator',
    // old standard
    DAA: 'Customer Full Name',
    DAB: 'Customer Last Name',
    DAE: 'Name Suffix',
    DAF: 'Name Prefix',
    DAL: 'Residence Street Address1',
    DAM: 'Residence Street Address2',
    DAN: 'Residence City',
    DAO: 'Residence Jurisdiction Code',
    DAR: 'License Classification Code',
    DAS: 'License Restriction Code',
    DAT: 'License Endorsements Code',
    DAV: 'Height in CM',
    DBE: 'Issue Timestamp',
    DBF: 'Number of Duplicates',
    DBH: 'Organ Donor',
    DBI: 'Non-Resident Indicator',
    DBJ: 'Unique Customer Identifier',
    DBK: 'Social Security Number',
    DBM: 'Social Security Number',
    DCH: 'Federal Commercial Vehicle Codes',
    DBR: 'Name Suffix',
    PAA: 'Permit Classification Code',
    PAB: 'Permit Expiration Date',
    PAC: 'Permit Identifier',
    PAD: 'Permit IssueDate',
    PAE: 'Permit Restriction Code',
    PAF: 'Permit Endorsement Code',
    ZVA: 'Court Restriction Code',
    DAD: 'Middle Name',
  };

  let lines = msgBody.split('\n');
  let abbrs = Object.keys(DLAbbrDesMap);
  let map = {};
  lines.forEach((line, i) => {
    let abbr;
    let content;
    if (i === 1) {
      if (line.indexOf('DAA') !== -1) {
        abbr = 'DAA';
        content = line.substring(line.indexOf(abbr) + 3);
      } else if (line.indexOf('DCS') !== -1) {
        abbr = 'DCS';
        content = line.substring(line.indexOf(abbr) + 3);
      } else if (line.indexOf('DCT') !== -1) {
        abbr = 'DCT';
        content = line.substring(line.indexOf(abbr) + 3);
      } else {
        abbr = 'DAQ';
        content = line.substring(line.indexOf(abbr) + 3);
      }
    } else {
      abbr = line.substring(0, 3);
      content = line.substring(3).trim();
    }
    if (abbrs.includes(abbr)) {
      map[DLAbbrDesMap[abbr]] = content;
    }
  });
  return map;
};

const createRecordFromScan = (scannedData = {}) => {
  const demmographics = {
    firstName: '',
    lastName: '',
    dob: '',
    idNumber: '',
    sex: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
  };

  let fullName = scannedData['Customer Full Name'];

  let fName = fullName
    ? fullName.split(',')[1]
    : scannedData['First Name']
    ? scannedData['First Name']
    : '';

  if (fName === '') {
    fName = scannedData['Under 21 - First Name']?.split(',')[0];
  }
  demmographics.firstName = fName?fName:"";
  demmographics.lastName = fullName
    ? fullName.split(',')[0]
    : scannedData['Last Name']
    ? scannedData['Last Name']
    : '';
  demmographics.dob = scannedData['Birth Date']
    ? parseInt(scannedData['Birth Date'].substring(0, 4)) > 1300
      ? scannedData['Birth Date'].substring(4, 8) +
        scannedData['Birth Date'].substring(0, 4)
      : scannedData['Birth Date']
    : '';
  demmographics.idNumber = scannedData['Birth Date']
    ? scannedData['License Number']
    : '';
  demmographics.sex = scannedData['Gender']
    ? scannedData['Gender'] == 2
      ? 'F'
      : 'M'
    : '';
  demmographics.city = scannedData['City'] ? scannedData['City'] : '';
  demmographics.street = scannedData['Street'] ? scannedData['Street'] : '';
  demmographics.street2 = scannedData['Street 2']
    ? scannedData['Street 2']
    : '';
  demmographics.state = scannedData['State'] ? scannedData['State'] : '';
  demmographics.zip = scannedData['Zip'] ? scannedData['Zip'] : '';

  return demmographics;
};
const generateRecord = demoRecord => {
  let recordToForward = {
    firstName: demoRecord.firstName.toUpperCase(),
    lastName: demoRecord.lastName.toUpperCase(),
    phoneNumber: '',
    email: '',
    insurance_name: '',
    insurance_number: '',
    dob: demoRecord.dob,
    idNumber: demoRecord.idNumber,
    sex: demoRecord.sex,
    street: demoRecord.street,
    street2: '',
    city: demoRecord.city,
    state: demoRecord.state,
    zip: demoRecord.zip,
    isVaccinated: null,
    whiteGlove: null,
    testerDes: null,
    license: demoRecord.idNumber,
  };
  return recordToForward;
};

export default {
  parsePDF147,
  createRecordFromScan,
  generateRecord,
};
