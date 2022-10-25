import React, {useEffect, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  Alert,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styles from './styles';
import {Button, Header, DropDown, NativePicker} from '../../../components';
import useState from 'react-usestateref';
import {App_Constants, Strings} from '../../../constants';
import {useSelector, useDispatch} from 'react-redux';
import printerHelper from '../../../utils/printerHelper';
import api from '../../../utils/api';
import {LoaderContext} from '../../../components/hooks';
import crashlytics from '@react-native-firebase/crashlytics'
//ReduxActions
import AsyncStorage from '@react-native-async-storage/async-storage';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {
  updateSelectedSite,
  updatePrinter,
  updateEventData,
  updateClients,
  updateLabs,
  updateSites,
  updateTestSettings,

  //
  printerRequest,
  printerRequestSuccess,
  printerRequestFailure,
} from '../../../store/actions';
import {labFilter} from '../../../store/util';
import {navigateReset, openDrawer} from '../../../navigator/navigationRef';
import Global from '../../../constants/Global';
import {ScreensName} from '../../../constants/Strings';
import Utilits from '../../../utils/utilityMethods';
let printerId = '';

const EventConfig = props => {
  const {navigation} = props;
  const [greeting, setGreeting] = useState('');
  const [name, setName] = useState('');
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [isEnable, setEnabled] = useState(true);
  const [pickerData, setPickerData, pikerDataRef] = useState({
    clients: [],
    sites: [],
    labs: [],
    company: null,
    site: null,
    lab: null,
  });
  const dispatch = useDispatch();
  const storeState = useSelector(state => state.reducer);

  const {user} = useSelector(state => state.reducer.user);

  const testFunc = async () => {
    let models = await dataStoreHelper.getAllSites();
    dispatch(updateSites(models));

    const labs = await dataStoreHelper.getLabs();
    dispatch(updateLabs(labs));
  };
  useEffect(() => {
    if (selectedPrinter?.value) {
      // onPrinterClick();
    }
  }, [selectedPrinter?.value]);

  useEffect(() => {
    testFunc().catch(e => console.log(e));

    getTestSettings();
    getClients();
    getEventData();
    getPrinters();
    getGreeting();

    checkBluetooth();
    getUser();
    Global.currentScreen = ScreensName.EVENT;
  }, []);
  useEffect(() => {
    checkFields();
  }, [pickerData?.lab, pickerData?.site, pickerData?.company, selectedPrinter]);

  const checkBluetooth = () => {
    // dispatch(printerRequest('printerId'));
    printerHelper.getBluetoothState(printerId, async data => {
      if (data.isSuccess) {
        data.printerList.map(updateSelectedPrinter);
        setPrinters(data.printerList);
      }
    });
  };

  const getEventData = async () => {
    let data = await AsyncStorage.getItem(Strings.eventConfigData);
    if (data) {
      data = JSON.parse(data);
      dispatch(updateEventData(data));
      let clientsData = await dataStoreHelper.getClients();
      clientsData.map(async item => {
        if (item.id == data.clientID) {
          let sitesData = await dataStoreHelper.getSitesByClient(item.id);

          let labsData = null;
          if (data?.site?.insurance_required) {
            labsData = await dataStoreHelper.getLabsWithInsurance(true);
          } else {
            labsData = await dataStoreHelper.getLabsWithInsurance(false);
          }
          // let labsData = await dataStoreHelper.getLabs();
          let fLabs = labFilter(item.id, data.site.id, labsData);

          setPickerData({
            ...pickerData,
            clients: clientsData,
            sites: sitesData,
            labs: fLabs,
            company: item,
            lab: data.lab,
            site: data.site,
          });
          setTimeout(() => {
            updateSavedConfiguration(data, item, sitesData, labsData);
          }, 2000);
        }
      });
    }
  };
  const updateSavedConfiguration = (data, client, sitesData, labsData) => {
    let siteInfo = null;
    let labInfo = null;
    if (sitesData) {
      siteInfo = sitesData.find(site => site?.id === data?.site?.id);
    }
    if (labsData) {
      labInfo = labsData.find(lab => lab?.id === data?.lab?.id);
    }
    if (data && client && siteInfo && labInfo) {
      updateEventConfig(client.id, client.name, siteInfo, labInfo);
    }
  };

  const getTestSettings = async () => {
    let testTypes = await dataStoreHelper.getAllTestTypes();
    dispatch(updateTestSettings(testTypes));
  };

  const getClients = async () => {
    let models = await dataStoreHelper.getClients();
    dispatch(updateClients(models));
    setPickerData({...pickerData, clients: models});
  };
  const updateSelectedPrinter = data => {
    if (data?.value?.connectionSettings?.identifier === printerId) {
      // setSelectedPrinter(printer)
      setSelectedPrinter({
        name: data?.value?.connectionSettings?.identifier,
        value: data?.value,
      });
      dispatch(updatePrinter(data?.value));
    }
  };
  const getPrinters = async () => {
    AsyncStorage.getItem(Strings.selectedPrinter).then(data => {
      if (data !== null) {
        let printerData = JSON.parse(data);
        printerId = printerData;
      }
    });
  };
  const getUser = async () => {
    setName(user?.['custom:firstName'] ? user['custom:firstName'] : '');
  };

  const getStoreData = () => {};

  const getGreeting = () => {
    const date = new Date();
    const current_hour = date.getHours();
    if (current_hour >= 4 && current_hour < 12) {
      setGreeting('morning');
    } else if (current_hour >= 12 && current_hour <= 17) {
      setGreeting('afternoon');
    } else {
      setGreeting('evening');
    }
  };

  const startTestHandler = () => {

    if (pickerData?.lab == null || selectedPrinter == null) {
      Alert.alert('', Strings.configrationRemaingAlert, [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            openDrawer();
          },
        },
      ]);
    } else {
      navigateReset('StartTest');
    }
    // let arr 
    // console.log(arr[2])
    // crashlytics().log("SAFE CAMP MD 24/7")
    // crashlytics().crash()
  };

  const onPrinterClick = () => {
    if (selectedPrinter?.value) {
      printDemo(selectedPrinter?.value, Strings.printerConnectSuccess);
    } else {
      Alert.alert('', Strings.selectPrinter, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }
  };

  const printDemo = (value, message) => {
    printerHelper.printTest(value, name, message);
  };

  const selectAPrinter = async data => {
    if (data?.value?.connectionSettings?.identifier) {
      setSelectedPrinter(data);
      dispatch(updatePrinter(data?.value));

      let printerData = JSON.stringify(
        data.value.connectionSettings.identifier,
      );
      await AsyncStorage.setItem(Strings.selectedPrinter, printerData);
    }
    // onPrinterClick();
    // setSelectedPrinter(data);
    // dispatch(updatePrinter(data.value));
    // let printerData = JSON.stringify(data.value.connectionSettings.identifier);
    // await AsyncStorage.setItem(Strings.selectedPrinter, printerData);
  };

  const fetchSitesByClient = async item => {
    const models = await dataStoreHelper.getSitesByClient(item.id);
    if (models.length === 1) {
      await fetchLabs(1, models, item);
    } else {
      setPickerData({
        ...pickerData,
        company: item,
        labs: [],
        sites: models,
        site: null,
        lab: null,
      });
      await updateEventConfig(item?.id, item?.name, null, null);
    }
  };
  const fetchLabs = async (length, siteData, selectedCompany) => {
    let labs = [];
    if (siteData?.insurance_required) {
      labs = await dataStoreHelper.getLabsWithInsurance(true);
    } else {
      labs = await dataStoreHelper.getLabsWithInsurance(false);
    }

    let sCompany = selectedCompany ? selectedCompany : pickerData?.company;
    let sSite = siteData?.length > 0 ? siteData[0] : pikerDataRef.current?.site;

    labs = labFilter(sCompany.id, sSite.id, labs);

    if (length === 1) {
      setPickerData({
        ...pickerData,
        labs: labs,
        lab: labs.length === 1 ? labs[0] : null,
        sites: siteData,
        site: siteData[0],
        company: selectedCompany,
      });
      updateEventConfig(
        selectedCompany?.id,
        selectedCompany?.name,
        siteData[0],
        labs.length === 1 ? labs[0] : null,
      );
    } else {
      setPickerData({
        ...pickerData,
        labs: labs,
        site: siteData,
        lab: labs.length === 1 ? labs[0] : null,
      });
      updateEventConfig(
        pickerData?.company?.id,
        pickerData?.company?.name,
        siteData,
        labs.length === 1 ? labs[0] : null,
      );
    }
  };

  const checkFields = () => {
    if (
      pickerData?.company == null ||
      pickerData?.site == null
      // ||
      // pickerData?.lab == null ||
      // selectedPrinter == null
    ) {
      setEnabled(true);
    } else {
      setEnabled(false);
      saveEventConfig();
    }
  };

  const updateEventConfig = async (clientId, clientName, site, lab) => {
    let data = {
      clientID: clientId,
      clientName: clientName,
      site: site,
      lab: lab,
    };
    dispatch(updateEventData(data));
    setTimeout(() => {
      updateSavedConfiguration(
        data,
        {id: data.clientID, name: data.clientName},
        pickerData.sites,
        pickerData.labs,
      );
    }, 2000);
    data = JSON.stringify(data);
    await AsyncStorage.setItem(Strings.eventConfigData, data);
  };

  const saveEventConfig = async () => {
    let data = {
      clientID: pickerData?.company?.id,
      clientName: pickerData?.company?.name,
      site: pickerData?.site,
      lab: pickerData?.lab,
    };
    dispatch(updateEventData(data));
    setTimeout(() => {
      updateSavedConfiguration(
        data,
        {id: data.clientID, name: data.clientName},
        pickerData.sites,
        pickerData.labs,
      );
    }, 2000);

    data = JSON.stringify(data);
    await AsyncStorage.setItem(Strings.eventConfigData, data);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header onPrinterPress={() => onPrinterClick()} />

      <View style={styles.subContainer}>
        <Text style={styles.headingText}>{Strings.eventConfiguration}</Text>
        <Text style={styles.subHeadingText}>
          Good {greeting}
          {name !== '' && `, ${name}`}
        </Text>

        <View style={{marginVertical: 30, zIndex: 10}}>
          <NativePicker
            label="Select Client..."
            data={pickerData.clients}
            key={pickerData.clients}
            onSelect={item => {
              fetchSitesByClient(item, true, null);
            }}
            selectedItem={pickerData.company}
          />
          <NativePicker
            label="Select Show..."
            // key={pickerData.sites}
            data={pickerData.sites}
            onSelect={item => {
              setPickerData({...pickerData, site: item});
              dispatch(updateSelectedSite({site: item}));
              fetchLabs('siteSelect', item);
            }}
            selectedItem={pickerData.site}
          />
          <NativePicker
            label="Select Lab..."
            // key={pickerData.labs}
            data={pickerData.labs}
            onSelect={item => {
              setPickerData({...pickerData, lab: item});
              updateEventConfig(
                pikerDataRef.current.company.id,
                pikerDataRef.current.company.name,
                pikerDataRef.current.site,
                item,
              );
            }}
            selectedItem={pickerData.lab}
          />
          <NativePicker
            label={'Select Printer...'}
            selectedItem={selectedPrinter}
            data={printers}
            onSelect={item => {
              if (item.name) {
                selectAPrinter(item);
                printDemo(item.value, Strings.printerConnectSuccess);
              }
            }}
            // onSelect={selectAPrinter}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            // printerHelper.discoverPrinters(printerId, async data => {
            //   if (data.isSuccess) {
            //     data.printerList.map(updateSelectedPrinter);
            //     setPrinters(data.printerList);
            //   }
            // })
            checkBluetooth();
          }}
        >
          <Text style={styles.linkText}>{Strings.discoverPrinter}</Text>
        </TouchableOpacity>
        <Button
          onPress={() => startTestHandler()}
          disabled={isEnable}
          title={Strings.next}
        />
      </View>
    </View>
  );
};

export default EventConfig;
