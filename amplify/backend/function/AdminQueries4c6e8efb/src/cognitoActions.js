/* eslint-disable */
/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const { CognitoIdentityServiceProvider, SES, S3, DynamoDB } = require("aws-sdk");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const ses = new SES({ region: "eu-west-1" });
const s3 = new S3({
  region: "eu-west-1",
  apiVersion: "2006-03-01",
});
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const Pool = require("pg").Pool;
const { clientSummaryQuery, siteSummaryQuery, labSummaryQuery, positiveTestList } = require("./query.js");
const { updateTest, deleteTest } = require("./mutations.js");
const moment = require("moment");
const transporter = nodemailer.createTransport({
  SES: ses,
});
const userPoolId = process.env.USERPOOL;
const docClient = new DynamoDB.DocumentClient();
const papa = require("papaparse");

async function getTestAutoNumber() {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const updateParams = {
      TableName: process.env.TABLE_EMPLOYEE_TEST_COUNTER,
      Key: {
        id: process.env.COUNTER_KEY,
      },
      UpdateExpression: "ADD #S :s",
      ExpressionAttributeValues: {
        ":s": 1,
      },
      ExpressionAttributeNames: {
        "#S": "counter",
      },
      ReturnValues: "UPDATED_NEW",
    };
    const updateCounter = await docClient.update(updateParams).promise();
    console.log("Auto Number", updateCounter.Attributes.counter);
    return updateCounter.Attributes.counter;
  } catch (err) {
    throw err;
  }
  return 1;
}

async function getTestOldAutoNumber() {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_EMPLOYEE_TEST_COUNTER,
    };
    const data = await docClient.scan(params).promise();
    const id = data.Items[0].id;
    const counter = data.Items[0].counter + 1;
    console.log("Counter", data.Items[0]);
    const updateParams = {
      TableName: process.env.TABLE_EMPLOYEE_TEST_COUNTER,
      Key: {
        id: "a76603b6-38f4-493a-a68b-44111b138a98",
      },
      UpdateExpression: "set #S = :s",
      ExpressionAttributeValues: {
        ":s": counter,
      },
      ExpressionAttributeNames: {
        "#S": "counter",
      },
      ReturnValues: "UPDATED_NEW",
    };
    await docClient.update(updateParams).promise();
    return counter;
  } catch (err) {
    throw err;
  }
  return 1;
}

async function getSettingForApp() {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const clients = await docClient
      .scan({
        TableName: process.env.TABLE_CLIENT,
      })
      .promise();
    const sites = await docClient
      .scan({
        TableName: process.env.TABLE_SITE,
      })
      .promise();
    const labs = await docClient
      .scan({
        TableName: process.env.TABLE_LAB,
      })
      .promise();

    return {
      clients: clients.Items.filter((c) => !c._deleted),
      sites: sites.Items.filter((c) => !c._deleted),
      labs: labs.Items.filter((c) => !c._deleted),
    };
  } catch (err) {
    throw err;
  }
  return 1;
}

async function getTestList(siteID, testType, nextPage) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_TEST,
      IndexName: "siteID-sequenceNo-index",
      KeyConditionExpression: `siteID = :ref`,
      ExpressionAttributeValues: {
        ":ref": siteID,
      },
      ScanIndexForward: false,
      Limit: 1000,
    };
    if (nextPage) {
      Object.assign(params, { ExclusiveStartKey: nextPage });
    }
    const data = await docClient.query(params).promise();
    return data;
  } catch (err) {
    throw err;
  }
  return {};
}

async function getAdminTestList(siteKey, siteIndex, siteID, nextPage) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_TEST,
      IndexName: siteIndex,
      KeyConditionExpression: `${siteKey} = :ref`,
      ExpressionAttributeValues: {
        ":ref": siteID,
      },
      ScanIndexForward: false,
      Limit: 1000,
    };
    if (nextPage) {
      Object.assign(params, { ExclusiveStartKey: nextPage });
    }
    const data = await docClient.query(params).promise();
    return data;
  } catch (err) {
    throw err;
  }
  return [];
}

async function getTestLogs(id) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_TEST_LOG,
      IndexName: "sequenceNo-index",
      KeyConditionExpression: `sequenceNo = :ref`,
      ExpressionAttributeValues: {
        ":ref": id + "",
      },
      ScanIndexForward: false,
      Limit: 1000,
    };
    const data = await docClient.query(params).promise();
    return data.Items;
  } catch (err) {
    throw err;
  }
  return [];
}

async function getShowPreRegistration(id) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_PREREGISTRATIOn,
      IndexName: "showId-index",
      KeyConditionExpression: `showId = :ref`,
      ExpressionAttributeValues: {
        ":ref": id + "",
      },
      ScanIndexForward: false,
      Limit: 1000,
    };
    const data = await docClient.query(params).promise();
    return data;
  } catch (err) {
    throw err;
  }
  return [];
}

async function deletePreRegistration(ids) {
  try {
    const docClient = new DynamoDB({ apiVersion: "2012-08-10" });
    for (const record of ids) {
      const params = {
        TableName: process.env.TABLE_PREREGISTRATIOn,
        Key: {
          id: {
            S: record.id,
          },
          phone_number: {
            S: record.phone_number,
          },
        },
      };
      const data = await docClient.deleteItem(params).promise();
    }
    return "ok";
  } catch (err) {
    throw err;
  }
  return [];
}

async function getAppTestLogs(id) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_TEST_APP_LOG,
      IndexName: "sequenceNo-index",
      KeyConditionExpression: `sequenceNo = :ref`,
      ExpressionAttributeValues: {
        ":ref": id,
      },
      ScanIndexForward: false,
      Limit: 1000,
    };
    const data = await docClient.query(params).promise();
    return data.Items;
  } catch (err) {
    throw err;
  }
  return {};
}

const addTestLogs = async (params) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const { slug, userID, userName, ids } = params;

    if (!ids) return "fail";
    if (!slug) return "slug required";

    for (const obj of ids) {
      const logObj = {
        id: uuidv4(),
        testID: obj.id,
        sequenceNo: obj.sequenceNo + "",
        slug: slug,
        userID: userID,
        userName: userName,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      };
      if (slug === "LabChange" || slug === "ConfigChange") {
        Object.assign(logObj, { oldValue: obj.oldValue, newValue: obj.newValue });
      }
      const logParams = {
        TableName: process.env.TABLE_TEST_LOG,
        Item: logObj,
      };
      await docClient.put(logParams).promise();
    }
    return "ok";
  } catch (error) {
    console.log("Error", error);
  }
};

const addTestAppLogs = async (data) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);

    for (const obj of data) {
      Object.assign(obj, { id: uuidv4(), createdAt: date.toISOString(), updatedAt: date.toISOString() });
      const logParams = {
        TableName: process.env.TABLE_TEST_APP_LOG,
        Item: obj,
      };
      await docClient.put(logParams).promise();
    }
    return "ok";
  } catch (error) {
    console.log("Error", error);
  }
};

