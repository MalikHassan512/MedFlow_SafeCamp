import {jsonToCSV} from "react-native-csv";

export const formatTests = (labName, tests) => {
    // console.log('lab name is: ', labName)
    // console.log('test count is: ', tests.length)
    let batch;
    switch (labName) {
        case 'Lenco':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'EST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatLencoCSV(tests), 'lenco-tests', batch];
        case 'Alliance':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'EST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatAllianceCSV(tests), 'alliance-tests', batch];
        case 'Biolab':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'PST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatBiolabCSV(tests), 'biolabs-tests', batch];
        case 'Sunrise':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'PST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatSunriseCSV(tests), 'sunrise-tests', batch];
        case 'LifeBrite':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'EST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatLifebriteCSV(tests), 'lifebrite-tests', batch];
        case 'New Discovery':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'EST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatNewDiscoveryCSV(tests), 'new-discovery-tests', batch];
        case 'DLS':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'HST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatDLSCSV(tests), 'dls-tests', batch];
        case 'Oxygen':
            batch = new Date(tests[0].createdAt)
                .toString()
                .toLocaleString('en-US', { timeZone: 'EST' })
                .substring(0, 21)
                .replace(/(:|\s+)/g, '_');
            return [formatOxygenCSV(tests), 'oxygen-tests', batch];
        default:
            return [
                jsonToCSV(tests),
                'no-lab-found-tests',
                new Date(tests[0].createdAt)
                    .toString()
                    .substring(0, 21)
                    .replace(/(:|\s+)/g, '_'),
            ];
    }
};
export const formateLabLogs = (tests) => {
    let batch = new Date(tests[0].createdAt)
      .toString()
      .toLocaleString('en-US', { timeZone: 'EST' })
      .substring(0, 21)
      .replace(/(:|\s+)/g, '_');
    batch = batch + '_' + tests[0].labName
    let testLogsJSon = jsonToCSV(tests);
    return [testLogsJSon, 'sendtolablogs', batch];
  }

const formatLencoCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);

        return {
            Provider_ID: 33133,
            patientFirst: demographics.firstName,
            patientLast: demographics.lastName,
            patientDOB: `${demographics.dob.substring(
                0,
                2,
            )}-${demographics.dob.substring(2, 4)}-${demographics.dob.substring(4)}`,
            patientGender: demographics.sex === 'M' ? 'male' : 'female',
            address1: demographics.street,
            addressCity: demographics.city,
            addressState: demographics.state,
            addressZip: demographics.zip ? demographics.zip.substring(0, 5) : '',
            emailAddress: '',
            patientPhone: test.phoneNumber,
            Accession: test.barcode,
            collection_date: `${test.createdAt.substring(
                5,
                7,
            )}-${test.createdAt.substring(8, 10)}-${test.createdAt.substring(0, 4)}`,
        };
    });
    return jsonToCSV(formattedTests);
};

const formatAllianceCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);
        return {
            client_id: 3211,
            barcode: test.barcode,
            date_created: `${test.createdAt.substring(
                5,
                7,
            )}/${test.createdAt.substring(8, 10)}/${test.createdAt.substring(0, 4)}`,
            first_name: demographics.firstName,
            last_name: demographics.lastName,
            dob: `${demographics.dob.substring(0, 2)}/${demographics.dob.substring(
                2,
                4,
            )}/${demographics.dob.substring(4)}`,
            sex: demographics.sex,
            address_street: demographics.street,
            address_city: demographics.city,
            address_state: demographics.state,
            address_zip: demographics.zip,
            emailAddress: '',
            patientPhone: test.phoneNumber,
            reference_id: test.referenceID,
        };
    });
    return jsonToCSV(formattedTests);
};

const formatBiolabCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);
        return {
            client_id: 3739,
            barcode: test.barcode,
            date_created: test.createdAt.toString(),
            first_name: demographics.firstName,
            last_name: demographics.lastName,
            dob: `${demographics.dob.substring(0, 2)}/${demographics.dob.substring(
                2,
                4,
            )}/${demographics.dob.substring(4)}`,
            sex: demographics.sex,
            address_street: demographics.street,
            address_city: demographics.city,
            address_state: demographics.state,
            address_zip: demographics.zip,
            emailAddress: '',
            patientPhone: test.phoneNumber,
            reference_id: test.referenceID,
        };
    });
    return jsonToCSV(formattedTests);
};

const formatSunriseCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);
        return {
            client_id: 36,
            barcode: test.barcode,
            date_created: toISOLocal(new Date(test.createdAt)),
            first_name: demographics.firstName,
            last_name: demographics.lastName,
            dob: `${demographics.dob.substring(0, 2)}/${demographics.dob.substring(
                2,
                4,
            )}/${demographics.dob.substring(4)}`,
            sex: demographics.sex,
            address_street: demographics.street,
            address_city: demographics.city,
            address_state: demographics.state,
            address_zip: demographics.zip,
            emailAddress: '',
            patientPhone: test.phoneNumber,
            reference_id: test.referenceID,
        };
    });
    return jsonToCSV(formattedTests);
};

const formatLifebriteCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);
        return {
            barcode: test.barcode,
            date_created: toISOLocal(new Date(test.createdAt)).split('T')[0],
            first_name: demographics.firstName,
            last_name: demographics.lastName,
            dob: `${demographics.dob.substring(0, 2)}/${demographics.dob.substring(
                2,
                4,
            )}/${demographics.dob.substring(4)}`,
            sex: demographics.sex,
            address_street: demographics.street,
            address_city: demographics.city,
            address_state: demographics.state,
            address_zip: demographics.zip,
            emailAddress: '',
            patientPhone: test.phoneNumber,
            reference_id: test.referenceID,
            insurance_name: demographics.insurance_name,
            insurance_number: demographics.insurance_number,
            test_code: 1,
        };
    });
    return jsonToCSV(formattedTests);
};

const formatNewDiscoveryCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);
        return {
            barcode: test.barcode,
            date_created: test.createdAt,
            first_name: demographics.firstName,
            last_name: demographics.lastName,
            dob: `${demographics.dob.substring(0, 2)}/${demographics.dob.substring(
                2,
                4,
            )}/${demographics.dob.substring(4)}`,
            sex: demographics.sex,
            address_street: demographics.street,
            address_city: demographics.city,
            address_state: demographics.state,
            address_zip: demographics.zip,
            emailAddress: '',
            patientPhone: test.phoneNumber,
            reference_id: test.referenceID,
        };
    });
    return jsonToCSV(formattedTests);
};

const formatOxygenCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);
        return {
            accession_number: test.barcode,
            requisition_number: test.referenceID,
            date: new Date(test.createdAt).toString().substring(0, 15),
            time: new Date(test.createdAt).toString().substring(16),
            clinic_id: '52a3c04d-2b81-43c0-8c9d-5a5ae8f067fc',
            first_name: demographics.firstName,
            last_name: demographics.lastName,
            patient_dob: `${demographics.dob.substring(0, 2)}-${demographics.dob.substring(
                2,
                4,
            )}-${demographics.dob.substring(4)}`,
            patient_gender: demographics.sex,
            patient_phone: test.phoneNumber,
            patient_email: '',
            patient_ethnicity_code: 'U',
            patient_race_code: 'U',
            provider_first_name: '',
            provider_last_name: '',
            provider_npi: '1111111111',
            provider_phone_number: '',
            specimen_type: 'OS',
            panel_type: 'COV  (COVID-19 (2019 Coronavirus (SARS-CoV-2)))',
        };
    });
    return jsonToCSV(formattedTests);
};

const formatDLSCSV = (tests) => {
    const formattedTests = tests.map((test) => {
        const demographics = typeof test.employee_demographics === 'object' ? test.employee_demographics : JSON.parse(test.employee_demographics);
        return {
            PatientFirstName: demographics.firstName,
            PatientLastName: demographics.lastName,
            PatientMiddleName: '',
            PatientDOB: `${demographics.dob.substring(0, 2)}/${demographics.dob.substring(2, 4)}/${demographics.dob.substring(4)}`,
            PatientGender: demographics.sex,
            Address1: demographics.street,
            Address2: '',
            AddressCity: demographics.city,
            AddressState: demographics.state,
            AddressZip: demographics.zip,
            EmailAddress: '',
            PatientPhone: test.phoneNumber,
            UniqueID: test.id,
            AccessionOrderID: test.barcode,
            TestkitID: '',
            Covid19TestCode: '',
            SpecimenSource: 'OP',
            CollectionDateTime: '',
            OrderingPhysician: '',
            Race: 'UNK: Unknown',
            Ethnicity: 'UNK: Unknown',
            FirstCovidTest: '',
            HealthCareWorker: '',
            CovidSymptomatic: '',
            SymptomOnsetDate: '',
            CovidHospitalized: '',
            InICU: '',
            CongregateCareSetting: '',
            Pregnant: ''
        };
    });
    return jsonToCSV(formattedTests);
};

const toISOLocal = (d) => {
    let z = (n) => ('0' + n).slice(-2);
    let zz = (n) => ('00' + n).slice(-3);
    let off = d.getTimezoneOffset();
    let sign = off > 0 ? '-' : '+';
    off = Math.abs(off);

    return (
        d.getFullYear() +
        '-' +
        z(d.getMonth() + 1) +
        '-' +
        z(d.getDate()) +
        'T' +
        z(d.getHours()) +
        ':' +
        z(d.getMinutes()) +
        ':' +
        z(d.getSeconds()) +
        '.' +
        zz(d.getMilliseconds()) +
        sign +
        z((off / 60) | 0) +
        ':' +
        z(off % 60)
    );
};
