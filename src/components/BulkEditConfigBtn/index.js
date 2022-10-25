import React from 'react';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import {ICON_CONSTANTS} from '../../constants';
import {SwipeListView} from "react-native-swipe-list-view";
import EditConfiguration from "../editConfiguration";

const BulkEditConfigBtn = ({onPress, isVisible, selectedTests, updateInfo}) => {

  return (
      <TouchableOpacity
          onPress={() => onPress(true)}
          style={styles.multiEditButton}
      >
          <EditConfiguration
              test={selectedTests}
              isMulti={true}
              isModalVisible={isVisible}
              onPress={() => onPress(true)}
              onClose={() => onPress(false)}
              updateInfo={updateInfo}
          />

      </TouchableOpacity>
  );
};

export default BulkEditConfigBtn;
