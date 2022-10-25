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

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");


const {
  getSettingForApp,
  updateEmployeeData,
  updateTestRecord,
  getPreRegisterRecord,
  getPreRegisterRecordNew,
  getPreRegisterRecordNewOne,
  deletePreRegistration,
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
  getTestLogs,
  addTestLogs,
  addTestAppLogs,
  getAppTestLogs,
  getShowPreRegistration,
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
} = require("./cognitoActions");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Only perform tasks if the user is in a specific group
const allowedGroup = process.env.GROUP.split(",");

const checkGroup = function (req, res, next) {
  if (
    req.path === "/signUserOut" ||
    req.path === "/testList" ||
    req.path === "/testDetails" ||
    req.path === "/sendGeneralEmail" ||
    req.path === "/getPreRegisterRecord" ||
    req.path === "/getPreRegisterRecordNew" ||
    req.path === "/updateTestRecord" ||
    req.path === "/updateEmployeeData" ||
    req.path === "/adminTestList" ||
    req.path === "/getSettingForApp" ||
    req.path === "/getTestLogs" ||
    req.path === "/addTestLogs" ||
    req.path === "/addTestAppLogs" ||
    req.path === "/getAppTestLogs" ||
    req.path === "/updateUserPassword" ||
    req.path === "/graphqlEmployeeCheckIn" ||
    req.path === "/saveUserPersonalisation" ||
    req.path === "/getUserPersonalisation" ||
    req.path === "/deletePreRegistration" ||
    req.path === "/getTestFromPG" ||
    req.path === "/getSummary" ||
    req.path === "/getRecordById" ||
    req.path === "/updateTestStatus" ||
    req.path === "/deleteTests" ||
    req.path === "/getDeletedTestList" ||
    req.path === "/getPreRegisterRecordNewOne" ||
    req.path === "/restoreTests" ||
    req.path === "/getLabProvidedBarCode" ||
    req.path === "/downloadcsv"
  ) {
    return next();
  }

  if (typeof allowedGroup === "undefined" || allowedGroup === "NONE") {
    return next();
  }

  // Fail if group enforcement is being used
  if (req.apiGateway.event.requestContext.authorizer.claims["cognito:groups"]) {
    const groups = req.apiGateway.event.requestContext.authorizer.claims["cognito:groups"].split(",");
    if (
      !(
        allowedGroup &&
        (groups.indexOf(allowedGroup[0]) > -1 ||
          groups.indexOf(allowedGroup[1]) > -1 ||
          groups.indexOf(allowedGroup[2]) > -1)
      )
    ) {
      const err = new Error(
        `User does not have permissions to perform administrative Actions ${groups} ${allowedGroup}`
      );
      next(err);
    }
  } else {
    const err = new Error(`Cognito User does not have permissions to perform administrative tasks`);
    err.statusCode = 403;
    next(err);
  }
  next();
};

app.all("*", checkGroup);

