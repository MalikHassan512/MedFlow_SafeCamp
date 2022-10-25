import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { ICON_CONSTANTS, hp, Strings } from '../../../constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NativePicker } from '../../../components';
import moment from 'moment';

const Filters = props => {
  const { navigation, route } = props;

  const { showArr, showType, resultType, filterListData } = route.params;

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [tests, setTests] = useState([]);

  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [text, setText] = useState('');
  const [selectShow, setSelectShow] = useState(null);
  const [selectType, setSelectType] = useState(null);
  const [selectResult, setSelectResult] = useState(null);
  const [filterData, setFilterData] = useState({});

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = selectedDate => {
    if (selectedDate) {
      let testObj = filterData;
      testObj['selectedDate'] = moment(selectedDate).format('ddd MMM DD YYYY');
      setDate(moment(selectedDate).format('ddd MMM DD YYYY'));
      setFilterData(testObj);
      hideDatePicker();
    }

    // hideDatePicker();

    // const currentDate = selectedDate || date;
    // setDate(currentDate);

    // let tempDate = new Date(currentDate);
    // console.log('tempDate this is temp data', tempDate);
    // let fdate =
    //   tempDate.getD +
    //   '/' +
    //   tempDate.getDate() +
    //   '/' +
    //   (tempDate.getMonth() + 1) +
    //   '/' +
    //   tempDate.getFullYear();

    // setText(fdate);

    // let testObj = filterData;
    // testObj['date'] = text;
    // setFilterData(testObj);

    // console.log(fdate, 'only date');
  };

  const applyFilters = () => {
    if (Object.keys(filterData).length > 0) {
      // console.log('filter data in if statement', filterData);
      let filterList = [];
      for (let i = 0; i < filterListData.length; i++) {
        var isExist = false;
        if (filterData.selectedDate) {
          if (
            filterData.selectedDate ==
            moment(filterListData[i].createdAt).format('ddd MMM DD YYYY')
          ) {
            isExist = true;
          }
        }
        if (filterData.show) {
          if (filterData.selectedDate) {
            if (filterData.show == filterListData[i].site_name) {
              if (isExist == true) {
              } else {
              }
            } else {
              isExist = false;
            }
          } else {
            if (filterData.show == filterListData[i].site_name) {
              isExist = true;
            }
          }
        }
        if (filterData.test_type) {
          if (filterData.show || filterData.selectedDate) {
            if (isExist == true) {
              if (filterListData[i].test_type == filterData.test_type) {
              } else {
                isExist = false;
              }
            } else {
            }
          } else {
            if (filterListData[i].test_type == filterData.test_type) {
              isExist = true;
            }
          }
        }
        if (filterData.show_result) {
          if (
            filterData.selectedDate ||
            filterData.show ||
            filterData.test_type
          ) {
            if (isExist == true) {
              if (filterData.show_result == filterListData[i].filterRes) {
              } else {
                isExist = false;
              }
            } else {
            }
          } else {
            if (filterData.show_result == filterListData[i].filterRes) {
              isExist = true;
            }
          }
        }
        if (isExist) {
          filterList.push(filterListData[i]);
        }
      }

      const removeDuplicateValue = Array.from(
        new Set(filterList.map(a => a.id)),
      ).map(id => {
        return filterList.find(a => a.id === id);
      });
      setIsFilterApplied(true);
      setTests(removeDuplicateValue);
      // navigation.navigate('MyResult', {tests: removeDuplicateValue});
      navigation.replace('MyResult', { removeDuplicateValue });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'grey'} barStyle="light-content" />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        extraScrollHeight={hp(12)}
      >
        <SafeAreaView style={styles.backArrowCon}>
          <View style={styles.filterCard}>
            <TouchableOpacity onPress={() => navigation.replace('MyResult')}>
              <ICON_CONSTANTS.AntDesign
                style={styles.iconStyle}
                name={'arrowleft'}
              />
            </TouchableOpacity>
            {/* {console.log('tests from filters', tests)} */}
            <TouchableOpacity
              onPress={() => {
                applyFilters();
              }}
            >
              <Text style={styles.titleText}>{Strings.Done.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: '15%' }}>
            <View style={styles.boxCon}>
              <Text style={styles.ht1}>{Strings.Date}</Text>
              <TouchableOpacity style={styles.boxVw} onPress={showDatePicker}>
                {date === '' ? (
                  <Text style={styles.selectText}>
                    {Strings.Pleaseselectdate}
                  </Text>
                ) : (
                  <Text style={styles.selectText}>{date}</Text>
                )}

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.boxCon}>
              <Text style={styles.ht1}>{Strings.Show}</Text>
              <View style={styles.boxVw}>
                <Text style={styles.selectText}>
                  <NativePicker
                    customStyle
                    label={'Please select show'}
                    data={showArr}
                    selectedItem={selectShow}
                    onSelect={item => {
                      setSelectShow(item);
                      if (item.name) {
                        console.log('Data', item);
                        let testObj = filterData;
                        testObj['show'] = item.name;
                        setFilterData(testObj);
                      }
                    }}
                  />
                </Text>
              </View>
            </View>
            <View style={styles.boxCon}>
              <Text style={styles.ht1}>{Strings.TESTTYPE}</Text>
              <View style={styles.boxVw}>
                <Text style={styles.selectText}>
                  <NativePicker
                    customStyle
                    label={'Please select test type...'}
                    data={showType}
                    selectedItem={selectType}
                    onSelect={item => {
                      setSelectType(item);
                      if (item.name) {
                        let testObj = filterData;
                        testObj['type'] = item.name;
                        setFilterData(testObj);
                      }
                    }}
                  />
                </Text>
              </View>
            </View>
            <View style={styles.boxCon}>
              <Text style={styles.ht1}>{Strings.RESULTS}</Text>
              <View style={styles.boxVw}>
                <Text style={styles.selectText}>
                  <NativePicker
                    customStyle
                    label={'Please select result...'}
                    data={resultType?.filter(item => item?.name?.trim() != '')}
                    selectedItem={selectResult}
                    onSelect={item => {
                      setSelectResult(item);
                      if (item.name) {
                        let testObj = filterData;
                        testObj['result'] = item.name;
                        setFilterData(testObj);
                      }
                    }}
                  />
                  {console.log(filterData)}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
      {/* <Footer /> */}
    </View>
  );
};

export default Filters;
