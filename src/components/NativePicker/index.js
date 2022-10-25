import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import styles from './styles';
import { hp, ICON_CONSTANTS, IS_PAD, wp } from '../../constants';
import { useIsFocused } from '@react-navigation/native';
import SearchBar from '../SearchBar';

const NativePicker = ({ label, data, onSelect, selectedItem, customStyle }) => {
  const focus = useIsFocused();

  const [noneSelected, setNoneSelected] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [search, setSearch] = useState('');
  const [masterData, setMasterData] = useState(data);
  const DropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);

  useEffect(() => {
    if (visible) {
      // setMasterData(data);
    } else {
      setVisible(false);
      setSelected(undefined);
    }
  }, [visible]);
  useEffect(() => {
    setMasterData(data);
  }, [data]);

  const searchFilter = text => {
    if (text) {
      const newData = data.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setMasterData([...newData]);
      setSearch(text);
    } else {
      setMasterData(data);
      setSearch(text);
    }
  };

  const toggleDropdown = () => {
    setMasterData(data);
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

  const onLabelSelect = () => {
    setSelected(undefined);
    onSelect(label);
    setVisible(false);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.dropdown,
          styles.item,
          index === data?.length - 1,
        ]}
        onPress={() => onItemPress(item)}
      >
        <Text style={styles.label}>
          {item.name}
        </Text>
        {(item?.id && (selectedItem?.id == item?.id) || (selectedItem?.value?._connectionSettings && (selectedItem?.value?._connectionSettings == item?.value?._connectionSettings))) && <ICON_CONSTANTS.Entypo
          style={styles.tickIcon}
          name={'check'}
          type="Entypo"
        />}
      </TouchableOpacity>
    );
  };

  const renderDropdown = () => {
    if (visible) {
      return (
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={toggleDropdown}
        >
          <View style={styles.header}>
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity style={{}} onPress={toggleDropdown}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>Select One</Text>
              <TouchableOpacity style={{}} onPress={toggleDropdown}>
                <Text style={styles.backText}>{'    '}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <View style={{ marginVertical: 5 }}>
                <SearchBar
                  isDropDown
                  onChangeText={text => searchFilter(text)}
                />
              </View>

              <TouchableOpacity onPress={() => setVisible(false)} style={[styles.dropdown]}>
                <TouchableOpacity
                  style={[styles.item]}
                  onPress={() => {
                    onLabelSelect();
                  }}
                >
                  <Text style={styles.label}>
                    {label}
                  </Text>
                </TouchableOpacity>
                {/* <Text style={styles.dropdownTitle}> Hello </Text> */}
              </TouchableOpacity>
            </View>
            <FlatList
              data={masterData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Modal>
      );
    }
  };
  return (
    <>
      <TouchableOpacity
        // key={data}
        style={[styles.button, customStyle && styles.customButtonAndroid]}
        onPress={toggleDropdown}
        ref={DropdownButton}
      >
        {renderDropdown()}
        <Text
          style={[styles.buttonText, customStyle && styles.customButtonText]}
        >
          {(selectedItem && selectedItem.name) ||
            (selected && selected.name) ||
            label}
        </Text>

        {!customStyle && (
          <ICON_CONSTANTS.IonIcons
            style={styles.downIcon}
            name={visible ? 'chevron-up' : 'chevron-down'}
          />
        )}
      </TouchableOpacity>
    </>
  );
};

export default NativePicker;
