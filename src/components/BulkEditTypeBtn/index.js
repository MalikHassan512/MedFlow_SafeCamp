import React from 'react';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import {ICON_CONSTANTS, TestTypes} from '../../constants';
import {SwipeListView} from "react-native-swipe-list-view";
import EditConfiguration from "../editConfiguration";
import {EditTestType} from "../index";

const BulkEditTypeBtn = ({onPress, isVisible, selectedTests, updateTestType, type}) => {

    const onSavePressHandler = (_type) => {
        onPress(false)
        if(type !== _type) {
            updateTestType(selectedTests, _type)
        }
    }
  return (
      <TouchableOpacity
          onPress={() => onPress(true)}
          style={styles.multiEditButton}
      >
          <EditTestType
              test={selectedTests}
              isMulti={true}
              isModalVisible={isVisible}
              onPress={() => onPress(true)}
              onClose={() => onPress(false)}
              testType={type}
              updateType={onSavePressHandler}
          />

      </TouchableOpacity>
  );
};

export default BulkEditTypeBtn;
