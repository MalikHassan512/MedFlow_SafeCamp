import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './styles';
import {
  AvoidKeyboard,
  Header,
  SearchBar,
  TestResult,
  SwipeDelete,
  BulkSelection,
  BulkEditConfigBtn,
  BulkEditTypeBtn,
  TestConfirmation,
} from '../../../components';
import {
  App_Constants,
  Colors,
  Strings,
  TestStatus,
  TestTypes,
} from '../../../constants';
import {
  calculateTestTotalTime,
  updatedResultedRecordsToDatabase,
  onDeleteTest,
  sortTestList,
  filterTestList,
  itemSelection,
  timerCheck,
} from '../../../store/util';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCueLabTests,
  updateTestConfig,
  updateTestLabType,
  updateTestType,
} from '../../../store/actions';
import useState from 'react-usestateref';
import BulkEditResultBtn from '../../../components/BulkEditResultBtn';
import {ScreensName} from '../../../constants/Strings';
import Global from '../../../constants/Global';
import {LoaderContext} from '../../../components/hooks';
import {navigateReset} from '../../../navigator/navigationRef';

const CueTest = props => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const {selectedSite, isLoading, pendingCueTests} = useSelector(
    state => state.reducer.test,
  );
  const {setLoader} = useContext(LoaderContext);
  const {eventData, printer} = useSelector(state => state.reducer.printer);
  const {testSettings} = useSelector(state => state.reducer.eventConfig);
  const [searchText, setSearchText] = useState('');
  const [tests, setTests, testRef] = useState(sortTestList(pendingCueTests));
  const [selectedTests, setSelectedTests, selectedTestRef] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [multiSelection, setMultiSelection] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [testUpdateLoading, setTestUpdateLoading] = useState(false);
  const [testSwipe, setTestSwipe] = useState(false);

  // console.log('test setting is: ', testSettings)
  const molecularObject = testSettings.filter(
    item => item.name === 'Molecular',
  )[0];

  const totalTestTime = calculateTestTotalTime(molecularObject?.totalTime);
  const firstAlertTime = calculateTestTotalTime(molecularObject?.firstAlert);

  useEffect(() => {
    setTimeout(() => {
      getCueTestList();
    }, 200);
    Global.currentScreen = ScreensName.CUE;
  }, [eventData]);

  useEffect(() => {
    if (testUpdateLoading) {
      return;
    }
    setTimeout(() => {
      if (pendingCueTests.length > 0) {
        if (searchText.trim() === '' && !multiSelection) {
          setTests(sortTestList(pendingCueTests));
        } else {
          setTests(updateList(pendingCueTests, tests));
        }
      } else if (pendingCueTests.length == 0) {
        setTests([]);
      }
    }, 200);
  }, [pendingCueTests]);

  const updateList = (arr1, arr2) => {
    const res = arr1.filter(test => {
      let arr = arr2.filter(oldTest => oldTest.id === test.id);
      return !(arr.length === 0);
    });
    return res;
  };

  const getCueTestList = () => {
    if (eventData) {
      dispatch(getCueLabTests({id: eventData?.site?.id}));
    }
  };

  const refreshHandler = () => {
    getCueTestList();
    setMultiSelection(false);
    setSearchText('');
  };

  const onDeletePress = async test => {
    await onDeleteTest(test, dispatch, () => {
      let index = testRef.current.indexOf(test);
      testRef.current.splice(index, 1);
      setTests(tests);
    });
  };

  const updateInformation = async (test, updateInfo) => {
    if (multiSelection) {
      // let a = tests;
      // a = a.filter(function(item) {
      //   return test.indexOf(item) === -1;
      // });
      // setTests([...a]);
      // setMultiSelection(false);
      setShowModal(false);
      test.forEach(t => {
        let payload = {
          testObj: t,
          updatedInfo: updateInfo,
          type: TestTypes.MOLECULAR,
        };
        dispatch(updateTestConfig(payload));
      });
      // removeMultipleTestFromState(test)
    } else {
      let payload = {
        testObj: test,
        updatedInfo: updateInfo,
        type: TestTypes.MOLECULAR,
      };
      dispatch(updateTestConfig(payload));
      // removeTestFromState(test);
    }
    removeHandler(test);
    // setTimeout(() => {
    //   Alert.alert('', test?.length > 1 ? Strings.typeUpdatedMsgForBul : Strings.typeUpdatedMsg)
    // }, 1000);
  };

  const removeHandler = test => {
    let time = 450 * test.length;
    if (multiSelection) {
      cancelHandler();
      if (test?.length > 1) {
        setTestUpdateLoading(true);
        setTimeout(() => {
          setLoader(true);
        }, 300);
        setTimeout(
          () => {
            removeMultipleTestFromState(test);
            setLoader(false);
            setTestUpdateLoading(false);
            Alert.alert('', Strings.typeUpdatedMsgForBul);
          },
          test.length < 3 ? 1200 : time,
        );
      } else {
        removeTestFromState(test[0]);
      }
    } else {
      removeTestFromState(test);
    }
    if (!multiSelection || (multiSelection && test?.length === 1)) {
      setTimeout(() => {
        Alert.alert('', Strings.typeUpdatedMsg);
      }, 500);
    }
  };

  const removeTestFromState = test => {
    let index = testRef.current.indexOf(test);
    testRef.current.splice(index, 1);
    setTests(tests);
  };
  const removeMultipleTestFromState = selectedTests => {
    let a = tests;
    a = a.filter(function(item) {
      return selectedTests.indexOf(item) === -1;
    });
    setTests([...a]);
  };

  const updateResult = async (cTest, result) => {
    // resultedSequenceList.push(thisTimer.sequenceNo)
    let time = 450 * cTest?.length;
    if (multiSelection) {
      {
        cTest?.length > 1 &&
          setTimeout(() => {
            setLoader(true);
          }, 300);
      }
      let temp = tests;
      let selectedTests = [];
      cTest.forEach(t => {
        let test = {
          ...t,
          result: result,
          status: TestStatus.PROCESSED,
          timerStatus: TestStatus.PROCESSED,
        };
        selectedTests.push(test);
        let index = temp.indexOf(t);
        temp[index] = test;
      });
      // setTests(sortTestList([...temp]));
      cancelHandler();
      updatedResultedRecordsToDatabase(selectedTests, false, '').then();
      setTimeout(
        () => {
          setLoader(false);
          Alert.alert(
            '',
            cTest.length > 1
              ? Strings.typeUpdatedMsgForBul
              : Strings.typeUpdatedMsg,
          );
        },
        cTest.length < 3 ? 1200 : time,
      );
    } else {
      let test = {
        ...cTest,
        result: result,
        status: TestStatus.PROCESSED,
        timerStatus: TestStatus.PROCESSED,
      };

      let temp = tests;
      let index = testRef.current.indexOf(cTest);

      temp[index] = test;
      setTests(sortTestList([...temp]));

      const testIdList = {
        id: test.id,
        serialNo: '',
      };
      updatedResultedRecordsToDatabase([test], false, testIdList.serialNo).then(
        () => {
          // Alert.alert('', Strings.typeUpdatedMsg);
        },
      );
    }
  };

  const filterRecord = text => {
    setSearchText(text);
    setTests(sortTestList(filterTestList(pendingCueTests, text.trim())));
  };

  const selectItem = item => {
    setSelectedTests(itemSelection(item, selectedTests));
    if (!multiSelection) {
      setMultiSelection(true);
    }
  };
  const cancelHandler = () => {
    setMultiSelection(false);
    setSelectedTests([]);
  };

  const onPressHandler = test => {
    navigation.navigate('StartTest', {
      screen: 'FormInput',
      params: {
        record: test?.employee_demographics,
        updateEmp: true,
        test: test,
        screen: 'CueTest',
      },
    });
  };
  const addPressHandler = () => {
    if (eventData?.site?.id && eventData?.lab?.id && eventData?.clientID) {
      if (printer && Object.keys(printer).length !== 0) {
        dispatch(updateTestType(Strings.molecular));
        navigateReset('StartTest');
      } else {
        Alert.alert('', Strings.selectPrinterMessage, [
          {
            text: 'Ok',
            onPress: () => {
              navigateReset('Main');
            },
          },
        ]);
      }
    } else {
      Alert.alert('', Strings.fillConfiguratoin, [
        {
          text: 'Ok',
          onPress: () => {
            navigateReset('Main');
          },
        },
      ]);
    }
  };

  const updateTestTypeHandler = (test, type) => {
    let payload = {
      tests: multiSelection ? test : [test],
      type: type,
      config: eventData,
      isTimerTest: true,
    };
    dispatch(updateTestLabType(payload));
    removeHandler(test);
    // cancelHandler();
    // if (multiSelection) {
    //   removeMultipleTestFromState(test);
    // } else {
    //   removeTestFromState(test);
    // }
    //
    // setTimeout(() => {
    //   Alert.alert('', payload.tests.length > 1 ? Strings.typeUpdatedMsgForBul : Strings.typeUpdatedMsg)
    // }, 1000);
  };

  const getTitle = () => {
    let title = Strings.cueTest;
    if (tests.length > 0) {
      title = title + ` (${tests.length})`;
    } else if (tests.length === 0) {
      title = Strings.cueTest;
    }
    return title;
  };
  const handleResultUpdate = (testList, res) => {
    if (res === App_Constants.POSITIVE) {
      Alert.alert(
        Strings.CONFIRMATION,
        Strings.POSITIVE_RESULT_MESSAGE_BULK +
          (testList.length > 1 ? 'tests' : 'test') +
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
              updateResult(testList, App_Constants.POSITIVE);
            },
          },
        ],
      );
    } else {
      updateResult(testList, App_Constants.NEGATIVE);
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header
        add
        refresh
        title={getTitle()}
        onRefreshPress={refreshHandler}
        onAddPress={addPressHandler}
      />
      <SearchBar search={searchText} onChangeText={filterRecord} />
      {isLoading && (
        <ActivityIndicator
          style={{marginTop: 15}}
          size="large"
          color={Colors.PINK.default}
        />
      )}
      {multiSelection && (
        <BulkSelection
          cancelHandler={cancelHandler}
          selectedTests={selectedTests}
          onSelect={setSelectedTests}
          tests={tests}
        />
      )}
      {tests.length < 1 && !isLoading && (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.noTestText}>
            {eventData?.site?.id
              ? Strings.noScannedTests
              : Strings.pleaseSelectEventConfig}
          </Text>
        </View>
      )}
      {tests.length > 0 && !isLoading && (
        <SwipeDelete
          disableSwipe={multiSelection || testSwipe}
          isDisabled={multiSelection}
          tests={tests}
          renderItem={(item, index) => {
            console.log('total time test is : ', totalTestTime);
            let t = timerCheck(item.startTimeStamp, totalTestTime);
            console.log('total time test  1 is : ', t);
            return (
              <TestResult
                updateTestSwipe={bool => setTestSwipe(bool)}
                updateResult={updateResult}
                updateType={updateTestTypeHandler}
                testType={TestTypes.CUE}
                onPress={onPressHandler}
                index={index}
                test={item}
                time={t}
                totalTime={totalTestTime}
                firstAlert={firstAlertTime}
                updateInfo={updateInformation}
                submitResult={(test, result) => updateResult(test, result)}
                multiSelection={multiSelection}
                onItemSelect={selectItem}
                isSelected={
                  selectedTestRef.current.filter(s => s.id === item.id).length >
                  0
                }
                printLabel={value => {
                  setDisplayConfirmation(value);
                }}
              />
            );
          }}
          onDeletePress={item => onDeletePress(item)}
        />
      )}
      {multiSelection && selectedTestRef.current.length > 0 && (
        <View style={styles.bottomRowContainer}>
          <BulkEditTypeBtn
            updateTestType={updateTestTypeHandler}
            onPress={setShowTypeModal}
            isVisible={showTypeModal}
            selectedTests={selectedTests}
            type={TestTypes.CUE}
          />
          <BulkEditConfigBtn
            updateInfo={updateInformation}
            onPress={setShowModal}
            isVisible={showModal}
            selectedTests={selectedTests}
          />
          <BulkEditResultBtn
            onPress={setShowResultModal}
            isVisible={showResultModal}
            updateResult={result => handleResultUpdate(selectedTests, result)}
          />
        </View>
      )}
      <TestConfirmation
        display={displayConfirmation}
        setDisplay={setDisplayConfirmation}
        message={`Your label is reprinting.`}
      />
    </View>
  );
};

export default CueTest;
