import React, {useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styles from './styles';
import {LoaderContext} from '../../../components/hooks';
import {
  AvoidKeyboard,
  Button,
  HeaderWithBack,
  TestConfirmation,
} from '../../../components';
import {
  App_Constants,
  ICON_CONSTANTS,
  Strings,
  wp,
  hp,
  IS_IPHONE,
  Colors,
} from '../../../constants';
import {Storage} from 'aws-amplify';
import Pdf from 'react-native-pdf';
import useState from 'react-usestateref';
import Signature from 'react-native-signature-canvas';
import {PDFDocument} from 'pdf-lib';
import {base64PdfForm} from '../../../assets/consentForm';
import {addSignToPdf, saveSignatue} from './helper';
import {saveEmployeeInfo} from '../../../store/actions/employeeInfo';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {updateTestType} from '../../../store/actions';
import {navigateReset} from '../../../navigator/navigationRef';
import {ScrollView} from 'react-native-gesture-handler';

const source = {
  uri: 'https://medflow-images.s3.eu-west-1.amazonaws.com/Consent+Form.pdf',
  cache: true,
};

const SignatureScreen = props => {
  const {navigation, route} = props;
  const {params} = route;
  const {setLoader} = useContext(LoaderContext);
  const dispatch = useDispatch();
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const {test} = useSelector(state => state?.reducer);
  const {employeeInfo} = useSelector(state => state?.reducer?.employee);
  const {lab, site, clientID} = useSelector(
    state => state?.reducer?.printer?.eventData,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [sign, setSign] = useState(null);
  const [isLoading, setLoading] = useState(null);
  const [path, setPath] = useState(null);
  const [buttonActive, setButtonActive] = useState(false);
  const [consentText, setConsentText] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [clientObj, setClientObj] = useState(null);
  const ref = useRef();

  useEffect(() => {
    getClientHippa();
  }, []);
  const handleSignature = async sign => {
    setSign(sign);
    setLoader(true);
    saveSignatue(sign, site?.id, employeeInfo?.id, callBack => {
      console.log('🚀 ~ file: index.js ~ line 64 ~ callBack', callBack);
      if (callBack) {
        console.log();
        params.isPattern
          ? updateEmployeePatternConsent(employeeInfo?.id, site?.id)
          : updateEmployeeConsent(employeeInfo?.id, site?.id);
      } else {
        setLoader(false);
        alert('Something went wrong. Please try again.');
      }
    });

    addSignToPdf(sign, path => {
      console.log('file saved at path: ', path);
      setPath(path);
    }).catch(e => console.log('file path error', e));
  };
  const updateEmployeePatternConsent = async (employeeId, siteID) => {
    // let employeeUpdated = await dataStoreHelper.updateEmployeePatternConsent(
    //   employeeId,
    //   siteID,
    // );
    setLoader(false);
    // if (employeeUpdated) {
    navigation.navigate('Questions', {...params});
    // }
  };
  const updateEmployeeConsent = async (employeeId, siteID) => {
    let employeeUpdated = await dataStoreHelper.updateEmployeeHippaConsent(
      employeeId,
      siteID,
    );
    if (employeeUpdated) {
      let employeeDemographic = await dataStoreHelper.getDemoGraphicData(
        employeeUpdated,
      );
      dispatch(saveEmployeeInfo(employeeDemographic));
      checkInsuranceCard(employeeDemographic);
    } else {
      setLoader(false);
      Alert.alert(
        '',
        'We cannot process this request at the moment. Please try to enter record manually and "Add New" record',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('FormInput'),
            style: 'cancel',
          },
        ],
      );
    }
  };

  const checkInsuranceCard = async data => {
    if (site?.sendInsuranceCard) {
      setLoader(false);
      navigation.navigate('InsuranceCardImages', {
        createNewTest: params?.createNewTest,
      });
    } else {
      if (test.testType) {
        let availableBarCode = null;
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
              patternConsent(data, availableBarCode);
            } else {
              createTest(data, availableBarCode);
            }
          } else if (!lab?.tubes_provided) {
            setLoader(false);
            navigation.navigate('Scanner', {
              createNewTest: params?.createNewTest,
              testType: Strings.pcr,
              selectedTests: [
                {label: 'PCR', value: Strings.pcr, selected: true},
              ],
            });
          }else{
            if (site?.patternTesting) {
              patternConsent(data, availableBarCode);
            } else {
              createTest(data, availableBarCode);
            }
          }
        } else {
          if (site?.patternTesting && test.testType == Strings.pcr) {
            patternConsent(data, availableBarCode);
          } else {
            createTest(data, availableBarCode);
          }
        }
      } else {
        setLoader(false);
        navigation.navigate('TestSelection', {
          createNewTest: params?.createNewTest,
        });
      }
    }
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
    params?.createNewTest(
      test.testType,
      data,
      availableBarCode?.barcode ? availableBarCode?.barcode : null,
      null,
      null,
      false,
      result => {
        if (result) {
          setLoader(false);
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

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const testFunc = async () => {
    const pdfDoc = await PDFDocument.load(base64PdfForm);
    const pages = pdfDoc.getPages();

    console.log('pages are: ', pages);
    console.log('page 0: ', pages[0]);
  };

  const getClientHippa = async () => {
    const hippaText = await dataStoreHelper.getClientHippa(clientID);
    console.log('hippa test is: ', hippaText);
    if (hippaText) {
      if (hippaText.hippaFile) {
        const pdfU = await Storage.get(hippaText.hippaFile);
        console.log('hippa pfu file is: ', pdfU);
        if (pdfU) {
          setPdfUrl(pdfU);
        }
      }
      setClientObj(hippaText);
      setConsentText(hippaText?.hippa);
    } else {
      setConsentText('');
    }
  };

  const _rendarPDFModal = () => {
    return (
      <Modal
        trustAllCerts={false}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {/* <Pdf
            trustAllCerts={false}
            source={
              params.isPattern
                ? {uri: source.uri}
                : path
                ? {uri: path}
                : IS_IPHONE
                ? require('../../../assets/ConsentForm.pdf')
                : {uri: App_Constants.CONSENT_FORM, cache: true}
            }
            minScale={1.0}
            maxScale={2.5}
            style={{flex: 1, backgroundColor: 'white', marginTop: 20}}
          /> */}
          {params.isPattern ? (
            <Pdf
              trustAllCerts={false}
              source={{uri: path ? path : source.uri, cache: true}}
              minScale={1.0}
              maxScale={2.5}
              style={{
                flex: 1,
                backgroundColor: Colors.WHITE.default,
                marginTop: 20,
              }}
            />
          ) : pdfUrl ? (
            <Pdf
              trustAllCerts={false}
              source={{uri: pdfUrl, cache: true}}
              minScale={1.0}
              maxScale={2.5}
              style={{
                flex: 1,
                backgroundColor: Colors.WHITE.default,
                marginTop: 20,
              }}
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{height: hp(20)}}
            >
              <Text style={styles.hippaText}>{consentText}</Text>
            </ScrollView>
          )}

          <View style={styles.bottomView}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{...styles.textStyle, paddingHorizontal: 20}}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
        <SafeAreaView />
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <HeaderWithBack
        onRightBtnPress={() => setModalVisible(true)}
        rightText={'Read'}
        title={params.isPattern ? Strings.patternConsent : Strings.hippaConsent}
      />
      {/*<AvoidKeyboard>*/}

      {_rendarPDFModal()}

      <View style={styles.topView}>
        {/* <Pdf
          trustAllCerts={false}
          // source={
          //   params.isPattern
          //     ? {uri: source.uri}
          //     : IS_IPHONE
          //     ? require('../../../assets/ConsentForm.pdf')
          //     : {uri: App_Constants.CONSENT_FORM, cache: true}
          // }
          source={params.isPattern ? {uri: source.uri} : {uri: pdfUrl}}
          scale={2.0}
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE.default,
            marginTop: 20,
          }}
        /> */}
        {params.isPattern || pdfUrl ? (
          <Pdf
            trustAllCerts={false}
            source={{uri: params.isPattern ? source.uri : pdfUrl, cache: true}}
            scale={2.0}
            style={{
              flex: 1,
              backgroundColor: Colors.WHITE.default,
              marginTop: 20,
            }}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.hippaText}>{consentText}</Text>
          </ScrollView>
        )}
      </View>

      <View style={styles.rowContainer}>
        <ICON_CONSTANTS.FAIcon
          style={styles.signIcon}
          name={'file-signature'}
          type="FontAwesome5"
        />
        <Text style={{fontSize: 20, color: 'white', marginStart: 5}}>
          Signature
        </Text>
      </View>
      <View style={styles.signatureContainer}>
        <Signature
          ref={ref}
          onOK={handleSignature}
          onEmpty={() => alert('Please add signature')}
          descriptionText="Sign"
          clearText="Clear"
          confirmText="Confirm"
          autoClear={true}
          bgWidth={5}
          webStyle={styles.canvasWebStyle}
          // webStyle={style}
          // onBegin={() => {
          //   setIsBegin(true)
          // }}
        />

        <Pressable
          onPress={handleClear}
          style={[styles.blueButton, styles.clearButton]}
        >
          <Text
            style={{
              color: 'white',
            }}
          >
            Clear
          </Text>
        </Pressable>
      </View>

      <Button
        title={Strings.next}
        loading={displayConfirmation}
        disabled={buttonActive}
        onPress={() => {
          setButtonActive(true);
          setTimeout(() => {
            setButtonActive(false);
          }, 300);
          ref.current.readSignature();

          // setTimeout(() => {
          //   setLoader(false);
          // }, 6000);
        }}
      />
      {/*</AvoidKeyboard>*/}
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

export default SignatureScreen;
