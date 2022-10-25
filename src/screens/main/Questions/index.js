import React, {useRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NativePicker,
  RadioButtonItem,
  TestConfirmation,
} from '../../../components';
import {QUESTIONS_LIST} from '../../../constants/data';
import {DataStore} from 'aws-amplify';
import {Employee} from '../../../models';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Colors, hp, IS_IPHONE_X, IS_PAD, Strings, wp} from '../../../constants';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {navigateReset} from '../../../navigator/navigationRef';
import {saveEmployeeInfo} from '../../../store/actions/employeeInfo';
import {LoaderContext} from '../../../components/hooks';
import useState from 'react-usestateref';

const QUESTION_TOTAL_TYPES = {
  INPUT: 'input',
  DATE: 'date',
  CHECK_BOXES: 'check_boxes',
  RADIO_BTNS: 'radio_btns',
  DROP_DOWN: 'drop_down',
};

let dateSelectionIndex = -1;
let selectedDateObj = null;

const QuestionScreens = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();
  const {setLoader} = useContext(LoaderContext);
  const swipeRef = useRef(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isProcessing, setProcessing] = useState(false);
  const [isButtonDisable, setButtonDisabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [questionsList, setQuestionsList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [testCreated, setTestCreated, testCreatedRef] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const {employeeInfo} = useSelector(state => state?.reducer?.employee);
  const {site, lab} = useSelector(state => state?.reducer?.printer?.eventData);
  const [testTypes, setTestTypes] = useState([]);

  useEffect(() => {
    setProcessing(false);
    // setQuestionsList([])
    setTestTypes(props.route.params.testTypes);
    checkQuestionsFirstTimeOrNot();
  }, []);

  const checkQuestionsFirstTimeOrNot = async () => {
    let mQuestionsList = JSON.parse(JSON.stringify(QUESTIONS_LIST));
    const getEmployee = await DataStore.query(Employee, emp =>
      emp.id('eq', employeeInfo.id),
    );

    if (getEmployee && getEmployee.length > 0) {
      getEmployee.map(async item => {
        if (item.patternConsent) {
          const patternList = item.patternConsent;
          let findQuestionsObj = null;
          patternList.map(obj => {
            const mObj = JSON.parse(obj);
            if (mObj[site.id]) {
              findQuestionsObj = mObj[site.id];
            }
          });

          if (findQuestionsObj) {
            let newList = [];
            let isNextVisible = false;
            mQuestionsList.map(item => {
              let newObject = item;
              if (!item.isVisibleEveryTime) {
                newObject.isDependent = true;
              }
              if (isNextVisible) {
                newObject.isDependent = false;
                isNextVisible = false;
              }
              if (findQuestionsObj) {
                const objectKeysList = Object.keys(findQuestionsObj);
                objectKeysList.map(mItem => {
                  if (mItem === item.id.toString()) {
                    if (findQuestionsObj[mItem] === 'Yes') {
                      isNextVisible = true;
                    }
                    newObject.selectedAnswer = findQuestionsObj[mItem];
                  }
                });
              }

              newList.push(newObject);
            });

            setQuestionsList(newList);
          } else setQuestionsList(mQuestionsList);
        } else {
          setQuestionsList(mQuestionsList);
        }
      });
    }
  };

  const nextPage = (mIndex, answerSelection) => {
    swipeRef.current.scrollBy(1, true);
    const newList = questionsList.map((item, i) => {
      const obj = item;
      if (mIndex == i) {
        obj['selectedAnswer'] = answerSelection;
      }
      return obj;
    });
    setQuestionsList(newList);
    if (mIndex == questionsList.length - 1) {
      setLoading(true);
      if (props.route.params.createNewTest) {
        props.route.params.createNewTest(
          props.route.params.getTestCount,
          newList,
          null,
          null,
          null,
          false,
          result => {},
        );
      }
    }
  };

  const handleRadioSelection = (index, listIndex) => {
    Keyboard.dismiss();
    const element = questionsList[listIndex];
    element.selectedIndex = index;
    element.selectedAnswer = element.options[index].label;
    let newQuestionsList = [];
    questionsList.map((mItem, i) => {
      if (i == listIndex) newQuestionsList.push(element);
      else {
        let itemObj = mItem;
        const optionsObj = element.options[index];
        if (optionsObj.dependentId) {
          optionsObj.dependentId.map(item => {
            if (mItem.id === item.id) {
              if (item.visible) {
                itemObj.isDependent = false;
              } else {
                itemObj.isDependent = true;
              }
            }
          });
        }
        newQuestionsList.push(mItem);
      }
    });

    setQuestionsList(newQuestionsList);
  };

  const inputQuestionsView = (item, listIndex, showIndex) => {
    return (
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text style={styles.resContent}>{`Q ${showIndex}: `}</Text>

          <Text
            style={{
              ...styles.resContent,
              textAlign: 'left',
              marginStart: 10,
              marginEnd: 30,
            }}
          >
            {item.name}
          </Text>
        </View>

        <View>
          <TextInput
            placeholder="Answer"
            placeholderTextColor={Colors.GRAY.lightText}
            style={{
              color: Colors.WHITE.default,
              height: hp(6),
              paddingLeft: 10,
              borderBottomColor: `${Colors.WHITE.primary}`,
              borderBottomWidth: 1,
              fontSize: wp(3),
            }}

            value={questionsList[listIndex]?.selectedAnswer?.trimStart()}
            onChangeText={text => {
              var newString = text;
              const mObj = item;
              mObj.selectedAnswer = newString;
              let newQuestionsList = [];
              questionsList.map((mItem, i) => {
                if (i == listIndex) newQuestionsList.push(mObj);
                else newQuestionsList.push(mItem);
              });
              setQuestionsList(newQuestionsList);
            }}
          />
        </View>
      </View>
    );
  };

  const radioBtnSelectionView = (item, listIndex, showIndex) => {
    return (
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text style={styles.resContent}>{`Q ${showIndex}: `}</Text>

          <Text
            style={{
              ...styles.resContent,
              textAlign: 'left',
              marginStart: 10,
              marginEnd: 30,
            }}
          >
            {item.name}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 20,
            flexWrap: 'wrap',
          }}
        >
          {item.options.map((mItem, optionsIndex) => {
            return (
              <View
                style={{
                  marginTop: 10,
                  width: '50%',
                }}
              >
                <RadioButtonItem
                  obj={mItem}
                  index={optionsIndex}
                  buttonSize={hp(1.7)}
                  buttonOuterSize={hp(3)}
                  isSelected={item.selectedIndex == optionsIndex}
                  onPress={index => handleRadioSelection(index, listIndex)}
                  buttonInnerColor={'white'}
                  buttonOuterColor={'white'}
                  disabled={false}
                  labelStyle={styles.radioLabel}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const checkBoxesSelectionView = (item, listIndex, showIndex) => {
    const fullItem = item;
    return (
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text style={styles.resContent}>{`Q ${showIndex}: `}</Text>

          <Text
            style={{
              ...styles.resContent,
              textAlign: 'left',
              marginStart: 10,
              marginEnd: 30,
            }}
          >
            {item.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 30,
          }}
        >
          {item.options.map((mItem, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  checkListSelectionHandled(
                    item,
                    mItem,
                    index,
                    fullItem,
                    listIndex,
                  );
                }}
              >
                <View
                  style={{
                    width: Dimensions.get('screen').width / 2 - 40,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    active
                    type="MaterialCommunityIcons"
                    name={
                      mItem.isSelected
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    size={IS_PAD ? hp(3.5) : hp(3)}
                    style={{color: '#D8D8D8', marginEnd: 10}}
                  />
                  <Text
                    style={{color: 'white', fontSize: IS_PAD ? wp(2) : wp(3)}}
                  >
                    {mItem.name}
                  </Text>
                </View>
              </TouchableOpacity>

              // <CheckBox
              //     style={{ width: Dimensions.get("screen").width / 2 - 40, marginBottom: 10 }}
              //     rightTextStyle={{
              //         color: "white",
              //     }}
              //     onClick={() => {
              //         checkListSelectionHandled(item, mItem, index, fullItem, listIndex)
              //     }}
              //     checkBoxColor={"white"}
              //     isChecked={mItem.isSelected}
              //     rightText={mItem.name}
              // />
            );
          })}
        </View>
      </View>
    );
  };

  const checkListSelectionHandled = (
    item,
    mItem,
    index,
    fullItem,
    listIndex,
  ) => {
    let checkNewList = [];
    let storeDependencyIds = [];
    const element = item.options[index];
    element.isSelected = !mItem.isSelected;
    let selectedObj = null;
    const itemCheck = element.uncheck;
    if (itemCheck) {
      storeDependencyIds = [];
    } else {
      storeDependencyIds = element.dependentId;
    }

    for (let i = 0; i < item.options.length; i++) {
      let obj = item.options[i];
      if (index == i) {
        obj.dependentId.map(object => {
          selectedObj = questionsList.find(
            questions => questions.id == object.id,
          );
        });
        selectedObj.isDependent = false;
        const selectedCheckList = item.options.filter(op => op.isSelected);
        if (selectedCheckList.length == 0) {
          selectedObj.isDependent = true;
        }
        if (obj.uncheck) {
          selectedObj.isDependent = true;
        }
        checkNewList.push(element);
      } else {
        if (itemCheck) {
          obj.isSelected = false;
        } else {
          if (obj.uncheck) {
            obj.isSelected = false;
          }
        }
        checkNewList.push(obj);
      }
    }
    fullItem.options = checkNewList;
    let selectedNames = '';
    checkNewList.map((objj, ii) => {
      if (objj.isSelected) {
        if (ii == 0) {
          selectedNames += objj.name;
        } else {
          selectedNames += '&&' + objj.name;
        }
      }
    });

    fullItem.selectedAnswer = selectedNames;
    let newQuestionsList = [];
    questionsList.map((mItem, i) => {
      if (i == listIndex) newQuestionsList.push(fullItem);
      else {
        if (mItem.id === selectedObj.id) {
          newQuestionsList.push(selectedObj);
        } else newQuestionsList.push(mItem);
      }
    });
    setQuestionsList(newQuestionsList);
  };

  const dateSelectionView = (item, listIndex, showIndex) => {
    return (
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text style={styles.resContent}>{`Q ${showIndex}: `}</Text>

          <Text
            style={{
              ...styles.resContent,
              textAlign: 'left',
              marginStart: 10,
              marginEnd: 30,
            }}
          >
            {item.name}
          </Text>
        </View>
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              dateSelectionIndex = listIndex;
              selectedDateObj = item;
              Keyboard.dismiss();
              setDatePickerOpen(!isDatePickerOpen);
            }}
          >
            <View
              style={{
                backgroundColor: 'transparent',
                // backgroundColor: "red",
                position: 'absolute',
                zIndex: 1,
                width: '100%',
                height: '100%',
              }}
            />
          </TouchableWithoutFeedback>

          <TextInput
            placeholder="MM-DD-YYYY"
            placeholderTextColor={Colors.GRAY.lightText}
            style={{
              color: Colors.WHITE.default,
              height: hp(6),
              paddingLeft: 10,
              borderBottomColor: `${Colors.WHITE.primary}`,
              borderBottomWidth: 1,
              fontSize: IS_PAD ? 22 : 16,
            }}
            editable={false}
            keyboardType={'number-pad'}
            maxLength={10}
            value={item.selectedAnswer}
            onChangeText={text => {}}
          />
        </View>
      </View>
    );
  };

  const onValueChange = (value, item, listIndex) => {
    let obj = item;
    obj.selectedItem = value;
    obj.selectedAnswer = item.dropDownList[value - 1].name;

    let newQuestionsList = [];
    questionsList.map((mItem, i) => {
      if (i == listIndex) newQuestionsList.push(obj);
      else newQuestionsList.push(mItem);
    });

    setQuestionsList(newQuestionsList);
  };

  const dropDownSelectionView = (item, listIndex, showIndex) => {
    return (
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text style={styles.resContent}>{`Q ${showIndex}: `}</Text>

          <Text
            style={{
              ...styles.resContent,
              textAlign: 'left',
              marginStart: 10,
              marginEnd: 30,
            }}
          >
            {item.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: Dimensions.get('screen').width - 40,
            borderBottomWidth: 1,
            borderBottomColor: '#D8D8D8',
            justifyContent: 'space-between',
          }}
        >
          <NativePicker
            label="Select..."
            data={item.dropDownList}
            key={item.dropDownList}
            customButtonAndroid={{
              width: Dimensions.get('screen').width - 120,
              color: 'white',
            }}
            onSelect={item => {
              console.log(
                '🚀 ~ file: index.js ~ line 652 ~ dropDownSelectionView ~ item',
                item,
              );
            }}
            selectedItem={item.selectedItem ? item.selectedItem : ''}
          />
          {Platform.OS === 'ios' && (
            <AntDesign
              active
              type="AntDesign"
              name="down"
              size={hp(3)}
              style={{color: '#D8D8D8', fontSize: 16, end: 40}}
            />
          )}
        </View>
      </View>
    );
  };

  const questionListMainView = () => {
    let showIndex = 0;
    return questionsList.map((item, index) => {
      if (!item.isDependent) {
        showIndex += 1;
        if (item.type == QUESTION_TOTAL_TYPES.INPUT) {
          return inputQuestionsView(item, index, showIndex);
        } else if (item.type == QUESTION_TOTAL_TYPES.RADIO_BTNS) {
          return radioBtnSelectionView(item, index, showIndex);
        } else if (item.type == QUESTION_TOTAL_TYPES.CHECK_BOXES) {
          return checkBoxesSelectionView(item, index, showIndex);
        } else if (item.type == QUESTION_TOTAL_TYPES.DATE) {
          return dateSelectionView(item, index, showIndex);
        } else if (item.type == QUESTION_TOTAL_TYPES.DROP_DOWN) {
          return dropDownSelectionView(item, index, showIndex);
        }
      }
    });
  };

  const moveForward = () => {
    let isDisable = true;
    for (let index = 0; index < questionsList.length; index++) {
      const element = questionsList[index];
      if (!element.isDependent) {
        if (element.selectedAnswer != '') {
          isDisable = false;
        } else {
          isDisable = true;
          break;
        }
      }
    }

    return !isDisable;
  };

  const saveTestCall = async () => {
    let availableBarCode = null;
    setLoader(true);
    // setDisplayConfirmation(true);
    setProcessing(true);
    console.log('error - > ');
    if (props.route.params && props.route.params.isPattern) {
      const getEmployee = await DataStore.query(Employee, emp =>
        emp.id('eq', employeeInfo.id),
      );
      if (getEmployee && getEmployee.length > 0) {
        getEmployee.map(async item => {
          console.log('item11 -- > ', item.patternConsent);
          let patternList = [];
          if (item.patternConsent && item.patternConsent > 0) {
            let patternParse = item.patternConsent;
            patternList = [...patternParse];
            patternList.map(item => {
              let newObj = JSON.parse(item);
              console.log('existShow -- > ', !newObj[location.siteID]);
              if (!newObj[location.siteID]) {
                let questionObj = {};
                questionsList.map(item => {
                  if (item.dependentQuestionsId) {
                    questionObj[item.id] = item.selectedAnswer;
                  }
                });
                let finalObj = {};
                finalObj[location.siteID] = questionObj;
                patternList.push(JSON.stringify(finalObj));
              }
            });
            // let isAlreadyAdded = false
            // patternList.map((obj) => {
            //     const parseObj = JSON.parse(obj)
            //     if (typeof parseObj === "object" && parseObj[QUESTIONS_KEY]) {
            //         isAlreadyAdded = true
            //     }
            // })
            // if (!patternList.includes(JSON.stringify(location.siteID))) {
            //     patternList.push(JSON.stringify(location.siteID))
            //     if (!isAlreadyAdded) {
            //         let questionObj = {}
            //         questionsList.map((item) => {
            //             if (item.dependentQuestionsId) {
            //                 questionObj[item.id] = item.selectedAnswer
            //             }
            //         })
            //         let finalObj = {}
            //         finalObj[QUESTIONS_KEY] = questionObj
            //         patternList.push(JSON.stringify(finalObj))
            //     }

            // }
          } else {
            console.log('enter111112');
            let questionObj = {};
            questionsList.map(item => {
              if (item.dependentQuestionsId) {
                questionObj[item.id] = item.selectedAnswer;
              }
            });
            let finalObj = {};
            finalObj[site?.id] = questionObj;
            patternList.push(JSON.stringify(finalObj));
          }
          const sendPatternConsent = patternList;
          console.log('updatedEmployee- > ', patternList);

          const employee = await DataStore.save(
            Employee.copyOf(item, updated => {
              updated.patternConsent = sendPatternConsent;
            }),
          );
          let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
            employee,
          );
          dispatch(saveEmployeeInfo(employeeDemographic));
        });
      }
    }

    let mSelectedQuestions = [];
    questionsList.map(item => {
      const obj = {
        id: item.id,
        name: item.name,
        type: item.type,
        selectedAnswer: item.selectedAnswer,
      };
      mSelectedQuestions.push(obj);
    });
    if(lab?.barCodeProvided){
      availableBarCode = await dataStoreHelper.getAvailableBarcod(lab?.id);
      if (availableBarCode == null) {
        setLoader(false);
        setProcessing(false);
        alert(
          'No available barcode in this lab. Please select any other lab or wait for some time.',
        );
        return;
      }
    }
    createTest(
      0,
      availableBarCode,
      // props.route.params.testTypes,
      mSelectedQuestions,
    );
  };
  const createTest = async (index, availableBarCode, testAnswer) => {
    if (testTypes[index].selected) {
      props.route.params.createNewTest(
        testTypes[index].value,
        employeeInfo,
        availableBarCode?.barcode ? availableBarCode?.barcode : null,
        testTypes[index].value == Strings.pcr ? testAnswer : null,
        null,
        testCreatedRef.current,
        result => {
          if (result) {
            let tempArray = testTypes;
            tempArray[index].testCreated = !tempArray[index].testCreated;
            setTestTypes([...tempArray]);
            setTestCreated(true);
            // setLoader(false);
            // setDisplayConfirmation(true);
          }
          if (index == testTypes.length - 1) {
            setLoader(false);
            setProcessing(false);
            if (testCreatedRef.current) {
              setDisplayConfirmation(true);
              setTimeout(() => {
                setDisplayConfirmation(false);
                // navigateReset('Home');
                navigateReset('StartTest');
              }, 3000);
            }
          } else {
            if (testTypes[index + 1].selected) {
              // setTimeout(() => {
                createTest(index + 1, availableBarCode, testTypes, testAnswer);
              // }, 3000);
            } else {
              createTest(index + 1, availableBarCode, testTypes, testAnswer);
            }
          }
        },
      );
    } else {
      if (index == testTypes.length - 1) {
        setLoader(false);
        setProcessing(false);
        if (testCreatedRef.current) {
          setDisplayConfirmation(true);
          setTimeout(() => {
            setDisplayConfirmation(false);
            // navigateReset('Home');
            navigateReset('StartTest');
          }, 3000);
        }
      } else {
        if (testTypes[index + 1].selected && testCreatedRef?.current) {
          // setTimeout(() => {
            createTest(index + 1, availableBarCode, testTypes, testAnswer);
          // }, 3000);
        } else {
          createTest(index + 1, availableBarCode, testTypes, testAnswer);
        }
      }
    }
  };

  const getSelectedTests = () => {
    let newList = [];
    let message = ""
    props?.route?.params?.testTypes.map((item, index) => {
      if (item.testCreated) newList.push(item);
    });
    newList.map((item, index) => {
      if (message) {
        message = `${message}${index === newList.length - 1 ? ' and ' : ', '} ${item.label}`
      } else {
        message = item.label
      }
    });

    return message;
    // let newList = [];
    // props?.route?.params?.testTypes.map((item, index) => {
    //   if (item.testCreated) newList.push(item.label);
    // });
    // return newList;
  };
  const getSelectedTestsLength = () => {
    let newList = [];
    props?.route?.params?.testTypes.map((item, index) => {
      if (item.selected) newList.push(item.label);
    });
    return newList.length;
  };

  return (
    <View style={styles.container} contentContainerStyle={{flex: 1}}>
      <View style={styles.header}>
        <View
          style={{
            alignSelf: 'flex-start',
            marginTop: hp(2),
            marginTop: IS_IPHONE_X ? (IS_PAD ? hp(3) : hp(5)) : hp(3),
          }}
        >
          <TouchableOpacity
            style={{paddingLeft: 10}}
            onPress={() => {
              props.navigation.goBack();
            }}
            transparent
          >
            <Ionicons style={styles.Icon} size={hp(3)} name="arrow-back" />
          </TouchableOpacity>
        </View>
        <View />
      </View>
      <Text style={{...styles.title}}>Questions</Text>

      <KeyboardAvoidingView
        {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: 90,
        }}
        enabled
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              marginBottom: 30,
            }}
          >
            {questionListMainView()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          zIndex: isLoading ? 0 : 1,
          justifyContent: 'space-evenly',
          position: 'absolute',
          bottom: hp(3),
        }}
      >
        <TouchableOpacity
          style={
            moveForward()
              ? styles.button
              : {
                  ...styles.button,
                  backgroundColor: 'rgba(255, 51, 102, 0.25)',
                }
          }
          onPress={() => {
            saveTestCall();
          }}
          disabled={!moveForward() || isProcessing}
        >
          {!isProcessing && (
            <Text
              style={{
                color: !moveForward() ? 'rgba(255, 255, 255, 0.5)' : 'white',
              }}
            >
              Next
            </Text>
          )}
          {isProcessing && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            zIndex: isLoading ? 1 : 0,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isLoading
              ? 'transparent'
              : 'rgba(52, 52, 52, 0.4)',
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : null}

      <SafeAreaView />

      <DateTimePickerModal
        isVisible={isDatePickerOpen}
        mode="date"
        maximumDate={new Date()}
        onConfirm={date => {
          setDatePickerOpen(false);
          if (dateSelectionIndex !== -1 && selectedDateObj) {
            let obj = selectedDateObj;
            obj.selectedAnswer = moment(date).format('MM-DD-YYYY');

            let newQuestionsList = [];
            questionsList.map((mItem, i) => {
              if (i == dateSelectionIndex) newQuestionsList.push(obj);
              else newQuestionsList.push(mItem);
            });

            setQuestionsList(newQuestionsList);
            // setSelectedDate(moment(date).format('MM-DD-YYYY'))
          }
        }}
        onCancel={() => setDatePickerOpen(false)}
      />
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

export default QuestionScreens;

const styles = StyleSheet.create({
  radioLabel: {
    width: Dimensions.get('screen').width / 2 - 60,
    fontSize: IS_PAD ? 18 : 14,
    color: 'white',
  },
  bottomTxt: {
    flex: 1,
    marginBottom: 100,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#343a40',
  },
  bottomView: {
    margin: 20,
    flex: 1,
    backgroundColor: 'pink',
  },
  swiperCon: {marginTop: 30, flex: 0.8},

  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  Icon: {
    color: '#D8D8D8',
  },
  title: {
    marginHorizontal: 20,
    fontSize: IS_PAD ? 32 : 22,
    color: 'white',
    fontWeight: '700',
  },
  pagination: {marginBottom: 40},
  questionCon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    flex: 1,
  },
  resContent: {
    fontSize: IS_PAD ? 26 : 18,
    // lineHeight: 25,
    marginTop: 30,
    alignSelf: 'flex-start',
    textAlign: 'center',
    color: 'white',
  },

  button: {
    alignSelf: 'center',
    backgroundColor: '#FF3366',
    paddingVertical: IS_PAD ? 25 : 20,
    width: '90%',
    // paddingLeft: width / 2 - 50,
    // paddingRight: width / 2 - 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});
