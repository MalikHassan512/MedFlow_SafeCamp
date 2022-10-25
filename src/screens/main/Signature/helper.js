import {base64PdfForm} from '../../../assets/consentForm';
import moment from 'moment';
import {Platform} from 'react-native';
import {DataStore, Storage, StorageProvider} from 'aws-amplify';
import {PDFDocument, rgb} from 'pdf-lib';
import {decode as atob, encode as btoa} from 'base-64';

const RNFS = require('react-native-fs');

export const _uint8ToBase64 = u8Arr => {
  const CHUNK_SIZE = 0x8000; //arbitrary number
  let index = 0;
  const length = u8Arr.length;
  let result = '';
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
};

export const saveSignatue = async (baseUrl, siteId, employeeID, onResponse) => {
  const splitBase64 = baseUrl.split('data:image/png;base64,');
  const concatEmployeeID = `${RNFS.CachesDirectoryPath}${siteId}&&${employeeID}.png`;
  const storageImage = `${siteId}&&${employeeID}&&sig.png`;
  RNFS.writeFile(concatEmployeeID, splitBase64[1], 'base64')
    .then(async success => {
      const imageResponse = await fetch(
        Platform.OS == 'android'
          ? `file://${concatEmployeeID}`
          : concatEmployeeID,
      );
      const signatureBlob = await imageResponse.blob();
      await Storage.put(storageImage, signatureBlob, {
        contentType: 'image/jpeg',
      });
      onResponse(true);
    })
    .catch(error => {
      console.log('🚀 helper.js ~line 43 ~saveSignatue', error);
      console.log('🚀 helper.js ~line 43 ~saveSignatue', JSON.stringify(error));
      onResponse(false);
    });
};

export const addSignToPdf = async (sign, onResponse) => {
  // setSignBase64(sign.replace('data:image/png;base64,', ''));

  let signBase64 = sign.replace('data:image/png;base64,', '');

  // setFilePath(null);

  const pdfDoc = await PDFDocument.load(base64PdfForm);

  const pages = pdfDoc.getPages();

  const page_1 = pages[0];
  const page_4 = pages[3];
  const page_5 = pages[4];
  const page_6 = pages[5];
  const page_7 = pages[6];

  // The meat
  const signatureImage = await pdfDoc.embedPng(signBase64);
  // console.log('is iphone x: ', isIphoneXorAbove())
  // let name = `${demographics.firstName} ${demographics.lastName}`;
  let name = `test user`;

  let currentDate = moment(new Date()).format('DD MMM YYYY');

  //=========== All data added in pdf ============//

  page_1.drawText(name, {
    x: page_1.getWidth() * 0.28,
    y: page_1.getHeight() * 0.53,
    size: 14,
  });
  page_1.drawText(currentDate, {
    x: page_1.getWidth() * 0.675,
    y: page_1.getHeight() * 0.53,
    size: 14,
  });
  page_4.drawText(name, {
    x: page_4.getWidth() * 0.15,
    y: page_4.getHeight() * 0.25,
    size: 14,
  });
  page_4.drawText(currentDate, {
    x: page_4.getWidth() * 0.54,
    y: page_4.getHeight() * 0.185,
    size: 14,
  });
  page_4.drawImage(signatureImage, {
    x: page_4.getWidth() * 0.18,
    y: page_4.getHeight() * 0.11,
    width: 100,
    height: 100,
  });

  page_5.drawText(name, {
    x: page_5.getWidth() * 0.16,
    y: page_5.getHeight() * 0.49,
    size: 14,
  });
  page_5.drawText(currentDate, {
    x: page_5.getWidth() * 0.59,
    y: page_5.getHeight() * 0.405,
    size: 12,
  });
  page_5.drawImage(signatureImage, {
    x: page_5.getWidth() * 0.25,
    y: page_5.getHeight() * 0.356,
    width: 70,
    height: 70,
  });

  page_6.drawText(currentDate, {
    x: page_6.getWidth() * 0.75,
    y: page_6.getHeight() * 0.15,
    size: 14,
  });
  page_6.drawImage(signatureImage, {
    x: page_6.getWidth() * 0.3,
    y: page_6.getHeight() * 0.08,
    width: 100,
    height: 100,
  });
  page_7.drawImage(signatureImage, {
    x: page_7.getWidth() * 0.28,
    y: page_7.getHeight() * 0.62,
    width: 100,
    height: 100,
  });
  page_7.drawText(moment(new Date()).format('DD MMM YYYY'), {
    x: page_6.getWidth() * 0.73,
    y: page_6.getHeight() * 0.7,
    size: 14,
  });
  page_7.drawText('Employee Name', {
    x: page_5.getWidth() * 0.13,
    y: page_5.getHeight() * 0.755,
    size: 14,
  });

  //=========== Adding data in pdf done ============//

  // Play with these values as every project has different requirements

  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = _uint8ToBase64(pdfBytes);
  const path = `${
    RNFS.DocumentDirectoryPath
  }/consent-form_signed_${Date.now()}.pdf`;
  console.log('path', path);

  RNFS.writeFile(path, pdfBase64, 'base64')
    .then(async success => {
      console.log('showPath --- > ', path);
      const pdfResponse = await fetch(
        Platform.OS == 'android' ? `file://${path}` : path,
      );
      const pdfBlob = await pdfResponse.blob();
      const storagePdfName = `location.siteID-employeeID-pattern.pdf`;
      // const storagePdfName = `${location.siteID}-${employeeID}-pattern.pdf`;

      // await Storage.put(storagePdfName, pdfBlob, {
      //     contentType: 'application/pdf',
      // });
      // setProcessing(false);
      // const pdfLink = await Storage.get(storagePdfName)
      // console.log("getPdfLink - > " , pdfLink)
      // saveAndContinue(sign);
      onResponse(path);
    })
    .catch(err => {
      // setProcessing(false);
      console.log('we got error here', err.message);
    });
};
