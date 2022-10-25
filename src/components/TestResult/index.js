// import React, {useEffect, useState} from 'react';
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {
  ButtonSmall,
  Counter,
  EditTestType,
  EditTestResult,
} from '../../components';
import styles from './styles';
import {
  App_Constants,
  Colors,
  ICON_CONSTANTS,
  Strings,
  TestTypes,
  wp,
} from '../../constants';
// import {useNavigation} from "@react-navigation/native";
import {DrawerActions, useNavigation} from '@react-navigation/native';
import CountDown from 'react-native-countdown-component';
import {crewTestedName, timerCheck} from '../../store/util';
import EditConfiguration from '../editConfiguration';
import {logoutRequest} from '../../store/actions/auth';
import {Auth, DataStore} from 'aws-amplify';
import printerHelper from '../../utils/printerHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import useState from 'react-usestateref';

const TestResult = props => {
  const {
    updateResult,
    testType,
    updateType,
    onPress,
    test,
    totalTime,
    firstAlert,
    updateInfo,
    multiSelection,
    onItemSelect,
    isSelected,
    index,
    printLabel,
    time,
    updateTestSwipe,
  } = props;
  const navigation = useNavigation();
  const {printer} = useSelector(state => state.reducer);
  const [tResult, setResult] = useState(false);
  // const [tTimer, setTimer, tTimeRef] = useState(
  //   timerCheck(test.startTimeStamp, new Date()),
  // );
  const [showButtons, setShowBtn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  // const [item, setItem] = useState(obj);

  useEffect(() => {
    checkButtonStatus();
  }, []);
  const printerPressHandler = async () => {
    await AsyncStorage.getItem(Strings.selectedPrinter).then(data => {
      if (data !== null) {
        printLabel(true);
        let printingInfo = {
          first: test?.employee_demographics?.firstName,
          last: test?.employee_demographics?.lastName,
          barcode: test?.barcode,
          sequenceNo: test?.sequenceNo,
          testType: test.test_type,
        };
        printerHelper
          .reprintBarcodeTimer(printingInfo, printer?.printer)
          .then(() => {
            // printLabel(false);
          });
        setTimeout(() => {
          printLabel(false);
        }, 2000);
      } else {
        Alert.alert('', Strings.selectPrinterToPrintLabel);
      }
    });
    // alert('Print sent to printer');
  };

  const submitResultHandler = res => {
    setShowResultModal(false);
    updateTestSwipe && updateTestSwipe(false);
    if (res === test?.result) {
      return;
    }

    if (res === App_Constants.POSITIVE) {
      Alert.alert(
        Strings.CONFIRMATION,
        Strings.POSITIVE_RESULT_MESSAGE_START +
          test.sequenceNo +
          Strings.POSITIVE_RESULT_MESSAGE_END,
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              updateResult(test, App_Constants.POSITIVE);
            },
          },
        ],
      );
    } else {
      updateResult(test, App_Constants.NEGATIVE);
    }
  };

  const checkButtonStatus = () => {
    if (test.result == null) {
      if (timerCheck(test.startTimeStamp, totalTime) < firstAlert) {
        setShowBtn(true);
      }
    }
  };
  const updateTestType = type => {
    updateTestSwipe && updateTestSwipe(false);
    setShowTypeModal(false);
    if (type !== testType) {
      updateType(test, type);
    }
  };
  const updateTestResult = res => {
    setShowResultModal(false);
    if (res !== test?.result) {
      console.log('test result to be updated as', res);
      updateResult(test, res);
    }
  };

  const onLongPressHandler = () => {
    onItemSelect(test, index);
  };
  const onPressHandler = () => {
    // console.log('item data is: ', item)
    if (multiSelection) {
      onItemSelect(test, index);
    } else {
      onPress(test);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPressHandler}
      onLongPress={onLongPressHandler}
      style={styles.container}
    >
      {multiSelection && (
        <ICON_CONSTANTS.MCIcon
          style={styles.radioButton}
          name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
        />
      )}

      <View style={styles.padding}>
        <View style={styles.rowContainer}>
          <Text
            style={[
              styles.testIdText,
              {
                color: test?.result
                  ? Colors.WHITE.default
                  : Colors.GOLD.default,
              },
            ]}
          >
            {test?.sequenceNo}
          </Text>

          {test?.result !== null ? (
            <Text
              style={[
                styles.resultText,
                test?.result === App_Constants.POSITIVE && {
                  color: Colors.RED.default,
                },
              ]}
            >
              {test?.result}
              {/*{item.result}*/}
            </Text>
          ) : (
            <View style={styles.rowContainer}>
              <Counter
                firstAlertTime={firstAlert}
                totalTime={totalTime}
                time={time}
                // key={index}
                test={test}
                // time={test.time}
                // time={timerCheck(test.startTimeStamp, totalTime)}
                // onFinish={() => setShowBtn(true)}
                onFirstAlert={setShowBtn}
              />
              <TouchableOpacity
                disabled={multiSelection}
                onPress={printerPressHandler}
              >
                <ICON_CONSTANTS.AntDesign
                  style={styles.printerIcon}
                  name={'printer'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.nameText}>
          {crewTestedName(test)?.toUpperCase()}
        </Text>
        {/*{test.status !== 'Processed' && showButtons && (*/}
        {test.result == null && showButtons && (
          <View style={styles.rowContainer}>
            <ButtonSmall
              disabled={multiSelection}
              title={App_Constants.POSITIVE}
              onPress={() => {
                submitResultHandler(App_Constants.POSITIVE);
                updateTestSwipe && updateTestSwipe(false);
              }}
            />
            <ButtonSmall
              disabled={multiSelection}
              title={App_Constants.NEGATIVE}
              onPress={() => {
                submitResultHandler(App_Constants.NEGATIVE);
                updateTestSwipe && updateTestSwipe(false);
              }}
            />
          </View>
        )}
      </View>
      <View style={multiSelection ? {marginTop: 5} : styles.line} />
      {!multiSelection && (
        <View style={styles.bottomRowContainer}>
          <EditTestType
            test={test}
            isModalVisible={showTypeModal}
            onPress={() => {
              updateTestSwipe && updateTestSwipe(true);
              setShowTypeModal(true);
            }}
            onClose={() => {
              setShowTypeModal(false);
              updateTestSwipe && updateTestSwipe(false);
            }}
            testType={testType}
            updateType={updateTestType}
          />
          <EditConfiguration
            test={test}
            isModalVisible={showModal}
            onPress={() => {
              updateTestSwipe && updateTestSwipe(true);
              setShowModal(true);
            }}
            onClose={() => {
              updateTestSwipe && updateTestSwipe(false);
              setShowModal(false);
            }}
            isTestDetails
            updateInfo={(test, updatedInfo) => {
              updateTestSwipe && updateTestSwipe(false);
              updateInfo(test, updatedInfo);
            }}
          />
          {test?.result && (
            <EditTestResult
              isModalVisible={showResultModal}
              onPress={() => {
                setShowResultModal(true);
                updateTestSwipe && updateTestSwipe(true);
              }}
              onClose={() => {
                setShowResultModal(false);
                updateTestSwipe && updateTestSwipe(false);
              }}
              updateResult={submitResultHandler}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TestResult;
