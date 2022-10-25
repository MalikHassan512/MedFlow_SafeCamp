import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Button, Header, DropDown} from '../../../components';
import useState from 'react-usestateref';
import {Strings, ICON_CONSTANTS} from '../../../constants';
import Global from '../../../constants/Global';
import { ScreensName } from '../../../constants/Strings';
import { navigate, navigateReset } from '../../../navigator/navigationRef';

const StartTest = props => {
  const {navigation} = props;

  useEffect(() => {
    Global.currentScreen = ScreensName.EVENT
  })
  const scanHandler = () => {
    // navigation.navigate('Main', {screen: 'Scanner'});
    navigate('Scanner')
    // navigation.navigate('Scanner');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header />

      <View style={styles.subContainer}>
        <Text style={styles.headingText}>{Strings.startTesting}</Text>

        <TouchableOpacity onPress={scanHandler} style={styles.camButton}>
          <ICON_CONSTANTS.AntDesign name={'camera'} style={styles.camIcon} />
        </TouchableOpacity>

        <Button
          onPress={() =>{
            // navigation.navigate("Main",{screen:'FormInput'})}
            navigation.navigate("FormInput")
          }} 
          // onPress={() => navigation.navigate('Signature')}
          title={Strings.skip}
        />
      </View>
    </View>
  );
};

export default StartTest;