app.post("/addUserToGroup", async (req, res, next) => {
  if (!req.body.username || !req.body.groupname) {
    const err = new Error("username and groupname are required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await addUserToGroup(req.body.username, req.body.groupname);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/removeUserFromGroup", async (req, res, next) => {
  if (!req.body.username || !req.body.groupname) {
    const err = new Error("username and groupname are required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await removeUserFromGroup(req.body.username, req.body.groupname);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/confirmUserSignUp", async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error("username is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await confirmUserSignUp(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/disableUser", async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error("username is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await disableUser(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/enableUser", async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error("username is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await enableUser(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/getUser", async (req, res, next) => {
  if (!req.query.username) {
    const err = new Error("username is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await getUser(req.query.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/listUsers", async (req, res, next) => {
  try {
    let response;
    const limit = req.query?.limit || 20;
    const token = req.query?.token || null;
    const filter = req.query?.filter || null;
    response = await listUsers(limit, token, filter);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/listGroups", async (req, res, next) => {
  try {
    let response;
    if (req.query.token) {
      response = await listGroups(req.query.limit || 25, req.query.token);
    } else if (req.query.limit) {
      response = await listGroups((Limit = req.query.limit));
    } else {
      response = await listGroups();
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/listGroupsForUser", async (req, res, next) => {
  if (!req.query.username) {
    const err = new Error("username is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    let response;
    if (req.query.token) {
      response = await listGroupsForUser(req.query.username, req.query.limit || 25, req.query.token);
    } else if (req.query.limit) {
      response = await listGroupsForUser(req.query.username, (Limit = req.query.limit));
    } else {
      response = await listGroupsForUser(req.query.username);
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.get("/listUsersInGroup", async (req, res, next) => {
  if (!req.query.groupname) {
    const err = new Error("groupname is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    let response;
    if (req.query.token) {
      response = await listUsersInGroup(req.query.groupname, req.query.limit || 25, req.query.token);
    } else if (req.query.limit) {
      response = await listUsersInGroup(req.query.groupname, (Limit = req.query.limit));
    } else {
      response = await listUsersInGroup(req.query.groupname);
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/signUserOut", async (req, res, next) => {
  /**
   * To prevent rogue actions of users with escalated privilege signing
   * other users out, we ensure it's the same user making the call
   * Note that this only impacts actions the user can do in User Pools
   * such as updating an attribute, not services consuming the JWT
   */
  if (
    req.body.username != req.apiGateway.event.requestContext.authorizer.claims.username &&
    req.body.username != /[^/]*$/.exec(req.apiGateway.event.requestContext.identity.userArn)[0]
  ) {
    const err = new Error("only the user can sign themselves out");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const response = await signUserOut(req.body.username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/updateUserInfo", async (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.firstName || !req.body.lastName) {
    const err = new Error("All field are required");
    err.statusCode = 400;
    return next(err);
  }

  const { username, email, firstName, lastName, note, clientID, connectedID } = req.body;

  try {
    const response = await updateUserInfo(username, email, firstName, lastName, note, clientID, connectedID);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/updateUserSecondRole", async (req, res, next) => {
  if (!req.body.username || !req.body.role || !req.body.connectedID) {
    const err = new Error("All field are required");
    err.statusCode = 400;
    return next(err);
  }

  const { username, role, connectedID } = req.body;

  try {
    const response = await updateUserSecondRole(username, role, connectedID);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/updateAssociatedInfo", async (req, res, next) => {
  if (!req.body.username || !req.body.note) {
    const err = new Error("All field are required");
    err.statusCode = 400;
    return next(err);
  }

  const { username, note } = req.body;

  try {
    const response = await updateAssociatedData(username, note);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/updateUserPassword", async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    const err = new Error("All field are required");
    err.statusCode = 400;
    return next(err);
  }

  const { username, password } = req.body;

  try {
    const response = await updateUserPassword(username, password);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/deleteUser", async (req, res, next) => {
  if (!req.body.username) {
    const err = new Error("User name required");
    err.statusCode = 400;
    return next(err);
  }

  const { username } = req.body;

  try {
    const response = await deleteUser(username);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/sendEmailAttachement", async (req, res, next) => {
  if (!req.body.data) {
    const err = new Error("User data required");
    err.statusCode = 400;
    return next(err);
  }

  const { data, isPortalCall } = req.body;
  if (isPortalCall) {
    try {
      for (const item of data) {
        const response = await sendEmailAttachement(item.email, item.fileName, item.fileDisclaimer);
      }
      res.status(200).json({ message: "Ok" });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(200).json({ message: "Ok" });
  }
});

app.post("/sendGeneralEmail", async (req, res, next) => {
  if (!req.body.data) {
    const err = new Error("Email data required");
    err.statusCode = 400;
    return next(err);
  }

  const { data } = req.body;
  try {
    for (const item of data) {
      const response = await sendPreRegistrationEmail(item.email, item.subject, item.msg);
    }
    res.status(200).json({ message: "Ok" });
  } catch (err) {
    next(err);
  }
});

app.post("/getAutoNumber", async (req, res, next) => {
  try {
    const response = await getTestAutoNumber();
    res.status(200).json({ counter: response });
  } catch (err) {
    next(err);
  }
});

app.post("/testList", async (req, res, next) => {
  if (!req.body.siteID) {
    const err = new Error("Site ID is required");
    err.statusCode = 400;
    return next(err);
  }
  const { siteID, testType, nextPage } = req.body;
  try {
    const response = await getTestList(siteID, testType, nextPage);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/adminTestList", async (req, res, next) => {
  if (!req.body.siteID || !req.body.siteKey || !req.body.siteIndex) {
    const err = new Error("ID is required");
    err.statusCode = 400;
    return next(err);
  }
  const { siteID, siteKey, siteIndex, nextPage } = req.body;
  try {
    const response = await getAdminTestList(siteKey, siteIndex, siteID, nextPage);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/testDetails", async (req, res, next) => {
  if (!req.body.id) {
    const err = new Error("ID is required");
    err.statusCode = 400;
    return next(err);
  }
  const { id } = req.body;
  try {
    const response = await getTest(id);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/getPreRegisterRecordNew", async (req, res, next) => {
  if (!req.body.phone_number) {
    const err = new Error("Phone Number is required");
    err.statusCode = 400;
    return next(err);
  }
  const { phone_number } = req.body;
  try {
    const response = await getPreRegisterRecordNew(phone_number);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/getPreRegisterRecord", async (req, res, next) => {
  if (!req.body.phone_number) {
    const err = new Error("Phone Number is required");
    err.statusCode = 400;
    return next(err);
  }
  const { phone_number } = req.body;
  try {
    const response = await getPreRegisterRecord(phone_number);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/updateTestRecord", async (req, res, next) => {
  if (!req.body.data) {
    const err = new Error("Data required");
    err.statusCode = 400;
    return next(err);
  }

  const { data } = req.body;
  let ok = "Message Ok";
  try {
    /* for (const item of data) {
      ok = await updateTestRecord(
        item.testId,
        item.status,
        item.result,
        item.resultDate,
        item.StampBy,
        item.timerStatus,
        item.testType
      );
    } */
    res.status(200).json({ message: ok });
  } catch (err) {
    next(err);
  }
});

app.post("/updateEmployeeData", async (req, res, next) => {
  if (!req.body.demo || !req.body.employeeID) {
    const err = new Error("Employee ID and Demographics is required");
    err.statusCode = 400;
    return next(err);
  }

  const { employeeID, demo } = req.body;
  try {
    // const result = await updateEmployeeData(employeeID, demo);
    res.status(200).json({ message: "ok" });
  } catch (err) {
    next(err);
  }
});

app.post("/getSettingForApp", async (req, res, next) => {
  try {
    const result = await getSettingForApp();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
app.post("/getTestLogs", async (req, res, next) => {
  if (!req.body.id) {
    const err = new Error("Test id is required");
    err.statusCode = 400;
    return next(err);
  }

  const { id } = req.body;
  try {
    const result = await getTestLogs(id);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/getAppTestLogs", async (req, res, next) => {
  if (!req.body.id) {
    const err = new Error("Test id is required");
    err.statusCode = 400;
    return next(err);
  }

  const { id } = req.body;
  try {
    const result = await getAppTestLogs(id);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/addTestLogs", async (req, res, next) => {
  if (!req.body.params) {
    const err = new Error("params is required");
    err.statusCode = 400;
    return next(err);
  }

  const { params } = req.body;
  try {
    const result = await addTestLogs(params);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/addTestAppLogs", async (req, res, next) => {
  if (!req.body.data) {
    const err = new Error("data is required");
    err.statusCode = 400;
    return next(err);
  }

  const { data } = req.body;
  try {
    const result = await addTestAppLogs(data);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/getShowPreRegistration", async (req, res, next) => {
  if (!req.body.id) {
    const err = new Error("id is required");
    err.statusCode = 400;
    return next(err);
  }

  const { id } = req.body;
  try {
    const result = await getShowPreRegistration(id);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/graphqlEmployeeCheckIn", async (req, res, next) => {
  if (!req.body.id || !req.body.checkIn || !req.body.version) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { id, checkIn, version } = req.body;
  try {
    const result = await graphqlEmployeeCheckIn(id, checkIn, version);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/saveUserPersonalisation", async (req, res, next) => {
  if (!req.body.userID || !req.body.personalisationData) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { userID, personalisationData } = req.body;
  try {
    const result = await saveUserPersonalisation({ userID, personalisationData });
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/getUserPersonalisation", async (req, res, next) => {
  if (!req.body.userID) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { userID } = req.body;
  try {
    const result = await getUserPersonalisation({ userID });
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/deletePreRegistration", async (req, res, next) => {
  if (!req.body.id) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { id } = req.body;
  try {
    const result = await deletePreRegistration(id);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/getTestFromPG", async (req, res, next) => {
  if (!req.body.params) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { params } = req.body;
  try {
    const result = await getTestFromPG(params);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/getSummary", async (req, res, next) => {
  if (!req.body.params) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { params } = req.body;
  try {
    const result = await getSummary(params);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/appVersion", async (req, res, next) => {
  if (!req.body.name) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { name } = req.body;
  try {
    const versionDetails = JSON.parse(process.env.MOBILE_APP_VER);
    res.status(200).json(versionDetails[name]);
  } catch (err) {
    next(err);
  }
});

app.post("/getRecordById", async (req, res, next) => {
  if (!req.body.name) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { name, id } = req.body;
  try {
    const result = await getRecordById(id, name);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/updateTestStatus", async (req, res, next) => {
  if (!req.body.ids || !req.body.status || !req.body.id || !req.body.name) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { ids, status, id, name } = req.body;
  try {
    const result = await updateTestStatus(ids, status, id, name);
    res.status(200).json({ errorIds: result });
  } catch (err) {
    next(err);
  }
});

app.post("/deleteTests", async (req, res, next) => {
  if (!req.body.ids) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { ids } = req.body;
  try {
    const result = await deleteTests(ids);
    res.status(200).json({ errorIds: result });
  } catch (err) {
    next(err);
  }
});

app.post("/getDeletedTestList", async (req, res, next) => {
  if (!req.body.id) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const result = await getDeletedTestList();
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

app.post("/getPreRegisterRecordNewOne", async (req, res, next) => {
  if (!req.body.phone_number) {
    const err = new Error("Phone Number is required");
    err.statusCode = 400;
    return next(err);
  }
  const { phone_number, siteID, auditType } = req.body;
  try {
    const response = await getPreRegisterRecordNewOne(phone_number,siteID, auditType);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/restoreTests", async (req, res, next) => {
  if (!req.body.ids) {
    const err = new Error("id is required");
    err.statusCode = 400;
    return next(err);
  }
  const { ids } = req.body;
  try {
    const response = await restoreTests(ids);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.post("/downloadcsv", async (req, res, next) => {
  if (!req.body.params) {
    const err = new Error("all field is required");
    err.statusCode = 400;
    return next(err);
  }

  const { params } = req.body;
  try {
    console.log('downloadcsv', params);
    const result = await getAllTestFromPG(params);
    
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});


app.post("/getLabProvidedBarCode", async (req, res, next) => {
  try {
    const response = await getLabProvidedBarCode('1');
    res.status(200).json({ barcode: response });
  } catch (err) {
    next(err);
  }
});

// Error middleware must be defined last
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).json({ message: err.message }).end();
});

app.listen(3000, () => {
  console.log("App started");
});

module.exports = app;
