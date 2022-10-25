import React, {useState, useContext} from 'react';
import {
  View,
  Modal,
  Alert,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  Button,
  Header,
  UploadCardImages,
  UploadImageModal,
  TestConfirmation,
} from '../../../components';
import {LoaderContext} from '../../../components/hooks';
import styles from './styles';
import {saveEmployeeInfo} from '../../../store/actions/employeeInfo';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {navigate, navigateReset} from '../../../navigator/navigationRef';
import {updateTestType} from '../../../store/actions';
import {hp, Strings} from '../../../constants';

const InsuranceCardImages = props => {
  const {navigation, route} = props;
  const [showModal, setShowModal] = useState(false);
  const [frontSide, setFrontSide] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const {setLoader} = useContext(LoaderContext);
  const dispatch = useDispatch();
  const {test} = useSelector(state => state.reducer);
  const {employeeInfo} = useSelector(state => state?.reducer?.employee);
  const {lab, site} = useSelector(state => state?.reducer?.printer?.eventData);

  const canMoveForward = () => {
    return frontImage && backImage;
  };
  const storeImageAndNavigate = async () => {
    setLoader(true);
    dataStoreHelper.uploadInsuranceCard(
      employeeInfo?.id,
      site?.id,
      frontImage,
      backImage,
      async response => {
        let availableBarCode = null;

        if (response.status) {
          let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
            response.updatedEmployee,
          );
          dispatch(saveEmployeeInfo(employeeDemographic));

          if (test.testType) {
            if (
              test.testType == Strings.pcr
              // &&
              // (lab?.tubes_provided || lab?.barCodeProvided)
            ) {
              if (lab?.barCodeProvided) {
                availableBarCode = await dataStoreHelper.getAvailableBarcod(
                  lab?.id,
                );

                if (availableBarCode == null) {
                  setLoader(false);
                  alert(
                    'No available barcode in this lab. Please select any other lab or wait for some time.',
                  );
                  return;
                }
                if (site?.patternTesting) {
                  patternConsent(employeeDemographic, availableBarCode);
                } else {
                  createTest(employeeDemographic, availableBarCode);
                }
              } else if (!lab?.tubes_provided) {
                setLoader(false);
                navigation.navigate('Scanner', {
                  createNewTest: route?.params?.createNewTest,
                  testType: Strings.pcr,
                  selectedTests: [
                    {label: 'PCR', value: Strings.pcr, selected: true},
                  ],
                });
              } else {
                if (site?.patternTesting && test.testType == Strings.pcr) {
                  patternConsent(employeeDemographic, availableBarCode);
                } else {
                  createTest(employeeDemographic, availableBarCode);
                }
              }
            } else {
              if (site?.patternTesting && test.testType == Strings.pcr) {
                patternConsent(employeeDemographic, availableBarCode);
              } else {
                createTest(employeeDemographic, availableBarCode);
              }
            }
          } else {
            setLoader(false);
            navigation.navigate('TestSelection', {
              createNewTest: route?.params?.createNewTest,
            });
          }
        } else {
          setLoader(false);
          alert(response.message);
        }
      },
    );
  };

  const patternConsent = (data, availableBarCode) => {
    Alert.alert(Strings.alert, Strings.patternTestAlert, [
      {
        text: Strings.no,
        onPress: () => createTest(data, availableBarCode),
        style: 'cancel',
      },
      {
        text: Strings.yes,
        onPress: async () => onPatternPress(),
      },
    ]);
  };

  const createTest = async (data, availableBarCode) => {
    route?.params?.createNewTest(
      test.testType,
      data,
      availableBarCode?.barcode ? availableBarCode?.barcode : null,
      null,
      null,
      false,
      result => {
        setLoader(false);
        if (result) {
          setDisplayConfirmation(true);
          setTimeout(() => {
            setDisplayConfirmation(false);
            dispatch(updateTestType(null));
            // navigateReset('Home');
            navigationToRespectiveScreen(test.testType);
          }, 3000);
        } else {
          setLoader(false);
        }
      },
    );
  };
  const navigationToRespectiveScreen = type => {
    if (type === Strings.pcr) {
      navigateReset('StartTest');
    } else if (type === Strings.antigen) {
      navigateReset('RapidAntigenTest');
    } else if (type === Strings.molecular) {
      navigateReset('CueTest');
    } else if (type === Strings.other) {
      navigateReset('AcculaTests');
    }
  };

  const onPatternPress = async () => {
    let patternList = await employeeInfo?.patternConsent;
    let isExistSiteId = false;
    if (patternList) {
      patternList.map(obj => {
        const mObj = JSON.parse(obj);
        if (mObj[site?.id]) {
          isExistSiteId = true;
        }
      });
    }
    setLoader(false);
    if (isExistSiteId) {
      navigation.navigate('Questions', {
        ...route?.params,
        isPattern: true,
        testTypes: [{label: 'PCR', value: Strings.pcr, selected: true}],
      });
    } else {
      navigation.push('Signature', {
        ...route?.params,
        isPattern: true,
        testTypes: [{label: 'PCR', value: Strings.pcr, selected: true}],
      });
    }
  };

  const selectImage = () => {
    let options = {
      title: 'You can choose one image',
      noData: true,
      maxWidth: 256,
      maxHeight: 256,
      quality: 0.9,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      console.log('respaqwehiqwuhqui; ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
        Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let source = {uri: response.assets[0].uri};
        frontSide ? setFrontImage(source.uri) : setBackImage(source.uri);
        console.log('Image source.uri ::::::: ', source.uri);
        // console.log('gallery image response', JSON.stringify(response));
        // console.log({source});
      }
    });
  };

  const openCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 256,
      maxHeight: 256,
      quality: 0.9,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri};
        frontSide ? setFrontImage(source.uri) : setBackImage(source.uri);
        // console.log('camera image response', JSON.stringify(response));
      }
    });
  };
  const PermissionsCheck = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Access',
          message: 'SafeCamp would like to access your CAMERA!',
        },
      );
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
      } else {
        openCamera();
      }
    } else {
      openCamera();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header
        isInsurance
        onPressRightIcon={() => navigation.goBack()}
        title={'Capture'}
        subHeader="Insurance Card Images"
      />
      <UploadCardImages
        title="Front"
        onPress={() => {
          setFrontSide(true);
          setShowModal(true);
        }}
        image={frontImage}
      />
      <UploadCardImages
        title="Back"
        onPress={() => {
          setFrontSide(false);
          setShowModal(true);
        }}
        image={backImage}
      />
      <View style={{marginTop: hp(5)}}>
        <Button
          disabled={!canMoveForward()}
          title="NEXT"
          buttonStyle={{borderRadius: 10, width: '80%'}}
          onPress={storeImageAndNavigate}
          loading={displayConfirmation}
        />
      </View>

      <UploadImageModal
        onOpen={showModal}
        onClose={() => setShowModal(false)}
        onPress={() => {
          setShowModal(false);
          setTimeout(() => {
            selectImage();
          }, 300);
        }}
        openCamera={() => {
          setShowModal(false);
          setTimeout(() => {
            PermissionsCheck();
          }, 300);
        }}
      />
      <TestConfirmation
        display={displayConfirmation}
        setDisplay={setDisplayConfirmation}
        message={`Your ${
          test?.testType ? dataStoreHelper.getTypeString(test?.testType) : ''
        } test label has been printed.`}
      />
    </View>
  );
};

export default InsuranceCardImages;
