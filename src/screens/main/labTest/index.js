// import React, {useEffect, useState} from 'react';
import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './styles';
import {
  AvoidKeyboard,
  Button,
  Header,
  SearchBar,
  TestDetails,
  TestResult,
  BulkEditConfigBtn,
  BulkSelection,
  SwipeDelete,
  BulkEditTypeBtn,
  NativePicker,
} from '../../../components';
import {
  App_Constants,
  Colors,
  Strings,
  wp,
  hp,
  ICON_CONSTANTS,
  TestTypes,
  TestStatus,
} from '../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPendingLabTest,
  getRapidAntigenTests,
  updateTestConfig,
  updateTestType,
  sendTestToLab,
  updateTestLabType,
} from '../../../store/actions';
import {
  filterLabTestList,
  filterTestList,
  getArrangedTestList,
  itemSelection,
  onDeleteTest,
  sortTestList,
  testDummyData,
} from '../../../store/util';
import EditConfiguration from '../../../components/editConfiguration';
import useState from 'react-usestateref';
import TestConfirmation from '../../../components/TestConfirmation';
import {ScreensName} from '../../../constants/Strings';
import Global from '../../../constants/Global';
import {LoaderContext} from '../../../components/hooks';
import {navigateReset} from '../../../navigator/navigationRef';
import dataStoreHelper from '../../../utils/dataStoreHelper';

