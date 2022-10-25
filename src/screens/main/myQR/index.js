import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { AvoidKeyboard, Header } from '../../../components';
import { IS_PAD, Strings, wp, IS_IPHONE_X } from '../../../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import { LoaderContext } from '../../../components/hooks';
import { useSelector } from 'react-redux';
import { WalletPasses } from 'react-native-wallet-passes';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import SvgQRCode from 'react-native-qrcode-svg';

const MyQR = () => {
  const { user } = useSelector(state => state.reducer.user);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('123');
  const [email, setEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const getUser = async () => {
    setName(`${user?.['custom:firstName']} ${user['custom:lastName']}`);
    setLastName(`${user?.['custom:lastName']}`);
    setPhone(`${user?.phone_number.substring(2)}`);
    setEmail(`${user?.email}`);
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <SafeAreaView style={styles.container}>

      <Header title={Strings.MYQRCARD} />

      {/* <AvoidKeyboard> */}
      <View style={styles.nameInitialsContainer}>
        {name === '' && lastName === '' ? (
          <Text style={styles.nameInitials}>{Strings.UT}</Text>
        ) : (
          <Text style={styles.nameInitials}>
            {name.charAt(0)}
            {lastName.charAt(0)}
          </Text>
        )}
      </View>
      {name === '' ? (
        <Text style={[styles.nameText, styles.regularText]}>
          {Strings.UserTester}
        </Text>
      ) : (
        <Text style={[styles.nameText, styles.regularText]}>{name}</Text>
      )}

      {/* <View style={styles.qrImageContainer}>
          <Image
            source={require('../../../assets/qr.png')}
            style={styles.qrImageStyle}
          />
        </View> */}
      <View
        style={{
          ...styles.qrCon,
          marginTop: IS_PAD ? wp(8) : IS_IPHONE_X ? wp('11%') : wp('9%'),
        }}
      >
        <SvgQRCode value={phone} size={IS_PAD ? wp(37.5) : IS_IPHONE_X ? wp('55%') : wp('45%')} />
      </View>

      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'My Card',
            'Please present this QR code to a SafeCamp employee at your next testing event.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          )
        }
        style={styles.infoIconAndTextCOntainer}
      >
        <View style={styles.iconContainer}>
          <Icon
            name={'info'}
            size={IS_PAD ? wp(3) : 25}
            style={styles.iconColor}
          />
        </View>
        <Text style={styles.regularText}>{Strings.WhatismyQRCodefor}</Text>
      </TouchableOpacity>
      {/* {Platform.OS === 'ios' ? (
          <AddPassButton
            style={styles.addPassButton}
            addPassButtonStyle={PassKit.AddPassButtonStyle.black}
            onPress={async () => {
              setIsDownloading(true);
              const passKitResponse = await dataStoreHelper.applePksPassGenerator(
                name,
                email,
                phone,
              );
              setIsDownloading(false);
              if (passKitResponse !== null) {
                WalletPasses.canAddPasses().then(result => {
                  if (result) {
                    WalletPasses.addPass(passKitResponse)
                      .then(r => console.log('passkit : ', r))
                      .catch(err => console.log('print == ', err));
                  }
                });
              }
            }}
          />
        ) : null} */}
      {Platform.OS === 'ios' ? (
        <TouchableOpacity
          onPress={async () => {
            setIsDownloading(true);
            const passKitResponse = await dataStoreHelper.applePksPassGenerator(
              name,
              email,
              phone,
            );
            setIsDownloading(false);
            if (passKitResponse !== null) {
              WalletPasses.canAddPasses().then(result => {
                if (result) {
                  WalletPasses.addPass(passKitResponse)
                    .then(r => console.log('passkit : ', r))
                    .catch(err => console.log('print == ', err));
                }
              });
            }
          }}
          style={styles.addToWallet}
        >
          <View style={styles.fakeCardCon}>
            <Image
              source={require('../../../assets/wallet.png')}
              style={styles.walletImageStyle}
              resizeMode="stretch"
            />
          </View>

          <View>
            <Text style={[styles.regularText, styles.font12]}>
              {Strings.Addto}
            </Text>
            <Text style={[styles.regularText, styles.font16]}>
              {Strings.AppleWallet}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
      <View style={styles.flagImageContainer}>
        <Image
          source={require('../../../assets/safecamp_Flag.png')}
          style={styles.flagImageStyle}
        />
      </View>
      {/* </AvoidKeyboard> */}
    </SafeAreaView>
  );
};

export default MyQR;
