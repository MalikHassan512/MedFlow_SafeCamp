import React from 'react';
import {Text, TouchableOpacity, Image} from 'react-native';
import {ICON_CONSTANTS} from '../../constants';
import styles from './styles';

const UploadCardImages = props => {
  const {title, onPress, image} = props;
  return (
    <>
      <Text style={styles.titleText}>Capture {title}</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
        {image ? (
          <Image style={styles.image} source={{uri:image}} />
        ) : (
          <ICON_CONSTANTS.Entypo
            name={'camera'}
            style={{fontSize: 32, alignSelf: 'center'}}
          />
        )}
      </TouchableOpacity>
    </>
  );
};

export default UploadCardImages;
