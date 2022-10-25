import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import styles from './styles';
import {ICON_CONSTANTS} from '../../constants';

const DropDown = ({label, data, onSelect}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const DropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const onItemPress = item => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({item, index}) => {
    console.log('index is: ', index);
    return (
      <TouchableOpacity
        style={[
          styles.item,
          index === data.length - 1 && {borderBottomWidth: 0},
        ]}
        onPress={() => onItemPress(item)}>
        <Text>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  const renderDropdown = () => {
    if (visible) {
      return (
        <Modal
          visible={visible}
          transparent
          animationType="none"
          onRequestClose={toggleDropdown}>
          <Pressable style={{flex: 1}} onPress={toggleDropdown}>
            <TouchableOpacity
              // style={styles.overlay}
              onPress={() => setVisible(false)}>
              <View style={[styles.dropdown, {top: dropdownTop}]}>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </TouchableOpacity>
          </Pressable>
        </Modal>
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleDropdown}
        ref={DropdownButton}>
        {renderDropdown()}
        <Text style={styles.buttonText}>
          {(selected && selected.label) || label}
        </Text>

        <ICON_CONSTANTS.IonIcons
          style={styles.downIcon}
          name={visible ? 'chevron-up' : 'chevron-down'}
        />
      </TouchableOpacity>
    </>
  );
};

export default DropDown;