const saveUserPersonalisation = async (params) => {
  let data = [];
  try {
    const docClient = new DynamoDB.DocumentClient();
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);

    const paramsObj = {
      TableName: process.env.TABLE_PERSONALISATION,
      IndexName: "userID-index",
      KeyConditionExpression: "userID = :ref",
      ExpressionAttributeValues: {
        ":ref": params.userID,
      },
    };

    data = await docClient.query(paramsObj).promise();

    const isNewRecord = data.Items.length === 0;

    if (isNewRecord && params.personalisationData) {
      const obj = {
        id: uuidv4(),
        userID: params.userID,
        personalisation: params.personalisationData,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      };
      data = await docClient
        .put({
          TableName: process.env.TABLE_PERSONALISATION,
          Item: obj,
        })
        .promise();
      return "ok";
    }

    if (!isNewRecord) {
      const id = data.Items[0].id;
      if (params.personalisationData) {
        const obj = {
          TableName: process.env.TABLE_PERSONALISATION,
          Key: {
            id: id,
          },
          UpdateExpression: "set #S = :s",
          ExpressionAttributeValues: {
            ":s": params.personalisationData,
          },
          ExpressionAttributeNames: {
            "#S": "personalisation",
          },
          ReturnValues: "UPDATED_NEW",
        };
        data = await docClient.update(obj).promise();
      }
    }
    return "ok";
  } catch (error) {
    console.log("Error", error);
  }
};

const getUserPersonalisation = async (params) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const paramsObj = {
      TableName: process.env.TABLE_PERSONALISATION,
      IndexName: "userID-index",
      KeyConditionExpression: "userID = :ref",
      ExpressionAttributeValues: {
        ":ref": params.userID,
      },
    };

    const data = await docClient.query(paramsObj).promise();
    return data.Items;
  } catch (error) {
    console.log("Error", error);
  }
};

async function getTest(id) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_TEST,
      IndexName: "referenceID-index",
      KeyConditionExpression: "referenceID = :ref",
      ExpressionAttributeValues: {
        ":ref": id,
      },
    };
    const data = await docClient.query(params).promise();
    return data;
  } catch (err) {
    throw err;
  }
  return {};
}

const updateTestRecord = async (testId, status, result, resultDate, StampBy, timerStatus, testType) => {
  try {
    const docClient = new DynamoDB({ apiVersion: "2012-08-10" });
    if (testId && status && testType && testType === "PCR") {
      const params = {
        TableName: process.env.TABLE_TEST,
        Key: {
          id: {
            S: testId,
          },
        },
        UpdateExpression: "set #S = :s",
        ExpressionAttributeValues: {
          ":s": {
            S: status,
          },
        },
        ExpressionAttributeNames: {
          "#S": "status",
        },
        ReturnValues: "UPDATED_NEW",
      };
      const data = await docClient.updateItem(params).promise();
    } else if (testId && status && result && resultDate && StampBy && timerStatus) {
      const params = {
        TableName: process.env.TABLE_TEST,
        Key: {
          id: {
            S: testId,
          },
        },
        UpdateExpression: "set #S = :s, #R = :r, #RD = :rd, #SB = :sb, #TS = :ts",
        ExpressionAttributeValues: {
          ":s": {
            S: status,
          },
          ":r": {
            S: result,
          },
          ":rd": {
            S: resultDate,
          },
          ":sb": {
            S: StampBy,
          },
          ":ts": {
            S: timerStatus,
          },
        },
        ExpressionAttributeNames: {
          "#S": "status",
          "#R": "result",
          "#RD": "resultDate",
          "#SB": "StampBy",
          "#TS": "timerStatus",
        },
        ReturnValues: "UPDATED_NEW",
      };
      const data = await docClient.updateItem(params).promise();
    }

    console.log(`Successfully updated test record for ${testId}`);
    return data;
  } catch (e) {
    console.log("Error updating test record ", testId);
    console.log(e);
    return e.message;
  }
};

async function updateEmployeeData(employeeID, demo) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const awsdob = [];
    awsdob.push(demo.dob.substring(4));
    awsdob.push(demo.dob.substring(0, 2));
    awsdob.push(demo.dob.substring(2, 4));

    const empParams = {
      TableName: process.env.TABLE_EMPLOYEE,
      Key: {
        id: {
          S: employeeID,
        },
      },
      UpdateExpression:
        "set #FIRST = :first, #LAST = :last, #DOB = :dob, #ID_NUMBER = :idnumber, #STREET = :street , #CITY = :city , #STATE = :state , #ZIP = :zip, #EMAIL = :email, #VACCINATED = :isVaccinated, #INS_NAME = :ins_name, #INS_NO = :ins_no",
      ExpressionAttributeValues: {
        ":first": {
          S: demo.firstName,
        },
        ":last": {
          S: demo.lastName,
        },
        ":dob": {
          S: awsdob.join("-"),
        },
        ":idnumber": {
          S: demo.idNumber,
        },
        ":street": {
          S: demo.street,
        },
        ":city": {
          S: demo.city,
        },
        ":state": {
          S: demo.state,
        },
        ":zip": {
          S: demo.zip,
        },
        ":email": {
          S: demo.email,
        },
        ":isVaccinated": {
          BOOL: demo.isVaccinated,
        },
        ":ins_name": {
          S: demo.insurance_name,
        },
        ":ins_no": {
          S: demo.insurance_number,
        },
      },
      ExpressionAttributeNames: {
        "#FIRST": "first",
        "#LAST": "last",
        "#DOB": "dob",
        "#ID_NUMBER": "idnumber",
        "#STREET": "street",
        "#CITY": "city",
        "#STATE": "state",
        "#ZIP": "zip",
        "#EMAIL": "email",
        "#VACCINATED": "isVaccinated",
        "#INS_NAME": "ins_name",
        "#INS_NO": "ins_no",
      },
      ReturnValues: "UPDATED_NEW",
    };
    await docClient.updateItem(empParams).promise();

    // Update Test
    const params = {
      TableName: process.env.TABLE_TEST,
      IndexName: "byEmployee",
      KeyConditionExpression: `employeeID = :ref`,
      ExpressionAttributeValues: {
        ":ref": employeeID,
      },
      Limit: 1000,
    };
    const data = await docClient.query(params).promise();
    if (data.Count === 0) return "No Record Found";
    const items = data.Items;
    try {
      for (const item of items) {
        console.log(`Test ID to update Demo ${item.id} - ${item.sequenceNo}`);
        const iparams = {
          TableName: process.env.TABLE_TEST,
          Key: {
            id: {
              S: item.id,
            },
          },
          UpdateExpression: "set #D = :d",
          ExpressionAttributeValues: {
            ":d": {
              S: JSON.stringify(demo),
            },
          },
          ExpressionAttributeNames: {
            "#D": "employee_demographics",
          },
          ReturnValues: "UPDATED_NEW",
        };
        const updatedResponse = await docClient.update(iparams).promise();
        console.log("Update Data", updatedResponse);
      }
    } catch (err) {
      console.log(`Fail to Update Record ${err.message}`);
    }

    return "Record Updated";
  } catch (err) {
    throw err;
  }
}