const LabTest = props => {
  const {navigation} = props;
  const dispatch = useDispatch();
  const {selectedSite, pendingLabTests, isLoading, sendingToLab} = useSelector(
    state => state.reducer.test,
  );
  const {eventData, printer} = useSelector(state => state.reducer.printer);
  const {setLoader} = useContext(LoaderContext);
  const [searchText, setSearchText] = useState('');
  const [tests, setTests, testRef] = useState([]);
  const [multiSelection, setMultiSelection] = useState(false);
  const [selectedTests, setSelectedTests, selectedTestRef] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [displaySyncing, setDisplaySyncing] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [testUpdateLoading, setTestUpdateLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [appliedFilter, setAppliedFilter] = useState(null);
  const [labFilter, setLabFilter] = useState(null);
  const [labList, setLabList] = useState([]);
  const [testSwipe, setTestSwipe] = useState(false);
  const [filteredArray, setFilteredArray] = useState([]);
  const [sentTests, setSentTests] = useState([]);

  const filters = [
    {name: 'Sent Tests', id: 1},
    {name: 'New Tests', id: 2},
  ];

  useEffect(() => {
    setTimeout(() => {
      getLabTestList();
      fetchLabs(eventData?.site);
    }, 200);

    Global.currentScreen = ScreensName.LAB;
  }, []);

  const getSentLabTestList = () => {
    // dispatch(getPendingLabTest(null, null))
    if (eventData) {
      dispatch(
        getPendingLabTest(
          {
            siteId: eventData?.site?.id,
            labId: eventData?.lab?.id,
            sentTest: true,
          },
          null,
        ),
      );
    }
  };

  const fetchLabs = async siteData => {
    // console.log('site data got: ', siteData);
    let mLabs = [];
    if (siteData?.insurance_required) {
      mLabs = await dataStoreHelper.getLabsWithInsurance(true);
    } else {
      mLabs = await dataStoreHelper.getLabsWithInsurance(false);
    }

    console.log('labs fetched: ', mLabs);
    // mLabs = labFilter(clientRef.current?.id, siteRef.current.id, mLabs);
    setLabList(mLabs);
  };

  const getLabTestList = () => {
    // dispatch(getPendingLabTest(null, null))
    if (eventData) {
      dispatch(
        getPendingLabTest(
          {siteId: eventData?.site?.id, labId: eventData?.lab?.id},
          null,
        ),
      );
    }
  };
  const refreshHandler = () => {
    getLabTestList();
    if (!appliedFilter) {
      setMultiSelection(false);
      setSearchText('');
    }
  };

  useEffect(() => {
    if (testUpdateLoading) {
      return;
    }
    setTimeout(() => {
      // if (appliedFilter) {
      //   setFilteredArray(pendingLabTests);
      // } else {
      const testsBySite = pendingLabTests
        .filter(
          item =>
            item.status.toLowerCase() !== TestStatus.PROCESSED &&
            item.result?.toLocaleLowerCase() !== TestStatus.POSITIVE,
        )
        .map(item => {
          let obj = {
            ...item,
            selected: false,
          };
          return obj;
        });

      if (searchText.trim() === '' && !multiSelection) {
        setTests(testsBySite);
      } else {
        setTests(updateList(testsBySite, tests));
      }
      // }
      setLoader(false);
    }, 200);

    // setTests(testsBySite);
  }, [pendingLabTests]);

  const updateList = (arr1, arr2) => {
    const res = arr1.filter(test => {
      let arr = arr2.filter(oldTest => oldTest.id === test.id);
      return !(arr.length === 0);
    });
    return res;
  };

  const filterRecord = text => {
    setSearchText(text);
    if (appliedFilter) {
      if (labFilter) {
        setFilteredArray(
          filterLabTestList(sentTests, text.trim()).filter(
            t => t.labID === labFilter.id,
          ),
        );
      } else {
        setFilteredArray(filterLabTestList(sentTests, text.trim()));
      }
    } else {
      setTests(filterLabTestList(pendingLabTests, text.trim()));
    }
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

  const addPressHandler = () => {
    if (eventData?.site?.id && eventData?.lab?.id && eventData?.clientID) {
      if (printer && Object.keys(printer).length !== 0) {
        dispatch(updateTestType(Strings.pcr));
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

  const sendTest = async testArray => {
    // let isSentTest = appliedFilter && selectedFilter?.id === 1;
    let isSentTest = testArray?.length > 0;

    let testToSent = isSentTest
      ? testArray
      : appliedFilter
      ? filteredArray
      : tests;

    setTimeout(() => {
      setSending(true);
    }, 200);
    setTestUpdateLoading(true);
    let time = 450 * testToSent.length;

    let arrangedObj = getArrangedTestList(testToSent);
    console.log('arrangedObj are: ', arrangedObj);
    let labIds = Object.keys(arrangedObj);
    console.log('labids are: ', labIds);
    if (labIds.length > 0) {
      labIds.forEach(async labId => {
        let tests = arrangedObj[labId];
        dispatch(sendTestToLab({tests: tests}));
      });
    }

    setTimeout(
      async () => {
        setSending(false);
        if (!isSentTest) {
          setTimeout(() => {
            setDisplaySuccess(true);
          }, 300);
        }
        if (isSentTest) {
          let msg = `Lab has been changed and ${
            testArray.length < 2 ? 'the test has' : 'all tests have'
          } been submitted to ${testArray[0].labName}`;
          Alert.alert('', msg);
          setTestUpdateLoading(false);
        } else {
          setTimeout(() => {
            setDisplaySuccess(false);
            setTestUpdateLoading(false);
            if (!isSentTest) {
              navigateReset('Main');
            }
          }, 2000);
        }
      },
      testToSent.length < 3 ? 1200 : time,
    );
  };

  const updateTestTypeHandler = (test, type) => {
    let payload = {
      tests: multiSelection ? test : [test],
      type: type,
      config: eventData,
    };
    console.log('payload.test length : ', payload.tests.length);
    if (payload.tests.length === 0) {
      return;
    }
    dispatch(updateTestLabType(payload));
    removeHandler(test);
  };
  const updateInformation = async (test, updateInfo, onlyLabUpdated) => {
    let isSentTest = appliedFilter && selectedFilter?.id === 1;
    if (multiSelection) {
      if (test?.length === 0) {
        return;
      }
      cancelHandler();
      setShowModal(false);
      let tempArray = filteredArray;
      test.forEach(t => {
        let payload = {
          testObj: t,
          updatedInfo: updateInfo,
          type: TestTypes.PCR,
        };
        dispatch(updateTestConfig(payload));
        if (appliedFilter) {
          let index = tempArray.indexOf(t);
          tempArray[index] = {
            ...t,
            labID: updateInfo.labID,
            labName: updateInfo.labName,
          };
        }
      });
      if (isSentTest) {
        let testToSent = test.map(t => {
          let obj = {
            ...t,
            labID: updateInfo.labID,
            labName: updateInfo.labName,
            clientID: updateInfo.clientID,
            clientName: updateInfo.clientName,
            siteID: updateInfo.siteID,
            siteName: updateInfo.siteName,
          };
          return obj;
        });
        sendTest(testToSent);
      }

      // console.log('cehcking lab value: ', onlyLabUpdated);
      if (!onlyLabUpdated && appliedFilter) {
        setFilteredArray([...tempArray]);
      }
    } else {
      let payload = {
        testObj: test,
        updatedInfo: updateInfo,
        type: TestTypes.PCR,
      };
      dispatch(updateTestConfig(payload));
      if (isSentTest) {
        let t = {
          ...test,
          labID: updateInfo.labID,
          labName: updateInfo.labName,
          clientID: updateInfo.clientID,
          clientName: updateInfo.clientName,
          siteID: updateInfo.siteID,
          siteName: updateInfo.siteName,
        };
        sendTest([t]);
      }
    }
    if (!onlyLabUpdated) {
      removeHandler(test);
    } else {
      if (appliedFilter && !multiSelection) {
        let index = filteredArray.indexOf(test);
        let tempArray = filteredArray;
        tempArray[index] = {
          ...test,
          labID: updateInfo.labID,
          labName: updateInfo.labName,
        };
        setFilteredArray([...tempArray]);
      }
      if (!isSentTest) {
        setTimeout(() => {
          Alert.alert(
            '',
            test.length > 1
              ? Strings.typeUpdatedMsgForBul
              : Strings.typeUpdatedMsg,
          );
        }, 500);
      }
    }
  };
  const removeHandler = test => {
    let isSentTest = appliedFilter && selectedFilter?.id === 1;
    if (multiSelection) {
      cancelHandler();
      if (test?.length > 1) {
        setTestUpdateLoading(true);
        setTimeout(() => {
          setLoader(true);
        }, 300);
        setTimeout(() => {
          removeMultipleTestFromState(test);
          setLoader(false);
          setTestUpdateLoading(false);
          !isSentTest && Alert.alert('', Strings.typeUpdatedMsgForBul);
        }, 2000);
      } else {
        removeTestFromState(test[0]);
      }
    } else {
      removeTestFromState(test);
    }
    if (!multiSelection || (multiSelection && test?.length === 1)) {
      setTimeout(() => {
        !isSentTest && Alert.alert('', Strings.typeUpdatedMsg);
      }, 500);
    }
  };
  const removeTestFromState = test => {
    if (appliedFilter) {
      let temp = filteredArray.filter(t => t.id != test.id);
      let tempFullArray = sentTests.filter(t => t.id != test.id);
      setFilteredArray([...temp]);
      setSentTests([...tempFullArray]);
    } else {
      let index = testRef.current.indexOf(test);
      testRef.current.splice(index, 1);
      setTests([...tests]);
    }
  };

  const removeMultipleTestFromState = selectedTests => {
    if (appliedFilter) {
      let a = filteredArray;
      let b = sentTests;
      a = a.filter(function(item) {
        return selectedTests.indexOf(item) === -1;
      });
      b = b.filter(function(item) {
        return selectedTests.indexOf(item) === -1;
      });
      setFilteredArray([...a]);
      setSentTests([...b]);
    } else {
      let a = tests;
      a = a.filter(function(item) {
        return selectedTests.indexOf(item) === -1;
      });
      setTests([...a]);
    }
    setSelectedTests([]);
  };

  const onPressHandler = test => {
    console.log('test detail is: ', test);
    navigation.navigate('StartTest', {
      screen: 'FormInput',
      params: {
        record: test?.employee_demographics,
        updateEmp: true,
        test: test,
        screen: 'LabTest',
      },
    });
  };

  const onDeletePress = async test => {
    await onDeleteTest(test, dispatch, () => {
      if (appliedFilter) {
        let temp = filteredArray.filter(t => t.id != test.id);
        setFilteredArray([...temp]);
      } else {
        let index = testRef.current.indexOf(test);
        testRef.current.splice(index, 1);
        setTests(tests);
      }
    });
  };

  const getTitle = () => {
    let title = Strings.labTest;
    if (appliedFilter) {
      if (filteredArray.length > 0) {
        title = title + ` (${filteredArray.length})`;
      }
    } else if (tests.length > 0) {
      title = title + ` (${tests.length})`;
    }
    return title;
  };

  const closeFilter = () => {
    setShowFilterModal(false);
    setSelectedFilter(appliedFilter);
  };

  const clearFilter = () => {
    setLoader(true);
    setSearchText('');
    cancelHandler();
    setSelectedFilter(null);
    setAppliedFilter(null);
    setLabFilter(null);
    getLabTestList();
  };

  const applyFilter = async () => {
    setShowFilterModal(false);
    setSearchText('');
    cancelHandler();
    setLoader(true);
    setAppliedFilter(selectedFilter);
    let sentTest = await dataStoreHelper.getSentLabTests(
      eventData?.site?.id,
      selectedFilter.id === 1 ? TestStatus.SENT : TestStatus.PENDING,
    );
    setSentTests(sentTest);
    
    // console.log('sent tests => ', sentTest);
    // console.log('test lab id', sentTest[0]?.labID);
    // console.log('lab filter id', labFilter?.id);
    if (labFilter) {
      setFilteredArray(sentTest.filter(t => t?.labID === labFilter?.id));
    } else {
      setFilteredArray(sentTest);
    }
    setTimeout(() => {
      setLoader(false);
    }, 500);
    
  };

  _renderFilterModal = () => {
    return (
      <Modal visible={showFilterModal} transparent={true}>
        <TouchableWithoutFeedback onPress={closeFilter}>
          <View style={styles.transparentView}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalView}>
          <View style={styles.closeIconBtn}>
            <TouchableOpacity onPress={closeFilter}>
              <ICON_CONSTANTS.AntDesign
                name={'close'}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headingText}>{Strings.Filters}</Text>
          <NativePicker
            label="Select status..."
            data={filters}
            onSelect={item => {
              console.log('selected client is: ', item);
              setSelectedFilter(item);
            }}
            selectedItem={selectedFilter}
          />
          <NativePicker
            label="Select lab..."
            data={labList}
            onSelect={item => {
              console.log('selected lab is: ', item);
              if (item === 'Select lab...') {
                setLabFilter(null);
              } else {
                setLabFilter(item);
              }
            }}
            selectedItem={labFilter}
          />
          <Button
            title="Apply"
            onPress={applyFilter}
            disabled={selectedFilter == null}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header
        add
        refresh
        title={getTitle()}
        onAddPress={addPressHandler}
        onRefreshPress={refreshHandler}
      />
      <>
        {_renderFilterModal()}
        <SearchBar search={searchText} onChangeText={filterRecord} />
        {eventData?.site?.id && (
          <View style={{zIndex: 10}}>
            <View
              style={[
                styles.filterContainer,
                (appliedFilter
                  ? filteredArray.length < 1
                  : tests.length < 1) && {
                  top: hp(1.8),
                },
                appliedFilter &&
                  selectedFilter?.id === 1 && {
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
              ]}
            >
              {appliedFilter && selectedFilter?.id === 1 && (
                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={clearFilter}
                >
                  <Text style={styles.clearBtn}>Clear</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => setShowFilterModal(true)}
              >
                <ICON_CONSTANTS.IonIcons
                  name="filter"
                  size={30}
                  color={Colors.WHITE.default}
                />
              </TouchableOpacity>
              {appliedFilter && selectedFilter?.id === 2 && (
                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={clearFilter}
                >
                  <Text style={styles.clearBtn}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <TestConfirmation
          display={sending}
          setDisplay={setSending}
          message={`Syncing data...`}
          isForSysncing={true}
        />
        {/* <TestConfirmation
          display={displaySyncing}
          setDisplay={setDisplaySyncing}
          message={`Syncing data...`}
          isForSysncing={true}
        /> */}
        <TestConfirmation
          display={displaySuccess}
          setDisplay={setDisplaySuccess}
          message={`Submitted ${
            appliedFilter ? filteredArray.length : tests.length
          } test${tests.length > 1 ? 's' : ''} successfully.`}
        />

        {(appliedFilter ? filteredArray.length > 0 : tests.length > 0) &&
          (selectedFilter?.id === 1 ? (
            <View style={{height: hp(8)}} />
          ) : (
            <Button
              onPress={sendTest}
              buttonStyle={{marginBottom: hp(1), width: wp(40)}}
              title={Strings.sendToLab}
            />
          ))}

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
            tests={appliedFilter ? filteredArray : tests}
          />
        )}

        {(appliedFilter ? filteredArray.length < 1 : tests.length < 1) &&
          !isLoading && (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.noTestText}>
                {eventData?.site?.id
                  ? Strings.noScannedTests
                  : Strings.pleaseSelectEventConfig}
              </Text>
            </View>
          )}
        {(appliedFilter ? filteredArray.length > 0 : tests.length > 0) &&
          !isLoading && (
            <SwipeDelete
              disableSwipe={multiSelection || testSwipe}
              isDisabled={multiSelection}
              tests={appliedFilter ? filteredArray : tests}
              renderItem={(item, index) => (
                <TestDetails
                  updateTestSwipe={bool => setTestSwipe(bool)}
                  onPress={onPressHandler}
                  index={index}
                  isSelected={
                    selectedTestRef.current.filter(s => s.id === item.id)
                      .length > 0
                  }
                  item={item}
                  multiSelection={multiSelection}
                  onItemSelect={selectItem}
                  updateInfo={updateInformation}
                  updateType={updateTestTypeHandler}
                  printLabel={value => {
                    setDisplayConfirmation(value);
                  }}
                />
              )}
              onDeletePress={item => onDeletePress(item)}
            />
          )}
      </>
      {multiSelection && selectedTestRef.current.length > 0 && (
        <View style={styles.bottomRowContainer}>
          <BulkEditTypeBtn
            updateTestType={updateTestTypeHandler}
            onPress={setShowTypeModal}
            isVisible={showTypeModal}
            selectedTests={selectedTests}
            type={TestTypes.PCR}
          />

          <BulkEditConfigBtn
            updateInfo={updateInformation}
            onPress={setShowModal}
            isVisible={showModal}
            selectedTests={selectedTests}
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

export default LabTest;
