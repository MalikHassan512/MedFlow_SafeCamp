import React, { useEffect } from 'react';
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  App_Constants,
  Colors,
  ICON_CONSTANTS,
  Strings,
  TestTypes,
} from '../../constants';
import styles from './styles';
import {
  DropDown,
  Button,
  NativePicker,
  RadioButtonItem,
  ButtonSmall,
} from '../../components';
import { updateSelectedSite } from '../../store/actions/tests';
import { useSelector } from 'react-redux';
import useState from 'react-usestateref';

const EditTestResult = ({
  onPress,
  onClose,
  isModalVisible,
  updateResult,
  isMulti,
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        {!isMulti && (
          <ICON_CONSTANTS.FAIcon
            name={'file-signature'}
            size={16}
            color={Colors.WHITE.primary}
            style={{ marginRight: 5 }}
          />
        )}
        <Text style={styles.textStyle}>{Strings.editResult}</Text>
      </TouchableOpacity>

      {isModalVisible && (
        <Modal visible={isModalVisible} transparent={true}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.transparentView}></View>
          </TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={styles.closeIconBtn}>
              <TouchableOpacity onPress={onClose}>
                <ICON_CONSTANTS.AntDesign
                  name={'close'}
                  size={24}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.headingText}>
              {Strings.testResultSelection}
            </Text>

            <View style={styles.rowContainer}>
              <ButtonSmall
                title={App_Constants.POSITIVE}
                onPress={() => updateResult(App_Constants.POSITIVE)}
              />
              <ButtonSmall
                title={App_Constants.NEGATIVE}
                onPress={() => updateResult(App_Constants.NEGATIVE)}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default EditTestResult;
