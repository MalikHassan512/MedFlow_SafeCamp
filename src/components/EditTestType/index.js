import React, { useEffect } from 'react';
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Colors, ICON_CONSTANTS, IS_PAD, Strings, TestTypes } from '../../constants';
import styles from './styles';
import {
  DropDown,
  Button,
  NativePicker,
  RadioButtonItem,
} from '../../components';
import { updateSelectedSite } from '../../store/actions/tests';
import { useSelector } from 'react-redux';
import useState from 'react-usestateref';

const EditTestType = ({
  onPress,
  onClose,
  isModalVisible,
  test,
  isMulti,
  testType,
  updateType,
}) => {
  const [selected, setSelected] = useState(testType);

  // const currentConfig = isMulti ? test[0] : test

  useEffect(() => { }, []);

  const onSavePressHandler = () => {
    // updateType(test, selected)
    updateType(selected);
  };

  const RadioButtons = () => {
    const radio_props = [
      { label: 'Rapid Antigen', value: 0 },
      { label: 'Cue', value: 1 },
      { label: 'Accula/Rapid PCR', value: 2 },
      { label: 'PCR', value: 3 },
    ];
    return (
      <View style={{ borderWidth: 0, paddingHorizontal: '5%' }}>
        <RadioButtonItem
          obj={radio_props[0]}
          index={0}
          isSelected={selected === TestTypes.ANTIGEN}
          onPress={() => setSelected(TestTypes.ANTIGEN)}
          labelStyle={styles.radioLabel}
        />
        <View style={{ margin: 10 }} />
        <RadioButtonItem
          obj={radio_props[1]}
          index={1}
          isSelected={selected === TestTypes.MOLECULAR}
          onPress={() => setSelected(TestTypes.MOLECULAR)}
          labelStyle={styles.radioLabel}
        />
        <View style={{ margin: 10 }} />
        <RadioButtonItem
          obj={radio_props[2]}
          index={2}
          isSelected={selected === TestTypes.ACCULA}
          onPress={() => setSelected(TestTypes.ACCULA)}
          labelStyle={styles.radioLabel}
        />
        <View style={{ margin: 10 }} />
        <RadioButtonItem
          obj={radio_props[3]}
          index={3}
          isSelected={selected === TestTypes.PCR}
          onPress={() => setSelected(TestTypes.PCR)}
          labelStyle={styles.radioLabel}
        />
      </View>
    );
  };

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
        <Text style={styles.textStyle}>{Strings.editType}</Text>
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
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.headingText}>{Strings.testTypeSelection}</Text>

            <RadioButtons />

            <Button
              title="Save"
              onPress={onSavePressHandler}
              buttonStyle={styles.buttonStyle}
            />
          </View>
        </Modal>
      )}
    </>
  );
};

export default EditTestType;