const parseString = (val) => {
  if (!val) return "";
  return val.trim().toLowerCase();
};

const parseBooleanVal = (val) => {
  if (val) {
    if (typeof val === "string" && val === "false") return false;
    return true;
  }
  return false;
};

const getDataFromPreRegistration = async (phone_number) => {
  let preRegData = null;
  try {
    const params = {
      TableName: process.env.TABLE_PREREGISTRATIOn,
      ExpressionAttributeValues: {
        ":ref": phone_number,
      },
    };

    if (phone_number.includes("@")) {
      Object.assign(params, { IndexName: "email-index", KeyConditionExpression: "email = :ref" });
    } else {
      Object.assign(params, { IndexName: "phone_number-index", KeyConditionExpression: "phone_number = :ref" });
    }

    let data = await docClient.query(params).promise();

    if (data.Items.length > 0) {
      const sortedList = data.Items.sort((a, b) => {
        const testerB = b.updatedAt;
        const testerA = a.updatedAt;
        return testerB > testerA ? 1 : testerA > testerB ? -1 : 0;
      });
      let rec = sortedList[0];

      preRegData = {
        ...rec,
        phoneNumber: rec.phone_number,
        firstName: rec.first,
        lastName: rec.last,
        zip: rec.zipcode,
        isVaccinated: parseBooleanVal(rec.isVaccinated),
        idNumber: rec.id_number,
        fetchFrom: "preRegistration",
      };
    }
  } catch (err) {
    console.log("Error", err);
  }

  return preRegData;
};

async function getEmployeeData(phone_number) {
  const paramsemp = {
    TableName: process.env.TABLE_EMPLOYEE,
    ExpressionAttributeValues: {
      ":ref": phone_number,
    },
  };

  if (phone_number.includes("@")) {
    Object.assign(paramsemp, { IndexName: "email-index", KeyConditionExpression: "email = :ref" });
  } else {
    Object.assign(paramsemp, { IndexName: "phone_number-index", KeyConditionExpression: "phone_number = :ref" });
  }

  const data = await docClient.query(paramsemp).promise();

  return data;
}

async function getPreRegisterRecordNew(phone_number) {
  try {
    let allRecords = [];
    let preRegData = null;
    let data;

    if (phone_number.length < 15 || phone_number.includes("@")) {
      preRegData = await getDataFromPreRegistration(phone_number);
      console.log("Pre", preRegData);
      const paramsemp = {
        TableName: process.env.TABLE_EMPLOYEE,
        ExpressionAttributeValues: {
          ":ref": phone_number,
        },
      };

      if (phone_number.includes("@")) {
        Object.assign(paramsemp, { IndexName: "email-index", KeyConditionExpression: "email = :ref" });
      } else {
        Object.assign(paramsemp, { IndexName: "phone_number-index", KeyConditionExpression: "phone_number = :ref" });
      }

      data = await docClient.query(paramsemp).promise();
      if (data.Items.length > 0) {
        let empRecords = data.Items.filter((e) => !e._deleted).map((e) => {
          return { ...e, fetchFrom: "Employee" };
        });
        if (preRegData) {
          let filterPreReg = empRecords.filter(
            (e) =>
              parseString(e.first) === parseString(preRegData.first) &&
              parseString(e.last) === parseString(preRegData.last) &&
              parseString(e.dob) === parseString(preRegData.dob) &&
              parseString(e.id_number) === parseString(preRegData.id_number) &&
              parseString(e.email) === parseString(preRegData.email)
          );
          console.log("Filter Data", filterPreReg);
          if (filterPreReg.length === 0) {
            allRecords.push(preRegData);
          }
        }
        allRecords = allRecords.concat(empRecords);

        return { Count: allRecords.length, Items: allRecords, ScannedCount: 0 };
      }
      return { Count: allRecords.length, Items: preRegData ? [preRegData] : [], ScannedCount: 0 };
    }

    const params = {
      TableName: process.env.TABLE_HR_EMPLOYEE,
      Key: {
        id: phone_number,
      },
    };
    data = await docClient.get(params).promise();
    if (data.Item) {
      if (!data.Item.street) {
        const phoneNo = data.Item.phoneNumber.replace(data.Item.countryCode, "");
        preRegData = await getDataFromPreRegistration(phoneNo);
      }

      const obj = {
        ...data.Item,
        isHR: true,
        first: data.Item.firstName,
        last: data.Item.lastName,
        phone_number: data.Item.phoneNumber,
        id_number: data.Item.idNumber || moment().valueOf().toString(),
        idNumber: data.Item.idNumber || moment().valueOf().toString(),
        checkIn: data.Item.checkIn || null,
        fetchFrom: "preRegistration",
      };

      if (preRegData) {
        Object.assign(obj, {
          street: preRegData.street,
          street2: preRegData.street2,
          city: preRegData.city,
          state: preRegData.state,
          zip: preRegData.zipcode,
          isVaccinated: preRegData.isVaccinated,
          id_number: preRegData.id_number || moment().valueOf().toString(),
          idNumber: preRegData.id_number || moment().valueOf().toString(),
        });
      }

      return { Count: 1, Items: [obj], ScannedCount: 1 };
    }
    return { Count: 0, Items: [], ScannedCount: 0 };
  } catch (err) {
    console.log("Error", err);
  }

  return { Count: 0, Items: [], ScannedCount: 0 };
}

const getDataFromHR = async (phone_number, preRegData) => {
  console.log("on Function Call HR Data ", preRegData, phone_number);
  const params = {
    TableName: process.env.TABLE_HR_EMPLOYEE,
    IndexName: "phoneNumber-index",
    KeyConditionExpression: "phoneNumber = :ref",
    ExpressionAttributeValues: {
      ":ref": phone_number,
    },
  };
  const data = await docClient.query(params).promise();
  console.log("Data", data);

  if (data.Items.length === 0) return null;

  const item = data.Items[0];

  if(item.isSchedule !== 1) return null;

  const idNo = item.idNumber || moment().valueOf().toString();

  const obj = {
    ...item,
    isHR: true,
    first: item.firstName,
    last: item.lastName,
    phone_number: item.phoneNumber,
    id_number: idNo,
    idNumber: idNo,
    checkIn: item.checkIn || null,
    schrID: item.id,
    fetchFrom: "preRegistration",
    isVaccinated: parseBooleanVal(item.isVaccinated),
  };

  if (!preRegData) return obj;

  if (preRegData.dob === data.Items[0].dob) {
    Object.assign(obj, {
      street: item.street || preRegData.street,
      street2: item.street2 || preRegData.street2,
      city: item.city || preRegData.city,
      state: item.state || preRegData.state,
      zip: item.zip || preRegData.zipcode,
      id_number: item.idNumber || preRegData.idNumber,
      idNumber: item.idNumber || preRegData.idNumber,
    });
  }
  return obj;
};

