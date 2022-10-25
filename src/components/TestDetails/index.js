import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Modal, Alert} from 'react-native';
import {ICON_CONSTANTS, Strings, TestTypes, wp} from '../../constants';
import styles from './styles';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import EditConfiguration from '../editConfiguration';
import {EditTestType} from '../../components';
import moment from 'moment';
import Utilits from '../../utils/utilityMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import printerHelper from '../../utils/printerHelper';
import {useDispatch, useSelector} from 'react-redux';

const TestDetails = props => {
  const navigation = useNavigation();

  const {
    item,
    onPress,
    multiSelection,
    onItemSelect,
    selectedTests,
    index,
    isSelected,
    updateInfo,
    updateType,
    printLabel,
    updateTestSwipe,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selected, setSelected] = useState(false);
  const {printer} = useSelector(state => state.reducer);

  // console.log('lab test item is: ', item);

  // useEffect(() => {
  //   console.log('is Selected: ', selectedTests.filter(s => s.id === item.id).length)
  //   if(selectedTests.filter(s => s.id === item.id).length > 0) {
  //     setSelected(true)
  //   }
  //   // else {setSelected(false)}
  // }, [selectedTests.length])

  useEffect(() => {
    // console.log('checking if item is changing');
  }, [item, item?.isSelected]);

  const onLongPressHandler = () => {
    onItemSelect(item, index);
  };
  const onPressHandler = () => {
    // console.log('item data is: ', item)
    if (multiSelection) {
      onItemSelect(item, index);
    } else {
      onPress(item);
    }
  };

  const printPressHandler = async () => {
    await AsyncStorage.getItem(Strings.selectedPrinter).then(data => {
      if (data !== null) {
        printLabel(true);
        let printingInfo = {
          first: item?.employee_demographics?.firstName,
          last: item?.employee_demographics?.lastName,
          dob: item?.employee_demographics?.dob,
          barcode: item?.barcode,
          id: item?.sequenceNo,
        };
        printerHelper
          .reprintBarcode(printingInfo, printer?.printer)
          .then(() => {
            // printLabel(false);
          });
        setTimeout(() => {
          printLabel(false);
        }, 2000);
      } else {
       Alert.alert('', Strings.selectPrinterToPrintLabel)
      }
    });
    // navigation.navigate('Main');
  };

  const crewTestedName = () => {
    if (typeof item?.employee_demographics === 'string') {
      const demoObj = JSON.parse(item.employee_demographics);
      return demoObj.firstName + ' ' + demoObj.lastName;
    } else {
      return (
        item.employee_demographics.firstName +
        ' ' +
        item.employee_demographics.lastName
      );
    }
  };

  const updateInfoCall = (test, update, onlyLabUpdated) => {
    updateInfo(test, update, onlyLabUpdated);
    setShowModal(false);
  };

  const updateTestType = type => {
    console.log('tests type is: ', type);
    setShowTypeModal(false);
    if (type !== TestTypes.PCR) {
      updateType(item, type);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPressHandler}
      onLongPress={onLongPressHandler}
      style={styles.outerContainer}
    >
      {/*{multiSelection && <ICON_CONSTANTS.IonIcons*/}
      {/*    style={styles.radioButton}*/}
      {/*    name={isSelected ? 'radio-button-on' : 'radio-button-off'}*/}
      {/*/>}*/}
      <View style={styles.container}>
        {multiSelection && (
          <ICON_CONSTANTS.IonIcons
            style={styles.radioButton}
            // name={selected ? 'radio-button-on' : 'radio-button-off'}
            name={isSelected ? 'checkbox' : 'checkbox-outline'}
          />
        )}
        <View>
          <Text
            numberOfLines={1}
            style={styles.text}
          >{`ID: ${item.barcode}`}</Text>
          <Text
            numberOfLines={1}
            style={styles.text}
          >{`Name: ${crewTestedName()}`}</Text>
          <Text
            numberOfLines={1}
            style={styles.text}
          >{`Date: ${Utilits.formatDate(item.batch)}`}</Text>
          <Text
            numberOfLines={1}
            style={styles.text}
          >{`Show: ${item.site_name}`}</Text>
          <Text
            numberOfLines={1}
            style={styles.text}
          >{`Lab Name: ${item.labName}`}</Text>
          <Text
            numberOfLines={1}
            style={styles.text}
          >{`Tester: ${item.tester_name}`}</Text>
          <Text
            numberOfLines={1}
            style={styles.text}
          >{`Sequence No: ${item.sequenceNo}`}</Text>
          <Text numberOfLines={1} style={styles.text}>
            {`Pattern: ${
              item.patternTestAnswer &&
              JSON.parse(item.patternTestAnswer).length > 0
                ? 'Y'
                : 'N'
            }`}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.text, styles.statusColor]}
          >{`Status: ${item.status}`}</Text>
        </View>
        <TouchableOpacity onPress={printPressHandler}>
          <ICON_CONSTANTS.AntDesign
            style={styles.printerIcon}
            name={'printer'}
          />
        </TouchableOpacity>
      </View>

      {!multiSelection && (
        <View style={styles.bottomRowContainer}>
          <EditTestType
            test={item}
            isModalVisible={showTypeModal}
            onPress={() => {
              setShowTypeModal(true);

              updateTestSwipe && updateTestSwipe(true);
            }}
            onClose={() => {
              setShowTypeModal(false);
              updateTestSwipe && updateTestSwipe(false);
            }}
            testType={TestTypes.PCR}
            updateType={updateTestType}
          />
          <EditConfiguration
            test={item}
            isModalVisible={showModal}
            onPress={() => {
              setShowModal(true);
              updateTestSwipe && updateTestSwipe(true);
            }}
            onClose={() => {
              setShowModal(false);
              updateTestSwipe && updateTestSwipe(false);
            }}
            isTestDetails
            updateInfo={updateInfoCall}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TestDetails;
