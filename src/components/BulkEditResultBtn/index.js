import React from 'react';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import {ICON_CONSTANTS, TestTypes} from '../../constants';
import {SwipeListView} from "react-native-swipe-list-view";
import EditConfiguration from "../editConfiguration";
import {EditTestResult, EditTestType} from "../index";

const BulkEditResultBtn = ({updateResult, onPress, isVisible}) => {

    const updateResultHandler = (result) => {
        onPress(false)
        updateResult(result)
    }

  return (
      <TouchableOpacity
          onPress={() => onPress(true)}
          style={styles.multiEditButton}
      >
          <EditTestResult
              isMulti={true}
              isModalVisible={isVisible}
              onPress={() => onPress(true)}
              onClose={() => onPress(false)}
              updateResult={updateResultHandler}
          />

      </TouchableOpacity>
  );
};

export default BulkEditResultBtn;