const addAuditTrail = async (obj) => {
  try {
    const envoirment = process.env.ENV;
    const auditObj = { ...obj, id: uuidv4() };
    const params = {
      TableName: envoirment === "dev" ? process.env.TABLE_AUDIT_TRAIL : process.env.TABLE_AUDIT_TRAIL_DEVTEST,
      Item: auditObj,
    };
    await docClient.put(params).promise();
  } catch (err) {
    console.log("Audit Trail ", err);
  }
};

async function getPreRegisterRecordNewOne(phone_number, siteID, auditType) {
  try {
    let allRecords = [];
    let preRegData = null;
    let data;
    let fetchType = "Phone";

    console.log("getPreRegisterRecordNewOne Params", phone_number, siteID, auditType);

    if (phone_number.includes("@")) {
      fetchType = "Email";
    }

    if (phone_number.length < 15 || phone_number.includes("@")) {
      // fetch From Pre-Registration
      preRegData = await getDataFromPreRegistration(phone_number);
      console.log("Pre", preRegData);

      // fetch Employee from HR
      let hrData = null;
      if (!phone_number.includes("@")) {
        hrData = await getDataFromHR(`+1${phone_number}`, preRegData);
      }
      console.log("HR Data", hrData);

      // Fetch data from MD Employee
      data = await getEmployeeData(phone_number);
      console.log("Employee Data", data);

      // If Found some data in MD Employee
      if (data.Items.length > 0) {
        let empRecords = data.Items.filter((e) => !e._deleted).map((e) => {
          return { ...e, fetchFrom: "Employee" };
        });

        // if pre Registration data exists and mathc the first,last, dob,license and emiail
        // then ignore else add pre-registration in reponse object
        if (preRegData) {
          let filterPreReg = empRecords.filter(
            (e) =>
              parseString(e.first) === parseString(preRegData.first) &&
              parseString(e.last) === parseString(preRegData.last) &&
              parseString(e.dob) === parseString(preRegData.dob) &&
              parseString(e.id_number) === parseString(preRegData.id_number) &&
              parseString(e.email) === parseString(preRegData.email)
          );
          console.log("Filter Data", filterPreReg);
          if (filterPreReg.length === 0) {
            allRecords.push(preRegData);
          }
        }

        // if hr data exists and found the same data in MD Employee list just add the HR Schedule in MD Employee
        // else add HR data in response
        if (hrData) {
          let sameAsHREmployee = empRecords.filter(
            (e) => e.dob === hrData.dob && e.phone_number === hrData.phoneNumber
          );
          console.log("sameAsHREmployee", sameAsHREmployee);
          if (sameAsHREmployee.length > 0) {
            allRecords.push(
              sameAsHREmployee.map((e) => {
                return {
                  ...e,
                  testOne: hrData.testOne,
                  testTwo: hrData.testTwo,
                  onBoardingTesting: hrData.onBoardingTesting,
                  logDate: hrData.logDate,
                  dailyTask: hrData.dailyTask,
                  qaDone: hrData.qaDone,
                  testDone: hrData.testDone,
                  isHR: true,
                  schrID: hrData.id,
                };
              })
            );
          } else {
            allRecords.push(hrData);
          }
        }

        // push all employee data in response
        allRecords = allRecords.concat(empRecords);

        // add audit trail
        await addAuditTrail({
          auditType: auditType || "Scan",
          scanType: fetchType,
          phone_number,
          schrID: "A",
          siteID,
          data: allRecords,
        });

        return { Count: allRecords.length, Items: allRecords, ScannedCount: 0 };
      }
      if (hrData) {
        const idNumber = hrData.idNumber || moment().valueOf().toString();
        allRecords.push({ ...hrData, idNumber: idNumber, id_number: idNumber });
      }
      if (preRegData) {
        allRecords.push(preRegData);
      }
      return { Count: allRecords.length, Items: allRecords, ScannedCount: 0 };
    }

    const params = {
      TableName: process.env.TABLE_HR_EMPLOYEE,
      Key: {
        id: phone_number,
      },
    };
    data = await docClient.get(params).promise();
    const item = data.Item;
    console.log("HR Data", item);
    if (item) {
      let mdEmpData = null;
      let empData = await getEmployeeData(item.phoneNumber.replace("+1", ""));
      console.log("MD Data", empData);
      if (empData.Items.length > 0) {
        empData = empData.Items.filter((e) => !e._deleted).map((e) => {
          return { ...e, fetchFrom: "Employee" };
        });
        let filterPreReg = empData.filter(
          (e) => parseString(e.dob) === parseString(item.dob) && parseString(e.email) === parseString(item.email)
        );
        const ttlEmployees = filterPreReg.length;
        if (ttlEmployees > 0) {
          mdEmpData = filterPreReg[0];
        }
      }

      if (!preRegData) {
        const phoneNo = item.phoneNumber.replace(item.countryCode, "");
        preRegData = await getDataFromPreRegistration(phoneNo);
      }
      let idNo = item.idNumber;
      if (preRegData && !idNo) {
        idNo = preRegData.idNumber;
      }

      if (!idNo) {
        idNo = moment().valueOf().toString();
      }

      const obj = {
        ...item,
        isHR: true,
        schrID: item.id,
        first: item.firstName,
        last: item.lastName,
        phone_number: item.phoneNumber,
        id_number: idNo,
        idNumber: idNo,
        testTwo : item.isSchedule === 1 ? item.testTwo : [],
        checkIn: item.checkIn || null,
        fetchFrom: "preRegistration",
      };
      console.log("HR Same Employee on MD", mdEmpData);
      if (mdEmpData) {
        Object.assign(obj, {
          street: mdEmpData.street,
          street2: mdEmpData.street2,
          city: mdEmpData.city,
          state: mdEmpData.state,
          zip: mdEmpData.zip,
          insurance_name: mdEmpData.insurance_name,
          insurance_number: mdEmpData.insurance_number,
          isVaccinated: parseBooleanVal(mdEmpData.isVaccinated),
          id_number: mdEmpData.id_number || idNo,
          idNumber: mdEmpData.id_number || idNo,
          fetchFrom: "Employee",
          id: mdEmpData.id,
        });
      } else if (preRegData) {
        console.log("HR Data updating using Pre Registration", preRegData);
        Object.assign(obj, {
          street: preRegData.street,
          street2: preRegData.street2,
          city: preRegData.city,
          state: preRegData.state,
          zip: preRegData.zipcode,
          isVaccinated: preRegData.isVaccinated,
          id_number: preRegData.id_number || idNo,
          idNumber: preRegData.id_number || idNo,
          fetchFrom: "preRegistration",
        });
      }
      console.log("Final HR", obj);

      // add audit trail
      await addAuditTrail({
        auditType: "Scan",
        scanType: "HR",
        phone_number: obj.phone_number,
        schrID: phone_number,
        siteID,
        data: [obj],
      });

      return { Count: 1, Items: [obj], ScannedCount: 1 };
    }
    return { Count: 0, Items: [], ScannedCount: 0 };
  } catch (err) {
    console.log("Error", err);
  }

  return { Count: 0, Items: [], ScannedCount: 0 };
}

