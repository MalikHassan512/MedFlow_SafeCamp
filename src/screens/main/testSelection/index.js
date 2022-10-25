import React, {useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import styles from './styles';
import {
  InputField,
  Button,
  PhoneInputField,
  RadioButtonItem,
  AvoidKeyboard,
  CheckBox,
  TestConfirmation,
} from '../../../components';
import {LoaderContext} from '../../../components/hooks';
import {useDispatch, useSelector} from 'react-redux';
import useState from 'react-usestateref';
import {Colors, ICON_CONSTANTS, Strings, hp, IS_PAD} from '../../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {setSelectedLog} from 'react-native/Libraries/LogBox/Data/LogBoxData';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {navigateReset} from '../../../navigator/navigationRef';

const TestSelection = props => {
  const {navigation, route} = props;
  const {setLoader} = useContext(LoaderContext);
  const [isPatternDisabled, setIsPatternDisabled] = useState(false);
  const [selected, setSelected] = useState(null);
  const [testCreated, setTestCreated, testCreatedRef] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [testTypes, setTestTypes] = useState([
    {
      label: 'PCR',
      value: Strings.pcr,
      testCreatedselected: false,
      testCreated: false,
    },
    {
      label: 'Rapid Antigen',
      value: Strings.antigen,
      selected: false,
      testCreated: false,
    },
    {
      label: 'Cue',
      value: Strings.molecular,
      selected: false,
      testCreated: false,
    },
    {
      label: 'Accula/Rapid PCR',
      value: Strings.other,
      selected: false,
      testCreated: false,
    },
  ]);
  const [labs, setLabs] = useState([]);
  const dispatch = useDispatch();
  const {employee, test} = useSelector(state => state.reducer);
  const {lab, site} = useSelector(state => state?.reducer?.printer?.eventData);

  useEffect(() => {}, []);

  const backHandler = () => {
    navigation.goBack();
  };

  const onPressHandler = ind => {
    setSelected(ind);
  };
  const renderTestType = ({item, index}) => {
    return (
      <View style={{width: '50%', alignItems: 'center', marginTop: hp(3)}}>
        <CheckBox
          containerStyle={{width: '75%'}}
          onPress={() => {
            updateTestSelection(index);
          }}
          title={item?.label}
          checked={item?.selected}
        />
      </View>
    );
  };
  const updateTestSelection = i => {
    let tempArray = testTypes;
    tempArray[i].selected = !tempArray[i].selected;
    setTestTypes([...tempArray]);
  };
  const canMoveForward = () => {
    return (
      testTypes[0].selected ||
      testTypes[1].selected ||
      testTypes[2].selected ||
      testTypes[3].selected
    );
  };

  const saveAndContinue = async getTestCount => {
    let availableBarCode = null;
    setLoader(true);
    if (
      testTypes[0].selected
      //  &&
      // (lab?.tubes_provided || lab?.barCodeProvided)
    ) {
      if (lab?.barCodeProvided) {
        availableBarCode = await dataStoreHelper.getAvailableBarcod(lab?.id);
        if (availableBarCode == null) {
          setLoader(false);
          alert(
            'No available barcode in this lab. Please select any other lab or wait for some time.',
          );
          return;
        }
      } else if (!lab?.tubes_provided) {
        setLoader(false);
        navigation.navigate('Scanner', {
          createNewTest: route?.params?.createNewTest,
          testType: Strings.pcr,
          selectedTests: testTypes,
        });
        return;
      }
    }
    // setLoader(false);

    createTest(0, availableBarCode);
  };

  const createTest = async (index, availableBarCode) => {
  console.log("🚀 ~ file: index.js ~ line 134 ~ createTest ~ availableBarCode", availableBarCode)
    if (testTypes[index].selected) {
      route?.params?.createNewTest(
        testTypes[index].value,
        employee?.employeeInfo,
        availableBarCode?.barcode ? availableBarCode.barcode : null,
        null,
        null,
        testCreatedRef?.current,
        result => {
          if (result) {
            let tempArray = testTypes;
            tempArray[index].testCreated = true;
            setTestTypes([...tempArray]);
            setTestCreated(true);
          }
          if (index == testTypes.length - 1) {
            setLoader(false);
            if (testCreatedRef.current) {
              setDisplayConfirmation(true);
              setTimeout(() => {
                setDisplayConfirmation(false);
                navigationToRespectiveScreen();
              }, 3000);
            }
          } else {
            if (testTypes[index + 1].selected) {
              // setTimeout(() => {
              createTest(index + 1, availableBarCode);
              // }, 3000);
            } else {
              createTest(index + 1, availableBarCode);
            }
          }
        },
      );
    } else {
      if (index == testTypes.length - 1) {
        setLoader(false);
        if (testCreatedRef.current) {
          setDisplayConfirmation(true);
          setTimeout(() => {
            setDisplayConfirmation(false);
            // navigateReset('Home');
            navigationToRespectiveScreen();
          }, 3000);
        }
      } else {
        if (testTypes[index + 1].selected && testCreatedRef?.current) {
          // setTimeout(() => {
          createTest(index + 1, availableBarCode);
          // }, 3000);
        } else {
          createTest(index + 1, availableBarCode);
        }
      }
    }
  };

  const getCreatedTestTypes = () => {
    let createList = testTypes.filter(testtype => testtype.testCreated);
    return createList ? createList : [];
  };

  const navigationToRespectiveScreen = () => {
    let list = getCreatedTestTypes();
    if (list.length > 0) {
      if (list.length > 1) {
        navigateReset('StartTest');
      } else {
        let type = list[0].value;
        if (type === Strings.pcr) {
          navigateReset('StartTest');
        } else if (type === Strings.antigen) {
          navigateReset('RapidAntigenTest');
        } else if (type === Strings.molecular) {
          navigateReset('CueTest');
        } else if (type === Strings.other) {
          navigateReset('AcculaTests');
        }
      }
    }
  };

  const getSelectedTests = () => {
    let newList = [];
    let message = '';
    testTypes.map((item, index) => {
      if (item.testCreated) newList.push(item);
    });
    newList.map((item, index) => {
      if (message) {
        message = `${message}${index === newList.length - 1 ? ' and ' : ', '} ${
          item.label
        }`;
      } else {
        message = item.label;
      }
    });

    return message;
  };
  const getSelectedTestsLength = () => {
    let newList = [];
    testTypes.map((item, index) => {
      if (item.testCreated) newList.push(item.label);
    });
    return newList.length;
  };
  const onPatternPress = async () => {
    let patternList = employee?.employeeInfo?.patternConsent;
    let isExistSiteId = false;
    if (patternList) {
      patternList.map(obj => {
        const mObj = JSON.parse(obj);
        if (mObj[site.id]) {
          isExistSiteId = true;
        }
      });
    }
    if (isExistSiteId) {
      navigation.navigate('Questions', {
        ...route?.params,
        isPattern: true,
        testTypes,
      });
    } else {
      navigation.push('Signature', {
        ...route?.params,
        isPattern: true,
        testTypes,
      });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <TouchableOpacity onPress={backHandler} style={styles.backButton}>
        <Icon
          size={IS_PAD ? 36 : 32}
          name={'arrow-back-outline'}
          color={Colors.WHITE.default}
        />
      </TouchableOpacity>

      <View>
        <Text style={styles.titleText}>{Strings.testMenuSelection}</Text>
        <Text style={styles.subText}>{Strings.pleaseSelectThe}</Text>

        {/* {_renderRadioSelection()} */}
        <FlatList data={testTypes} renderItem={renderTestType} numColumns={2} />
        {site?.patternTesting && (
          <Button
            onPress={() => {
              setIsPatternDisabled(true);
              onPatternPress();
              setTimeout(() => {
                setIsPatternDisabled(false);
              }, 300);
            }}
            disabled={!testTypes[0].selected || isPatternDisabled}
            title={Strings.pattern}
          />
        )}
        <Button
          disabled={!canMoveForward()}
          onPress={saveAndContinue}
          title={Strings.next}
        />
      </View>
      <TestConfirmation
        display={displayConfirmation}
        setDisplay={setDisplayConfirmation}
        message={`Your ${getSelectedTests()} test ${
          getSelectedTestsLength() > 1 ? 'labels have' : 'label has'
        } been printed.`}
      />
    </View>
  );
};

export default TestSelection;
