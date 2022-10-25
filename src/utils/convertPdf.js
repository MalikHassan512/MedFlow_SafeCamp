import RNHTMLtoPDF from 'react-native-html-to-pdf';
import DeviceInfo from 'react-native-device-info';

export const convertIntoPdfFile = async (
  testsLab,
  labLogoPath,
  demos,
  test,
  age,
) => {
  let options = {
    html: `<div style="padding: 10px 30px 10px 30px;">
            <img src="https://medflow-images.s3.eu-west-1.amazonaws.com/safecamp_MD.png" alt="bg immg" style="height: 20%; position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); z-index: 1; opacity: .4 " />
                        <div style="position:relative; z-index: 2;">
                        <span style="font-size: 32px; font-weight: bold; margin-bottom: 0px">${
                          testsLab.name
                        }</span>
                        <span style="position: absolute; right: 30; top: 30; font-weight: bold; color: red">FINAL</span>
                     ${labLogoPath &&
                       `<span style="position: absolute; right: 30; top: 56; font-weight: bold; color: red"> <img src=${labLogoPath} alt="bg immg" style="height: 50px; width:50px ; " /> </span>`}
                        <br/>
                        <span style="font-size: 18px; font-weight: 100;">${
                          testsLab.street
                        }</span><br/>
                        <span style="font-size: 18px; font-weight: 100;">${
                          testsLab.city_state_zip
                        }</span><br/>
                        <span style="font-size: 18px; font-weight: 100;">Phone: ${'(' +
                          testsLab.contact_phone.substring(0, 3) +
                          ')' +
                          testsLab.contact_phone.substring(3, 6) +
                          '-' +
                          testsLab.contact_phone.substring(6)}</span><br/>
                        <hr style="width: 100%"/>

                        <table style="width: 100%; text-align: left;">
                            <tr>
                                <th style="font-weight: 400; font-size: 14px;">Patient:</th>
                                <th style="font-weight: 400; font-size: 14px;">${demos.lastName.substring(
                                  0,
                                  1,
                                )}${demos.lastName
      .substring(1)
      .toLowerCase()}, ${demos.firstName.substring(
      0,
      1,
    )}${demos.firstName.substring(1).toLowerCase()}</th>
                                <th style="font-weight: 400; font-size: 14px;"></th>
                                <th style="font-weight: 400; font-size: 14px;"></th>
                                <th style="font-weight: 400; font-size: 14px;">Accession:</th>
                                <th style="font-weight: 400; font-size: 14px;">${
                                  test.barcode
                                }</th>
                            </tr>
                            <tr>
                                <td style="font-size: 14px;">Patient #:</td>
                                <td style="font-size: 14px;">NA</td>
                                <td style="font-size: 14px;">Birth:</td>
                                <td style="font-size: 14px;">${demos.dob.substring(
                                  0,
                                  2,
                                ) +
                                  '/' +
                                  demos.dob.substring(2, 4) +
                                  '/' +
                                  demos.dob.substring(4)}</td>
                                <td style="font-size: 14px;"></td>
                                <td style="font-size: 14px;"></td>
                            </tr>
                            <tr>
                                <td style="font-size: 14px;">Doctor:</td>
                                <td style="font-size: 14px;">${
                                  testsLab.lab_director
                                }</td>
                                <td style="font-size: 14px;">Age:</td>
                                <td style="font-size: 14px;">${age} years</td>
                                <td style="font-size: 14px;">Collection Date:</td>
                                <td style="font-size: 14px;">${test.createdAt.substring(
                                  5,
                                  7,
                                ) +
                                  '/' +
                                  test.createdAt.substring(8, 10) +
                                  '/' +
                                  test.createdAt.substring(0, 4)}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 14px;">Phone:</td>
                                <td style="font-size: 14px;">${'(' +
                                  test.phoneNumber.substring(0, 3) +
                                  ')' +
                                  test.phoneNumber.substring(3, 6) +
                                  '-' +
                                  test.phoneNumber.substring(6)}</td>
                                <td style="font-size: 14px;">Gender:</td>
                                <td style="font-size: 14px;">${
                                  demos.sex === 'F' ? 'Female' : 'Male'
                                }</td>
                                <td style="font-size: 14px;">Received Date:</td>
                                <td style="font-size: 14px;">${test.createdAt.substring(
                                  5,
                                  7,
                                ) +
                                  '/' +
                                  test.createdAt.substring(8, 10) +
                                  '/' +
                                  test.createdAt.substring(0, 4)}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <span style="font-size: 14px;">${demos.lastName.substring(
                                      0,
                                      1,
                                    )}${demos.lastName
      .substring(1)
      .toLowerCase()}, ${demos.firstName.substring(
      0,
      1,
    )}${demos.firstName.substring(1).toLowerCase()}</span><br/>
                                    <span style="font-size: 14px;">${
                                      demos.street2
                                        ? demos.street + ' ' + demos.street2
                                        : demos.street
                                    }</span><br/>
                                    <span style="font-size: 14px;">${demos.city +
                                      ', ' +
                                      demos.state +
                                      ' ' +
                                      demos.zip.substring(0, 5)}</span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                        <br/>
                        <table style="width: 100%; text-align: left; border: 1px solid black; border-collapse: collapse;">
                            <tr>
                                <th style="font-weight: bold; text-align: left; border: 1px solid black; border-collapse: collapse; font-size: 14px;">Test Name</th>
                                <th style="font-weight: bold; text-align: left; border: 1px solid black; border-collapse: collapse; font-size: 14px;">Result</th>
                                <th style="font-weight: bold; text-align: left; border: 1px solid black; border-collapse: collapse; font-size: 14px;">Units</th>
                                <th style="font-weight: bold; text-align: left; border: 1px solid black; border-collapse: collapse; font-size: 14px;">Flag</th>
                                <th style="font-weight: bold; text-align: left; border: 1px solid black; border-collapse: collapse; font-size: 14px;">Reference Range/Cutoff</th>
                            </tr>
                            <tr>
                                <td style="font-weight: bold; font-size: 14px;">2019-nCoV rRT-${
                                  test.test_type
                                }</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style="text-align: right; font-size: 12px;"><i>Run on ${test.createdAt.substring(
                                  5,
                                  7,
                                ) +
                                  '/' +
                                  test.createdAt.substring(8, 10) +
                                  '/' +
                                  test.createdAt.substring(0, 4)}</i></td>
                            </tr>
                            <tr>
                                <td style="font-size: 14px;">2019-nCoV</td>
                                <td style="font-size: 14px;">${
                                  test.result.toLowerCase() === 'positive'
                                    ? 'Detected'
                                    : 'Not Detected'
                                }</td>
                                <td></td>
                                <td></td>
                                <td style="font-size: 14px;">${
                                  test.result.toLowerCase() === 'positive'
                                    ? 'Detected'
                                    : 'Not Detected'
                                }</td>
                            </tr>
                        </table>
                        <div>
                            <p style="font-size: 14px;">Notes: </p>
                            <p style="padding: 0 5% 0 10%; font-size: 14px;">${
                              testsLab.testing_notes
                            }</p>
                        </div>
                        </div>
                              <div style="position: absolute; bottom: 30; left: 30; right: 30;">
                                                        <span style="font-weight: 600; display:table; margin:0 auto; font-size: 14px;">CLIA #${
                                                          testsLab.clia_number
                                                        }</span><br/>
                        <span style="font-weight: 600; display:table; margin-left: auto; margin-right: auto; margin-top: -15; font-size: 14px;">Laboratory Director: Dr. ${
                          testsLab.lab_director
                        }</span>
                        
                            <hr style="width: 100%"/>
                            <table style="width: 100%">
                                <tr>
                                    <th style="text-align: left; font-size: 12px; font-weight: 400;">Originally Reported On: ${test.createdAt.substring(
                                      5,
                                      7,
                                    ) +
                                      '/' +
                                      test.createdAt.substring(8, 10) +
                                      '/' +
                                      test.createdAt.substring(0, 4)}</th>
                                    <th></th>
                                    <th style="text-align: right; font-size: 12px; font-weight: 400;">Accession: ${
                                      test.barcode
                                    } Patient #: NA</th>
                                </tr>
                                <tr>
                                    <td style="text-align: left; font-size: 12px;">Printed: ${
                                      new Date().getMonth() < 9 ? '0' : ''
                                    }${new Date().getMonth() + 1}/${
      new Date().getDate() < 10 ? '0' : ''
    }${new Date().getDate() + '/' + new Date().getFullYear()}</td>
                                    <td></td>
                                    <td style="text-align: right; font-size: 12px;">Lab Results for: ${demos.lastName.substring(
                                      0,
                                      1,
                                    )}${demos.lastName
      .substring(1)
      .toLowerCase()}, ${demos.firstName.substring(
      0,
      1,
    )}${demos.firstName.substring(1).toLowerCase()}</td>
                                </tr>
                                <tr>
                                    <td style="text-align: left; font-size: 12px;">(UTC-08:00) Pacific Time (US & Canada) </td>
                                    <td style="font-size: 12px;">STAT[S] Corrected [C] Amended [A]</td>
                                    <td style="text-align: right; font-size: 12px;">Page: 1/1</td>
                                </tr>
                            </table>
                        </div>
                        
                    </div>
                    `,
    fileName: 'test',
  };
  console.log('option - > ', options);
  let apiLevel = await DeviceInfo.getApiLevel();
  if (Platform.OS == 'android' && apiLevel && apiLevel > 29) {
  } else {
    options['directory'] = 'Documents';
  }
  console.log('apiLevel - > ', apiLevel);
  let file = await RNHTMLtoPDF.convert(options);
  return file;
};

export const getAge = demos => {
  let monthIndex =
    demos.dob.substring(0, 1) === '0'
      ? parseInt(demos.dob.substring(1, 2)) - 1
      : parseInt(demos.dob.substring(0, 2)) - 1;
  let today = new Date();
  let birthDate = new Date(
    demos.dob.substring(4),
    monthIndex,
    demos.dob.substring(2, 4),
  );
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age = age - 1;
  }
  return age;
};