async function getPreRegisterRecord(phone_number) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    if (phone_number.length < 15 || phone_number.includes("@")) {
      const params = {
        TableName: process.env.TABLE_PREREGISTRATIOn,
        ExpressionAttributeValues: {
          ":ref": phone_number,
        },
      };

      if (phone_number.includes("@")) {
        Object.assign(params, { IndexName: "email-index", KeyConditionExpression: "email = :ref" });
      } else {
        Object.assign(params, { IndexName: "phone_number-index", KeyConditionExpression: "phone_number = :ref" });
      }

      let data = await docClient.query(params).promise();

      if (data.Items.length > 0) {
        const sortedList = data.Items.sort((a, b) => {
          const testerB = b.updatedAt;
          const testerA = a.updatedAt;
          return testerB > testerA ? 1 : testerA > testerB ? -1 : 0;
        });
        return { Count: 1, Items: [sortedList[0]], ScannedCount: 1 };
      }

      const paramsemp = {
        TableName: process.env.TABLE_EMPLOYEE,
        IndexName: "phone_number-index",
        KeyConditionExpression: "phone_number = :ref",
        ExpressionAttributeValues: {
          ":ref": phone_number,
        },
      };
      data = await docClient.query(paramsemp).promise();
      return data;
    }

    const params = {
      TableName: process.env.TABLE_HR_EMPLOYEE,
      Key: {
        id: phone_number,
      },
    };
    const data = await docClient.get(params).promise();
    if (data.Item) {
      const obj = {
        ...data.Item,
        isHR: true,
        first: data.Item.firstName,
        last: data.Item.lastName,
        phone_number: data.Item.phoneNumber,
        id_number: data.Item.idNumber,
        checkIn: data.Item.checkIn || null,
      };
      return { Count: 1, Items: [obj], ScannedCount: 1 };
    }
    return { Count: 0, Items: [], ScannedCount: 0 };
  } catch (err) {
    throw err;
  }
  return {};
}

const getRecordById = async (id, tableName) => {
  let name = "";
  switch (tableName) {
    case "employee":
      name = process.env.TABLE_EMPLOYEE;
      break;
    case "test":
      name = process.env.TABLE_TEST;
      break;
  }
  if (!name) {
    return { Item: {} };
  }
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: name,
      Key: {
        id: id,
      },
    };
    const data = await docClient.get(params).promise();
    console.log(`Successfully retrieved record for ${id}`);
    return data;
  } catch (e) {
    console.log("Error retrieving record");
    console.log(e);
  }
};

