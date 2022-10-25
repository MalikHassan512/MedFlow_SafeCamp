import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {Colors, Fonts, ICON_CONSTANTS, wp} from '../../constants';
import {SwipeListView} from "react-native-swipe-list-view";
import EditConfiguration from "../editConfiguration";

const BulkSelection = ({cancelHandler, selectedTests, onSelect, tests}) => {

    const selectAllHandler =() => {
        if(selectedTests.length === tests.length) {
            onSelect([])
        }else {
            onSelect([...tests])
        }
    }

  return (
      <View style={styles.rowContainer}>
          <TouchableOpacity onPress={cancelHandler}>
              <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectAllHandler} >
              <Text style={styles.buttonText}>
                  {selectedTests.length === tests.length ? 'Deselect All' : 'Select All'}
              </Text>
          </TouchableOpacity>
      </View>
  );
};

export default BulkSelection;
