import React, {useEffect} from 'react';
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Colors, ICON_CONSTANTS, Strings, TestTypes} from '../../constants';
import styles from './styles';
import {DropDown, Button, NativePicker} from '../../components';
import {updateSelectedSite} from '../../store/actions/tests';
import {useSelector} from 'react-redux';
import useState from 'react-usestateref';
import {labFilter} from '../../store/util';
import dataStoreHelper from '../../utils/dataStoreHelper';

const EditConfiguration = ({
  open,
  onPress,
  onClose,
  isModalVisible,
  isTestDetails,
  test,
  isMulti,
  updateInfo,
}) => {
  const {clients, sites, labs} = useSelector(
    state => state.reducer.eventConfig,
  );
  const {eventData} = useSelector(state => state.reducer.printer);
  const [selected, setSelected] = useState(null);
  const [isEnable, setEnabled] = useState(false);
  const [selectedClient, setSelectedClient, clientRef] = useState(null);
  const [selectedSite, setSelectedSite, siteRef] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [labList, setLabList] = useState([]);

  const currentConfig = isMulti ? test[0] : test;

  useEffect(() => {
    // console.log('event data is: ', eventData)
    // console.log('current test is: ', currentConfig)
    // let currentConfig = isMulti ? test[0] : test
    setSelectedClient(clients.filter(c => c.id === currentConfig?.clientID)[0]);
    setSelectedSite(sites.filter(s => s.id === currentConfig?.siteID)[0]);
    setSelectedLab(labs.filter(l => l.id === currentConfig?.labID)[0]);
    fetchLabs(
      sites.filter(s => s.id === currentConfig?.siteID)[0],
    ).catch(e => {});
  }, []);

  const fetchLabs = async siteData => {
    let mLabs = [];
    if (siteData?.insurance_required) {
      mLabs = await dataStoreHelper.getLabsWithInsurance(true);
    } else {
      mLabs = await dataStoreHelper.getLabsWithInsurance(false);
    }

    mLabs = labFilter(clientRef.current?.id, siteRef.current.id, mLabs);
    setLabList(mLabs);
  };

  const onSavePressHandler = () => {
    console.log('test type check: ', currentConfig.test_type);

    if (
      eventData.clientID === selectedClient?.id &&
      eventData?.site?.id === selectedSite?.id
    ) {
      if (currentConfig.test_type !== 'PCR') {
        onClose();
        return;
      } else {
        if (!isMulti && currentConfig.labID === selectedLab?.id) {
          onClose();
          return;
        }
      }
    }

    if (selectedSite === null) {
      alert('Please select Show');
      return;
    } else if (
      currentConfig.test_type === TestTypes.PCR &&
      selectedLab == null
    ) {
      alert('Please select lab');
      return;
    }

    let updatedInfo = {
      siteID: selectedSite?.id,
      siteName: selectedSite?.name,
      clientID: selectedClient?.id,
      clientName: selectedClient?.name,
      labID: selectedLab?.id,
      labName: selectedLab?.name,
    };

    // console.log('updated info is: ', updatedInfo);

    if (currentConfig.test_type === 'PCR') {
      let onlyLabUpdated =
        eventData.clientID === selectedClient?.id &&
        eventData?.site?.id === selectedSite?.id;
      console.log('sending lab valye ', onlyLabUpdated);
      updateInfo(test, updatedInfo, onlyLabUpdated);
    } else {
      updateInfo(test, updatedInfo);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        {!isMulti && (
          <ICON_CONSTANTS.FAIcon
            name={'file-signature'}
            size={16}
            color={Colors.WHITE.primary}
            style={{marginRight: 5}}
          />
        )}
        <Text style={styles.textStyle}>
          {isMulti ? Strings.editConfig : Strings.EditConfiguration}
        </Text>
      </TouchableOpacity>

      {isModalVisible && (
        <Modal visible={isModalVisible} transparent={true}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.transparentView}></View>
          </TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={styles.closeIconBtn}>
              <TouchableOpacity onPress={onClose}>
                <ICON_CONSTANTS.AntDesign
                  name={'close'}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.headingText}>{Strings.EditConfiguration}</Text>
            <NativePicker
              label="Select Client..."
              data={clients}
              onSelect={item => {
                console.log('selected client is: ', item);
                setSelectedClient(item);
                setSelectedSite(null);
                setSelectedLab(null);
              }}
              selectedItem={selectedClient}
            />
            <NativePicker
              label="Select Show..."
              data={sites.filter(s => s.clientID === selectedClient.id)}
              onSelect={item => {
                // console.log('selected site is: ', item)
                setSelectedSite(item);
                setSelectedLab(null);
                fetchLabs(item);
              }}
              selectedItem={siteRef.current}
              // selectedItem={selectedSite}
            />
            {currentConfig.test_type === 'PCR' && (
              <NativePicker
                label="Select Lab..."
                // data={labFilter(selectedClient?.id, selectedSite.id, labs)}
                data={labList}
                // data={selectedSite ? labs : []}
                onSelect={item => {
                  setSelectedLab(item);
                }}
                selectedItem={selectedLab}
              />
            )}
            <Button
              title="Save"
              onPress={onSavePressHandler}
              disabled={
                currentConfig.test_type === TestTypes.PCR
                  ? !selectedSite || !selectedLab
                  : !selectedSite
              }
              buttonStyle={styles.buttonStyle}
            />
          </View>
        </Modal>
      )}
    </>
  );
};

export default EditConfiguration;
