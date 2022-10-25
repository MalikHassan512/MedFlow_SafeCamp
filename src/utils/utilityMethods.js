import moment from 'moment';
import { Strings } from '../constants';
import { DATE_FORMATES } from '../constants/Strings';
class UtilityMethods {
  isEmailValid = email => {
    // let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,20}$/;
    return reg.test(email);
  };

  textContainsAnAlphabetCharacter = text => {
    let reg = /.*[a-zA-Z].*/;
    return reg.test(text);
  };

  textContainsAnInteger = text => {
    let reg = /^(?=.*[0-9])/;
    return reg.test(text);
  };

  textContainsSpecialCharacter = text => {
    let reg = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return reg.test(text);
  };
  isPasswordValid = text => {
    let reg = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!()@#?/$%^&*])(?=.{8,})',
    );
    return reg.test(text);
  };
  returnLettersOnly = input => {
    if (input.match(/^[a-zA-Z]+$/g) !== null) {
      return input;
    } else {
      return '';
    }
  };
  formatDOB = dob => {
    // console.log('date of birth is: ', dob)
    let formattedDOB = dob;
    if (dob.includes('-')) {
      formattedDOB = moment(dob).format('MM-DD-YYYY');
    } else if (dob.length > 2 && dob.length <= 4) {
      formattedDOB = dob.slice(0, 2) + '-' + dob.slice(2, 4);
    } else if (dob.length >= 5) {
      formattedDOB =
        dob.slice(0, 2) + '-' + dob.slice(2, 4) + '-' + dob.slice(4);
    }
    // console.log('formatted date of birth is: ', formattedDOB)
    return formattedDOB;
  };
  getDemographicsDOB = dob => {
    // console.log('date of birth is: ', dob)
    try {
      let formattedDOB = dob;

      formattedDOB = moment(dob).format('MMDDYYYY');
      console.log('formatted date of birth is: ', formattedDOB);
      return formattedDOB ? formattedDOB : dob;
    } catch (error) {
      return dob;
    }
  };

  formatSnnOrIdNumber = (isEighteenPlus, license) => {
    if (isEighteenPlus) {
      return license;
    }
    let formattedIdNum = license;

    if (license.length > 3 && license.length <= 5) {
      formattedIdNum = license.slice(0, 3) + '-' + license.slice(3, 5);
    } else if (license.length >= 6) {
      formattedIdNum =
        license.slice(0, 3) +
        '-' +
        license.slice(3, 5) +
        '-' +
        license.slice(5);
    }
    return formattedIdNum;
  };
  formatZIP = zip => {
    let formattedZIP = zip;
    if (zip.length > 5) {
      if (zip.includes('-')) {
        formattedZIP = zip
      } else {
        formattedZIP = zip.slice(0, 5) + '-' + zip.slice(5);
      }

    }
    return formattedZIP;
  };
  formatDate = date => {
    return moment(date).format('MM/DD/YYYY');
  };
  hasTodaySchedule = emp => {
    if (emp.isHR && emp.logDate) {
      let todayDate = moment().format("YYYY-MM-DD");
      if (emp.logDate.length > 9) {
        logDate = emp.logDate.substring(0, 10)
        if (logDate === todayDate) {
          return true
        }
      }
    }
    return false
  }
  getFormattedDate = dob => {
    try {
      console.log('====================')
      console.log('dob is :', dob)
      let dobFormattes = DATE_FORMATES.FORMATTES
      let date = moment(dob, dobFormattes, true)
      let dateString = ""

      if (!date) {
        dateString = dob
      } else {
        dateString = date.format('MMDDYYYY')
      }
      console.log('here is the date string: ', dateString, "date  : ", date)
      if (dateString.toLowerCase() == 'invalid date') {
        dateString = dob
      }
      console.log('====================')
      return dateString
    } catch (error) {
      return dob
    }

  }
  getViewAbleDateFormate = dob => {
    try {
      console.log('====================')
      console.log('dob is :', dob)
      let dobFormattes = DATE_FORMATES.FORMATTES
      let date = moment(dob, dobFormattes, true)
      let dateString = ""

      if (!date) {
        dateString = dob
      } else {
        dateString = date.format('MM-DD-YYYY')
      }
      console.log('here is the date string: ', dateString, "date  : ", date)
      if (dateString.toLowerCase() == 'invalid date') {
        dateString = dob
      }
      console.log('====================')
      return dateString
    } catch (error) {
      return dob
    }

  }
}

const Utilits = new UtilityMethods();

export default Utilits;
