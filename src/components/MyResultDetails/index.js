import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Modal,
  Platform,
} from 'react-native';
import Share from 'react-native-share';
import styles from './styles';
import DataStoreHelper from '../../utils/dataStoreHelper';
import {useSelector} from 'react-redux';
import {getAge, convertIntoPdfFile} from '../../utils/convertPdf';
import {Colors, ICON_CONSTANTS, IS_IPHONE, Strings} from '../../constants';
import {Storage} from 'aws-amplify';
import Pdf from 'react-native-pdf';
import {Header} from '../../components';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
//
import {WebView} from 'react-native-webview';

const MyResultDetails = ({item, clients}) => {
  ///
  let labLogoPath = '';
  const [labLogo, setLabLogo] = useState('');
  const {labs} = useSelector(state => state.reducer.eventConfig);
  const [pdfsBarcode, setPdfsBarcode] = useState();
  const [viewingPdf, setViewingPdf] = useState(false);
  const [pdfPath, setPdfPath] = useState({});
  const [file, setFile] = useState({});
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // console.log(item.status);
  const result = () => {
    const data = clients.filter(client => client?.id === item.clientID);

    // if (item.status !== 'Processed') {
    //   return 'Processing';
    // }

    return item?.result && item?.result !== undefined && item?.result !== ''
      ? item?.result === 'Positive'
        ? data[0]?.resultType === 'P/F'
          ? 'Fail'
          : 'Positive'
        : data[0]?.resultType === 'P/F'
        ? item.result === 'Negative'
          ? 'Pass'
          : item?.result.charAt(0).toUpperCase() + item.result.slice(1)
        : item.result === 'Negative'
        ? 'Negative'
        : item?.result.charAt(0).toUpperCase() + item?.result.slice(1)
      : 'Processing';
  };

  const buildPDF = async item => {
    let testsLab = labs.find(lab => lab.id === item.labID);
    let demos =
      typeof item.employee_demographics === 'string'
        ? JSON.parse(item.employee_demographics)
        : item.employee_demographics;
    let age = getAge(demos);
    setPdfsBarcode(item.barcode);
    setViewingPdf(true);
    try {
      let whiteBG = '';

      // console.log('printFile11 - > ', testsLab, labLogoPath, demos, item, age);

      let file = await convertIntoPdfFile(
        testsLab,
        labLogoPath,
        demos,
        item,
        age,
      );
      // console.log('printFile - > ', file);
      setPdfPath({uri: file.filePath});
      // let f = file.filePath.replace(/.*\/Documents\//, '');
      setFile(file.filePath);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setViewingPdf(false);
      alert('Unfortunately, this PDF is not viewable.');
    }
  };

  const requestStoragePermission = async item => {
    try {
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Write Storage Permission',
          message: "MedFlow needs to be able to write to phone's storage.",
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read Storage Permission',
          message: "MedFlow needs to be able to read phone's storage.",
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (
        granted1 === PermissionsAndroid.RESULTS.GRANTED &&
        granted2 === PermissionsAndroid.RESULTS.GRANTED
      ) {
        // console.log("You can use the camera");
        buildPDF(item);
      } else {
        // console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.container}>
            <View>
              <Text numberOfLines={1} style={styles.text}>{`Date: ${new Date(
                item.createdAt,
              ).toDateString()}`}</Text>
              <Text
                numberOfLines={1}
                style={styles.text}
              >{`Show: ${item.site_name}`}</Text>
              <Text
                numberOfLines={1}
                style={styles.text}
              >{`Tester: ${item.tester_name}`}</Text>

              <Text numberOfLines={1} style={styles.text}>{`Test type: ${
                item.test_type !== null
                  ? item.test_type === 'Other'
                    ? 'Accula/Rapid PCR'
                    : item.test_type === 'Antigen'
                    ? 'Rapid Antigen'
                    : item.test_type === 'Molecular'
                    ? 'Cue'
                    : item.test_type
                  : '-'
              }`}</Text>
              <Text
                numberOfLines={1}
                style={styles.text}
              >{`Sequence Number: ${item.sequenceNo}`}</Text>
              <Text
                numberOfLines={1}
                style={styles.text}
              >{`Barcode: ${item.barcode}`}</Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.text,
                  styles.statusColor,
                  item.result === 'Negative' && styles.negativeResultText,
                  item.result === 'Positive' && styles.positiveResultText,
                ]}
              >
                <Text style={styles.text}>Result:</Text>
                {` ${result()}`}
              </Text>
            </View>
          </View>

          {(item?.result === 'Negative' || item?.result === 'Positive') && (
            <TouchableOpacity
              onPress={async () => {
                const lab = await DataStoreHelper.getLabByID(item?.labID);
                if (lab?.logo) {
                  const imagePath = await Storage.get(lab?.logo);
                  labLogoPath = imagePath;
                  setLabLogo(imagePath);
                }
                IS_IPHONE ? buildPDF(item) : requestStoragePermission(item);
              }}
            >
              <Text style={[styles.text, styles.ViewText]}>{Strings.View}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {viewingPdf && (
        <Modal animationType="slide" visible={viewingPdf}>
          <View style={styles.pdfContainer}>
            <View style={styles.pdfHeader}>
              <View style={styles.IconsContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setViewingPdf(false);
                    setPdfLoading(false);
                    setFile({});
                  }}
                >
                  <Icon
                    size={32}
                    name={'arrow-back-outline'}
                    color={Colors.PINK.default}
                  />
                </TouchableOpacity>

                <Entypo
                  name={'share-alternative'}
                  size={28}
                  color={Colors.PINK.default}
                  onPress={() => {
                    Share.open({
                      url:
                        Platform.OS == 'ios'
                          ? pdfPath.uri
                          : `file://${pdfPath.uri}`,
                      title: 'Download PDF',
                    }).then();
                  }}
                />
              </View>
            </View>

            <Pdf
              trustAllCerts={false}
              source={{uri: file, cache: false}}
              minScale={1.0}
              maxScale={2.5}
              style={{flex: 1, backgroundColor: 'white'}}
              onLoadComplete={() => {
                setPdfLoading(true);
              }}
            />
            {/* <PDFView
            fadeInDuration={500.0}
            style={{flex: 1}}
            resource={file}
            resourceType={'file'}
            onLoad={() => console.log(`PDF rendered from file`)}
            onError={error => console.log('Cannot render PDF', error)}
          /> */}
          </View>
        </Modal>
      )}
    </>
  );
};

export default MyResultDetails;
