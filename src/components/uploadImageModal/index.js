import React from 'react';
import {View, Text, Modal, TouchableWithoutFeedback} from 'react-native';
import {wp} from '../../constants';
import Button from '../Button';
import styles from './styles';

const UploadImageModal = ({onOpen, onClose, onPress, openCamera}) => {
  return (
    <>
      <Modal visible={onOpen} transparent={true}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.transparentView} />
        </TouchableWithoutFeedback>
        <View style={styles.modalView}>
          <Text style={styles.headingText}>Upload Image Modal</Text>

          <Button
            title="Take Picture"
            buttonStyle={styles.buttonStyle}
            onPress={openCamera}
          />
          <Button
            onPress={onPress}
            title="Choose from Gallery"
            buttonStyle={[styles.buttonStyle, {marginBottom: wp(5)}]}
          />
        </View>
      </Modal>
    </>
  );
};

export default UploadImageModal;
