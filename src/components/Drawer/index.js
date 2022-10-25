import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import styles from './styles';
import { ICON_CONSTANTS as Icon, Strings, wp, IS_PAD } from '../../constants';
import useState from 'react-usestateref';
import {
  DrawerActions,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { logoutRequest, updateTestType } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Auth, DataStore } from 'aws-amplify';
import { LoaderContext } from '../../components/hooks';
import { closeDrawer, navigateReset } from '../../navigator/navigationRef';
import DeviceInfo from 'react-native-device-info';

const DrawerComponent = () => {
  const { setLoader } = useContext(LoaderContext);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.reducer.user);
  const navigation = useNavigation();
  const [isAdmin, setAdmin] = useState(true);
  const [name, setName] = useState('');

  const onDrawerItemPress = screen => {
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate(screen);
  };
  const handleNavigation = screen => {
    navigation.dispatch(DrawerActions.closeDrawer());
    navigateReset(screen);
  };
  const valueExist = (arr, values) => {
    var value = 0;
    values.forEach(function (word) {
      value = value + arr.includes(word);
    });
    return value === 1;
  };
  useFocusEffect(
    React.useCallback(() => {
      setAdmin(valueExist(user?.roles, ['Admins', 'Testers']));
      setName(`${user?.['custom:firstName']} ${user['custom:lastName']}`);
    }, [user]),
  );
  const logOutHandler = async () => {
    Alert.alert(Strings.alert, Strings.logOutConfirmation, [
      {
        text: Strings.cancel,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: Strings.yes,
        onPress: () => {
          setLoader(true);
          dispatch(logoutRequest(null, null));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
      <View style={styles.profileContainer}>
        <View style={styles.iconWrapper}>
          <Icon.AntDesign name="user" style={styles.profileIcon} />
        </View>
        <Text numberOfLines={1} style={styles.userNameText}>
          {`${user?.['custom:firstName']} ${user?.['custom:lastName']}`}
        </Text>
      </View>
      {valueExist(user?.roles, ['Admins', 'Testers']) && (
        <>
          <Text style={styles.switchText}>Switch Role</Text>
          <Switch
            style={styles.switch}
            onValueChange={() => {
              if (isAdmin) {
                setAdmin(false);
                // navigation.navigate('Main', { screen: 'MyQR' });
                closeDrawer()
                navigateReset('MyQR');
              } else {
                setAdmin(true);
                closeDrawer()
                navigateReset('Main');
              }
              // setAdmin(!isAdmin);
            }}
            value={isAdmin}
          />
        </>
      )}
      <View style={{ marginStart: IS_PAD ? wp(2) : wp(4), flex: 1 }}>
        {isAdmin ? (
          <>
            <DrawerListItem
              icon={'home'}
              name={Strings.eventConfiguration}
              onPress={() => {
                dispatch(updateTestType(null));
                handleNavigation('Main');
              }}
            // onPress={() => navigation.navigate('Main')}
            />
            <DrawerListItem
              IconType={Icon.SLIcon}
              icon={'speedometer'}
              name={Strings.rapidAntigenTest}
              onPress={() => handleNavigation('RapidAntigenTest')}
            />
            <DrawerListItem
              IconType={Icon.SLIcon}
              icon={'speedometer'}
              name={Strings.cueTestList}
              onPress={() => handleNavigation('CueTest')}
            />
            <DrawerListItem
              IconType={Icon.SLIcon}
              icon={'speedometer'}
              name={Strings.acculaTestList}
              onPress={() => handleNavigation('AcculaTests')}
            />
            <DrawerListItem
              icon={'database'}
              name={Strings.labTestList}
              onPress={() => handleNavigation('LabTest')}
            />
          </>
        ) : (
          <>
            <DrawerListItem
              icon={'home'}
              name={Strings.MyQRCODE}
              onPress={() => {
                handleNavigation('MyQR');
              }}
            />

            <DrawerListItem
              icon={'lock'}
              name={Strings.MyResult}
              onPress={() => {
                handleNavigation('MyResult');
              }}
            />
          </>
        )}
        <DrawerListItem
          onPress={logOutHandler}
          icon={'logout'}
          name={Strings.logOut}
        />
      </View>
      <Text
        style={styles.versionText}
      >{`Version: ${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`}</Text>
    </SafeAreaView>
  );
};

export default DrawerComponent;

const DrawerListItem = props => {
  const { icon, name, onPress, IconType } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.listItemContainer}>
      {IconType ? (
        <IconType name={icon} style={styles.listIcon} />
      ) : (
        <Icon.AntDesign name={icon} style={styles.listIcon} />
      )}

      <Text
        numberOfLines={1}
        style={[
          styles.listItemText,
          icon === 'logout' && { textDecorationLine: 'underline' },
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};