async function sendEmailAttachement(email, fileName, fileDisclaimer) {
  try {
    const fileParams = {
      Bucket: process.env.SE_BUCKET,
      Key: fileName,
    };
    const fileContent = await s3.getObject(fileParams).promise();
    const fileAttachments = [
      {
        filename: "result.pdf",
        content: fileContent.Body,
      },
    ];
    if (fileDisclaimer) {
      try {
        const disclaimerContent = await s3.getObject(fileParams).promise();
        fileAttachments.push({
          filename: "disclaimer.pdf",
          content: disclaimerContent.Body,
        });
      } catch (error) {}
    }

    const info = await transporter.sendMail({
      from: "SafeCamp Testing <info@gosafecamp.com>",
      to: email,
      subject: "SafeCamp Test Results",
      html: `<p>Hello,<br><br>Please see the attached results for your review. Thank you for testing with us.<br><br>Best Regards, <br>SafeCamp Team</p>`,
      attachments: fileAttachments,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  return {
    message: "Ok",
  };
}

async function sendPreRegistrationEmail(email, subject, msg) {
  try {
    const info = await transporter.sendMail({
      from: "SafeCamp Testing <info@gosafecamp.com>",
      to: email,
      subject: subject,
      html: msg,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  return {
    message: "Ok",
  };
}

async function addUserToGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to add ${username} to ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminAddUserToGroup(params).promise();
    console.log(`Success adding ${username} to ${groupname}`);
    return {
      message: `Success adding ${username} to ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function removeUserFromGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to remove ${username} from ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminRemoveUserFromGroup(params).promise();
    console.log(`Removed ${username} from ${groupname}`);
    return {
      message: `Removed ${username} from ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Confirms as an admin without using a confirmation code.
async function confirmUserSignUp(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminConfirmSignUp(params).promise();
    console.log(`Confirmed ${username} registration`);
    return {
      message: `Confirmed ${username} registration`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function disableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminDisableUser(params).promise();
    console.log(`Disabled ${username}`);
    return {
      message: `Disabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function enableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminEnableUser(params).promise();
    console.log(`Enabled ${username}`);
    return {
      message: `Enabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to retrieve information for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsers(Limit, PaginationToken, Filter) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
    ...(Filter && { Filter }),
  };

  console.log("Attempting to list users");

  try {
    const result = await cognitoIdentityServiceProvider.listUsers(params).promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroups(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  };

  console.log("Attempting to list groups");

  try {
    const result = await cognitoIdentityServiceProvider.listGroups(params).promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroupsForUser(username, Limit, NextToken) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list groups for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminListGroupsForUser(params).promise();
    /**
     * We are filtering out the results that seem to be innapropriate for client applications
     * to prevent any informaiton disclosure. Customers can modify if they have the need.
     */
    result.Groups.forEach((val) => {
      delete val.UserPoolId,
        delete val.LastModifiedDate,
        delete val.CreationDate,
        delete val.Precedence,
        delete val.RoleArn;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsersInGroup(groupname, Limit, NextToken) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list users in group ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider.listUsersInGroup(params).promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Signs out from all devices, as an administrator.
async function signUserOut(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to signout ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider.adminUserGlobalSignOut(params).promise();
    console.log(`Signed out ${username} from all devices`);
    return {
      message: `Signed out ${username} from all devices`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateUserInfo(username, email, firstName, lastName, note, clientID, connectedID) {
  const attrParams = [
    {
      Name: "email",
      Value: email,
    },
    {
      Name: "custom:firstName",
      Value: firstName,
    },
    {
      Name: "custom:lastName",
      Value: lastName,
    },
    {
      Name: "custom:note",
      Value: note,
    },
  ];
  if (clientID) {
    attrParams.push({ Name: "custom:clientID", Value: clientID });
  }
  if (connectedID) {
    attrParams.push({ Name: "custom:connectedID", Value: connectedID });
  }
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: attrParams,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
    return {
      message: `Success updating ${result}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateUserSecondRole(username, role, connectedID) {
  const attrParams = [
    { Name: "custom:adRole", Value: role },
    { Name: "custom:connectedID", Value: connectedID },
  ];

  const params = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: attrParams,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
    return {
      message: `Success updating`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateAssociatedData(username, note) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: [
      {
        Name: "custom:note",
        Value: note,
      },
    ],
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
    return {
      message: `Success updating ${result}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateUserPassword(username, password) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    Password: password,
    Permanent: true,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminSetUserPassword(params).promise();
    return {
      message: `Success updating ${result}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
    return {
      message: `Success updating ${result}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const hrCheckIn = gql`
  mutation UpdateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      id
      firstName
      lastName
      jobTitle
      picture
      dob
      schrID
      street
      street2
      city
      state
      countryCode
      country
      region
      location
      zip
      phoneNumber
      sex
      email
      isVaccinated
      subID
      idNumber
      department
      isNew
      programName
      groupType
      groupName
      logDate
      expireDate
      qaDone
      testDone
      checkIn
      callTime
      questionID
      questionGroup
      scheduleID
      isSchedule
      employeeType
      isScreeningDone
      vaccinationCardUpload
      vaccinationType
      vaccinationDate
      vaccinationLocation
      vaccinationDateS
      vaccinationLocationS
      isBooster
      boosterType
      boosterDate
      boosterLocation
      isExternalTest
      externalTestDate
      externalTestType
      externalTestResult
      companyID
      unionNo
      localNo
      isNotifyMainContact
      createdAt
      updatedAt
      _version
      _lastChangedAt
      _deleted
    }
  }
`;

const graphqlEmployeeCheckIn = async (id, checkIn, version) => {
  try {
    const graphqlData = await axios({
      url: process.env.HR_GRAPH_QL,
      method: "post",
      headers: {
        "x-api-key": process.env.HR_GRAPH_API_KEY,
      },
      data: {
        query: print(hrCheckIn),
        variables: {
          input: {
            id: id,
            checkIn: checkIn,
            _version: version,
          },
        },
      },
    });

    const body = {
      message: "CheckIn successfully",
    };
    return {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.log("error updating checkin: ", err);
    return err;
  }
};

const replaceString = (a) => {
  return a.replace(
    /(update|delete|insert|select|from|table|drop|create|alter|begin|grant|deny|exec|sp_|xp_|cursor|fetch)\s?/gi,
    ""
  );
};

const getTestCount = async () => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_EMPLOYEE_TEST_COUNTER,
      Key: {
        id: process.env.TOTAL_TEST_KEY,
      },
    };
    const data = await docClient.get(params).promise();
    return data.Item?.totalTest;
  } catch (err) {
    throw err;
  }
  return 0;
};

async function getTestFromPG(params) {
  console.log(`Attempting to retrieve information for ${JSON.stringify(params)}`);

  const psql = new Pool({
    host: "medflow-database-1.c8hmoz7pijxx.eu-west-1.rds.amazonaws.com",
    user: "medflow_admin",
    password: "FM*jRK$mm*QhK)J",
    database: "medflow_db",
    port: 5432,
  });
  const columns = `id, status,"clientID","labID","siteID", "baseSiteID",batch, barcode, result, "resultDate", "resultDateTime", 
  employee_demographics,site_name,"clientName","labName", "phoneNumber", tester_name, email,"referenceID",test_type,"createdBy"
  "emailSend", "startTimeStamp",sr_no, "sequenceNo", "createdAt", timezone, "schrTestID",
  "createdAt","isLucira","isFalsePositive","createSource","isAntigen","updatedAt","quarantinedStart","quarantinedEnd","submittedBy",
  "submittedByName","stampBy","stampByName"`;

  try {
    if (params.page && params.page === "all") {
      const results = await psql.query(`SELECT id,"firstName","lastName", site_name,
      "clientName","labName","result","phoneNumber","email","barcode","sequenceNo",
      "dob","quarantinedStart","quarantinedEnd","employee_demographics","createdAt" FROM "${process.env.PG_TEST}"`);
      return { rows: results.rows, total: results.rows.length };
    }

    if (params.waiting) {
      let cond = ` status in ('Pending','Sent','Processing') AND ("result" = '' OR "result" is NULL )`;
      if (params.waiting === "p") {
        cond = ` status = 'Pending' AND ("result" = '' OR "result" is NULL ) AND "test_type" = 'PCR' `;
      }
      let q = `Select ${columns} from "${process.env.PG_TEST}" where ${cond} order by "sequenceNo" desc`;
      console.log("Query", q);
      const results = await psql.query(q);
      return { rows: results.rows, total: results.rows.length };
    }

    const limit = params.limit || 100;
    const offset = params.page ? (params.page - 1) * limit : 0;
    let query = ` FROM "${process.env.PG_TEST}"`;
    let condition = [];
    if (params.firstName) condition.push(` "firstName" ILIKE '%${replaceString(params.firstName)}%'`);
    if (params.lastName) condition.push(` "lastName" ILIKE '%${replaceString(params.lastName)}%'`);
    if (params.Show) condition.push(` "site_name" ILIKE '%${replaceString(params.Show)}%'`);
    if (params.Client) condition.push(` "clientName" ILIKE '%${replaceString(params.Client)}%'`);
    if (params.Lab) condition.push(` "labName" ILIKE '%${replaceString(params.Lab)}%'`);
    if (params.result) {
      if (params.result === "empty") {
        condition.push(`( "result" = '' OR "result" is NULL )`);
      } else {
        condition.push(` "result" ILIKE '%${replaceString(params.result)}%'`);
      }
    }
    if (params.phoneNumber) condition.push(` "phoneNumber" ILIKE '%${replaceString(params.phoneNumber)}%'`);
    if (params.email) condition.push(` "email" ILIKE '%${replaceString(params.email)}%'`);
    if (params.sequenceNo)
      condition.push(` cast("sequenceNo" as varchar) LIKE '%${replaceString(params.sequenceNo)}%'`);
    if (params.barcode) condition.push(` "barcode" ILIKE '%${replaceString(params.barcode)}%'`);
    if (params.status) condition.push(` "status" ILIKE '%${replaceString(params.status)}%'`);

    if (params.tester_name) condition.push(` "tester_name" ILIKE '%${replaceString(params.tester_name)}%'`);

    if (params.dob) condition.push(` "dob" = '${replaceString(params.dob)}'`);
    if (params.employeeID) condition.push(` "employeeID" = '${replaceString(params.employeeID)}'`);
    if (params.siteID) condition.push(` "siteID" = '${replaceString(params.siteID)}'`);
    if (params.ShowID) condition.push(` "siteID" = '${replaceString(params.ShowID)}'`);
    if (params.labID) condition.push(` "labID" = '${replaceString(params.labID)}'`);
    if (params.startDate) condition.push(` "createdAt" >= '%${replaceString(params.startDate)}%'`);
    if (params.endDate) condition.push(` "createdAt" <= '%${replaceString(params.endDate)}%'`);

    if (params.test_type) {
      if (params.test_type.length === 1) condition.push(` "test_type" = '${replaceString(params.test_type[0])}'`);
      else if (params.test_type.length > 1)
        condition.push(` "test_type" IN (${params.test_type.map((a) => "'" + replaceString(a) + "'")})`);
    }

    if (condition.length > 0) query = query + " where ";
    if (condition.length === 1) query = query + condition;
    else if (condition.length > 1) query = query + condition.join("AND ");

    let totalRecord = 0;

    if (params.page && params.page > 1) {
      totalRecord = 0;
    } else {
      if (condition.length === 0) {
        totalRecord = await getTestCount();
      } else {
        const sumquery = query;
        const totalQuery = `Select id ${query} order by "sequenceNo"`;
        console.log("Query", totalQuery);
        const totalResults = await psql.query(totalQuery);
        totalRecord = totalResults.rows.length;
      }
    }

    query = `Select * ${query} order by "sequenceNo" desc NULLS LAST LIMIT ${limit} OFFSET ${offset}`;
    console.log("Query", query);
    const results = await psql.query(query);
    return { rows: results.rows, total: totalRecord };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getAllTestFromPG(params) {
  console.log(`Attempting to retrieve information for ${JSON.stringify(params)}`);

  const psql = new Pool({
    host: "medflow-database-1.c8hmoz7pijxx.eu-west-1.rds.amazonaws.com",
    user: "medflow_admin",
    password: "FM*jRK$mm*QhK)J",
    database: "medflow_db",
    port: 5432,
  });

  const columns = `id, status,"clientID","labID","siteID", "baseSiteID",batch, barcode, result, "resultDate", "resultDateTime", 
  employee_demographics,site_name,"clientName","labName", "phoneNumber", tester_name, email,"referenceID",test_type,"createdBy"
  "emailSend", "startTimeStamp",sr_no, "sequenceNo", "createdAt", timezone, "schrTestID",
  "createdAt","isLucira","isFalsePositive","createSource","isAntigen","updatedAt","quarantinedStart","quarantinedEnd","submittedBy",
  "submittedByName","stampBy","stampByName"`;

  try {
    if (params.waiting) {
      let cond = ` status in ('Pending','Sent','Processing') AND ("result" = '' OR "result" is NULL )`;
      if (params.waiting === "p") {
        cond = ` status = 'Pending' AND ("result" = '' OR "result" is NULL ) AND "test_type" = 'PCR' `;
      }
      let q = `Select * from "${process.env.PG_TEST}" where ${cond} order by "sequenceNo" desc`;
      console.log("Query", q);
      const results = await psql.query(q);
      return { rows: results.rows, total: results.rows.length };
    }

    let query = ` FROM "${process.env.PG_TEST}"`;
    let condition = [];
    if (params.firstName) condition.push(` "firstName" ILIKE '%${replaceString(params.firstName)}%'`);
    if (params.lastName) condition.push(` "lastName" ILIKE '%${replaceString(params.lastName)}%'`);
    if (params.Show) condition.push(` "site_name" ILIKE '%${replaceString(params.Show)}%'`);
    if (params.Client) condition.push(` "clientName" ILIKE '%${replaceString(params.Client)}%'`);
    if (params.Lab) condition.push(` "labName" ILIKE '%${replaceString(params.Lab)}%'`);
    if (params.result) {
      if (params.result === "empty") {
        condition.push(`( "result" = '' OR "result" is NULL )`);
      } else {
        condition.push(` "result" ILIKE '%${replaceString(params.result)}%'`);
      }
    }
    if (params.phoneNumber) condition.push(` "phoneNumber" ILIKE '%${replaceString(params.phoneNumber)}%'`);
    if (params.email) condition.push(` "email" ILIKE '%${replaceString(params.email)}%'`);
    if (params.sequenceNo)
      condition.push(` cast("sequenceNo" as varchar) LIKE '%${replaceString(params.sequenceNo)}%'`);
    if (params.barcode) condition.push(` "barcode" ILIKE '%${replaceString(params.barcode)}%'`);
    if (params.status) condition.push(` "status" ILIKE '%${replaceString(params.status)}%'`);

    if (params.tester_name) condition.push(` "tester_name" ILIKE '%${replaceString(params.tester_name)}%'`);

    if (params.dob) condition.push(` "dob" = '${replaceString(params.dob)}'`);
    if (params.employeeID) condition.push(` "employeeID" = '${replaceString(params.employeeID)}'`);
    if (params.siteID) condition.push(` "siteID" = '${replaceString(params.siteID)}'`);
    if (params.ShowID) condition.push(` "siteID" = '${replaceString(params.ShowID)}'`);
    if (params.labID) condition.push(` "labID" = '${replaceString(params.labID)}'`);
    if (params.startDate) condition.push(` "createdAt" >= '%${replaceString(params.startDate)}%'`);
    if (params.endDate) condition.push(` "createdAt" <= '%${replaceString(params.endDate)}%'`);

    if (params.test_type) {
      if (params.test_type.length === 1) condition.push(` "test_type" = '${replaceString(params.test_type[0])}'`);
      else if (params.test_type.length > 1)
        condition.push(` "test_type" IN (${params.test_type.map((a) => "'" + replaceString(a) + "'")})`);
    }

    if (condition.length > 0) query = query + " where ";
    if (condition.length === 1) query = query + condition;
    else if (condition.length > 1) query = query + condition.join("AND ");

    query = `Select ${columns} ${query} order by "sequenceNo"`;
    console.log("CSV Export Query", query);
    const results = await psql.query(query);
    console.log("Total Fetch Record", results.rows.length);

    const content = papa.unparse(results.rows);
    const batch = `${moment().format("DD_MM_YYYY_HH_mm_ss.SSS")}.csv`;
    const val = {
      Bucket: "employee-external-tests",
      Key: `public/excelfile/${batch}`,
      Body: content,
    };

    const obj = await s3.putObject(val).promise();

    return batch;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getSummary(params) {
  console.log(`Attempting to retrieve information for ${JSON.stringify(params)}`);

  const psql = new Pool({
    host: "medflow-database-1.c8hmoz7pijxx.eu-west-1.rds.amazonaws.com",
    user: "medflow_admin",
    password: "FM*jRK$mm*QhK)J",
    database: "medflow_db",
    port: 5432,
  });

  try {
    let query = "";
    if (params.siteID) {
      query = `SELECT result, count(result) FROM "${process.env.PG_TEST}" where "siteID"='${params.siteID}' and result != 'Positive' group by result`;
      const results = await psql.query(query);
      query = `SELECT result, status, "labID", "siteID", "clientID", "resultDate", "batch", "createdAt", "updatedAt", barcode, "sequenceNo" FROM "${process.env.PG_TEST}" where "siteID"='${params.siteID}' and result = 'Positive' order by "createdAt" desc`;
      const positiveRecord = await psql.query(query);
      return { rows: results.rows, positiveTest: positiveRecord.rows };
    }
    if (params.summary) {
      let query = "";
      switch (params.summary) {
        case "site":
          query = siteSummaryQuery;
          break;
        case "client":
          query = clientSummaryQuery;
          break;
        case "lab":
          query = labSummaryQuery;
          break;
        case "positiveTest":
          query = positiveTestList;
          break;
      }
      if (query) {
        const records = await psql.query(query);
        return { rows: records.rows };
      }
    }
    return { rows: [], total: 0 };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const updateTestGraphQLRecord = async (updateParams) => {
  try {
    const graphqlData = await axios({
      url: process.env.API_URL,
      method: "post",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
      data: {
        query: print(updateTest),
        variables: {
          input: updateParams,
        },
      },
    });
    console.log("Updating Test ", graphqlData.data);

    return true;
  } catch (err) {
    console.log("error updating test: ", err);
  }
  return false;
};

const updateTestStatus = async (ids, status, submittedBy, submittedByName) => {
  if (ids.length === 0) return;

  const ttl = ids.length;
  const errorIds = [];
  console.log("length ", ttl);
  for (let i = 0; i < ttl; i++) {
    try {
      const testRecord = await getRecordById(ids[i], "test");

      if (testRecord) {
        const test = testRecord.Item;
        const params = {
          id: test.id,
          status: status,
          submittedBy: submittedBy,
          submittedByName: submittedByName,
          _version: test._version,
        };
        console.log("Update Params", params);
        await updateTestGraphQLRecord(params);
      }
    } catch (err) {
      errorIds.push(ids[i]);
    }
  }
  return errorIds;
};

const deleteTests = async (ids) => {
  if (ids.length === 0) return;

  const ttl = ids.length;
  const errorIds = [];

  for (let i = 0; i < ttl; i++) {
    try {
      const testRecord = await getRecordById(ids[i], "test");
      console.log("Test to Delete", testRecord);
      if (testRecord) {
        const test = testRecord.Item;
        const params = {
          id: test.id,
          _version: test._version,
        };
        console.log("Delete Test Params", params);
        try {
          const graphqlData = await axios({
            url: process.env.API_URL,
            method: "post",
            headers: {
              "x-api-key": process.env.API_KEY,
            },
            data: {
              query: print(deleteTest),
              variables: {
                input: params,
              },
            },
          });
          console.log("Delete Test ", graphqlData.data);
        } catch (err) {
          console.log("error Delete test: ", err);
        }
      }
    } catch (err) {
      errorIds.push(ids[i]);
    }
  }
  return errorIds;
};

const getDeletedTestList = async (id) => {
  let nextToken = null;
  let data = [];
  try {
    do {
      const scanParams = {
        TableName: process.env.TABLE_TEST,
        FilterExpression: "attribute_exists(#deleted)",
        ExpressionAttributeNames: { "#deleted": "_deleted" },
      };
      if (nextToken) {
        Object.assign(scanParams, { ExclusiveStartKey: nextToken });
      }
      const result = await docClient.scan(scanParams).promise();

      data = data.concat(result.Items.filter((t) => t._deleted !== false));
      nextToken = result.LastEvaluatedKey;
    } while (nextToken);
    console.log("Delete Data", data.length);

    return data;
  } catch (e) {
    console.log("Error retrieving record");
    console.log(e);
  }
  return null;
};

const restoreTests = async (ids) => {
  const dClient = new DynamoDB({ apiVersion: "2012-08-10" });
  const ttl = ids.length;
  const errorIds = [];

  for (let i = 0; i < ttl; i++) {
    let id = ids[i];
    try {
      const params = {
        TableName: process.env.TABLE_TEST,
        Key: {
          id: {
            S: id,
          },
        },
        UpdateExpression: "set #S = :s",
        ExpressionAttributeValues: {
          ":s": {
            BOOL: false,
          },
        },
        ExpressionAttributeNames: {
          "#S": "_deleted",
        },
        ReturnValues: "UPDATED_NEW",
      };
      await dClient.updateItem(params).promise();
    } catch (e) {
      console.log("Error retrieving record");
      console.log(e);
      errorIds.push(id);
    }
  }

  return { errorIds: errorIds };
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function getLabProvidedBarCode(labID) {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const dClient = new DynamoDB({ apiVersion: "2012-08-10" });
    const params = {
      TableName: process.env.LAB_BAR_CODE,
      IndexName: "isActive-index",
      KeyConditionExpression: `isActive = :ref`,
      ExpressionAttributeValues: {
        ":ref": 1,
      },
      ScanIndexForward: false,
      Limit: 1000,
    };
    let barcode = null;
    const data = await docClient.query(params).promise();

    if (data.Items.length > 0) {
      let max = 10;

      if (data.Items.length < 10) max = data.Items.length;

      const record = data.Items[getRandomInt(max)];
      barcode = record.barcode;

      const updateParams = {
        TableName: process.env.LAB_BAR_CODE,
        Key: {
          id: {
            S: record.id,
          },
        },
        UpdateExpression: "set #S = :s",
        ExpressionAttributeValues: {
          ":s": {
            N: "0",
          },
        },
        ExpressionAttributeNames: {
          "#S": "isActive",
        },
        ReturnValues: "UPDATED_NEW",
      };
      await dClient.updateItem(updateParams).promise();
    }
    return barcode;
  } catch (err) {
    console.log("Error in Lab Bar code", err);
  }
  return null;
}

module.exports = {
  updateEmployeeData,
  updateTestRecord,
  getPreRegisterRecord,
  getPreRegisterRecordNew,
  getPreRegisterRecordNewOne,
  getTest,
  getTestList,
  getAdminTestList,
  getTestAutoNumber,
  addUserToGroup,
  removeUserFromGroup,
  confirmUserSignUp,
  disableUser,
  enableUser,
  getUser,
  listUsers,
  listGroups,
  listGroupsForUser,
  listUsersInGroup,
  signUserOut,
  updateUserInfo,
  updateUserSecondRole,
  updateAssociatedData,
  updateUserPassword,
  deleteUser,
  sendEmailAttachement,
  sendPreRegistrationEmail,
  getSettingForApp,
  getTestLogs,
  addTestLogs,
  addTestAppLogs,
  getAppTestLogs,
  getShowPreRegistration,
  deletePreRegistration,
  graphqlEmployeeCheckIn,
  saveUserPersonalisation,
  getUserPersonalisation,
  getTestFromPG,
  getSummary,
  getRecordById,
  updateTestStatus,
  deleteTests,
  getDeletedTestList,
  restoreTests,
  getAllTestFromPG,
  getLabProvidedBarCode,
};
