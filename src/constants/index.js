import {Platform} from 'react-native';
import {
  height,
  width,
  IS_IPHONE_X,
  IS_IPHONE,
  wp,
  hp,
  IS_PAD,
} from './Dimensions';
import Colors from './Colors';
import Fonts from './Fonts';
import Strings from './Strings';
import IIcon from 'react-native-vector-icons/Ionicons';
import ADIcon from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {AWS_ENDPOINT, MED_FLOW_WALLET_URL} from './endpoints';

const App_Constants = {
  CONST_KEYBOARD_VERTICAL_OFFSET: Platform.OS === 'ios' ? 0 : -300,
  APP_LOGO:
    'https://medflow-images.s3.eu-west-1.amazonaws.com/safecamp_MD_white.png',
  CONSENT_FORM:
    'https://medflow-images.s3.eu-west-1.amazonaws.com/Consent+Form.pdf',
  NEGATIVE: 'Negative',
  POSITIVE: 'Positive',
  BAR_CODE: 'bar_code',
  QR_CODE: 'qr_code',
  safeCampCompanyId: 'a14eadef-d83e-41f2-9a85-77fc413906b2', // Amazon
  safeCampSiteId: 'a2a8e982-bad7-4e4e-9efc-2557ae1afa67', // David Show
  safeCampLabId: '5e1a1570-c167-40a0-8daa-efe6d3ccdb22', // Safe Camp Lab
};

const ICON_CONSTANTS = {
  IonIcons: IIcon,
  AntDesign: ADIcon,
  MCIcon: MCIcon,
  EvilIcon: EvilIcon,
  FAIcon: FAIcon,
  SLIcon: SLIcon,
  Entypo: Entypo,
  Fontisto: Fontisto,
};

const TestTypes = {
  ANTIGEN: 'Antigen',
  PCR: 'PCR',
  ACCULA: 'Other', //Other
  MOLECULAR: 'Molecular', //Molecular : Cue
  CUE: 'Molecular', //Molecular : Cue
  OTHER: 'Other',
};
export const UpdatedTestTypes = {
  ANTIGEN: 'Rapid Antigen',
  LAB: 'PCR',
  MOLECULAR: 'Cue',
  OTHER: 'Rapid PCR',
};

const TestStatus = {
  PROCESSED: 'Processed',
  PENDING: 'Pending',
  POSITIVE: 'Positive',
  NEW: 'New',
  SENT: 'Sent',
};

export {
  height,
  width,
  Colors,
  IS_IPHONE_X,
  App_Constants,
  Fonts,
  IS_IPHONE,
  IS_PAD,
  wp,
  hp,
  Strings,
  ICON_CONSTANTS,
  TestTypes,
  TestStatus,
  AWS_ENDPOINT,
  MED_FLOW_WALLET_URL,
};
