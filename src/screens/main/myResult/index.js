import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {Colors, ICON_CONSTANTS, Strings} from '../../../constants';
import {Header, MyResultDetails} from '../../../components';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import dataStoreHelper from '../../../utils/dataStoreHelper';
import {LoaderContext} from '../../../components/hooks';
import {useSelector} from 'react-redux';

const MyResult = ({route}) => {
  // console.log(route?.params?.removeDuplicateValue);
  const navigation = useNavigation();
  const {user} = useSelector(state => state.reducer.user);
  const [listData, setListData] = useState([]);
  const [filterListData, setFilterListData] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clear, setClear] = useState(false);

  const getUserTestResults = async () => {
    setLoading(true);
    let getlist = await dataStoreHelper.getUserTestResults(user);
    setListData(getlist.list);
    setFilterListData(getlist.newList);
    setClear(getlist.clear);
    setLoading(false);
  };

  const filteredData = async () => {
    const showTestList = Array.from(
      new Set(
        filterListData.map(test => {
          return test.site_name;
        }),
      ),
    );

    const showArr = [];
    showTestList.map((item, index) => {
      showArr.push({
        id: index,
        name: item,
      });
    });

    let showType = await showTestType();

    let resultType = await testResults();

    navigation.replace('Filters', {
      showArr,
      showType,
      resultType,
      filterListData,
    });
  };

  const getClients = async () => {
    let client = await dataStoreHelper.getClients();
    setClients(client);
  };

  const showTestType = async () => {
    let showTestType = Array.from(
      new Set(
        filterListData.map(test => {
          return test.test_type;
        }),
      ),
    );

    const showTypeArr = [];
    showTestType.map((item, index) => {
      showTypeArr.push({
        id: index,
        name: item,
      });
    });

    return showTypeArr;
  };

  const testResults = async () => {
    let showResultsList = Array.from(
      new Set(
        filterListData.map(test => {
          // console.log("====test.status===", test.status)
          if (test.status && test.status !== 'Processed') {
            return 'Processing';
          } else if (test?.result && test?.result === 'Positive') {
            return 'Positive / Fail';
          } else if (test?.result && test?.result === 'Negative') {
            return 'Negative / Pass';
          } else {
            return test?.result &&
              test?.result !== undefined &&
              test?.result !== ''
              ? test?.result.charAt(0).toUpperCase() + test?.result.slice(1)
              : '';
          }
          // return test.status
        }),
      ),
    );

    const resultArr = [];
    showResultsList.map((item, index) => {
      resultArr.push({
        id: index,
        name: item,
      });
    });

    return resultArr;
  };

  useEffect(() => {
    getClients();
    testResults();

    if (route?.params?.removeDuplicateValue) {
      // setListData(route?.params?.removeDuplicateValue);
      setFilterListData(route?.params?.removeDuplicateValue);
      setClear(true);
    } else {
      getUserTestResults();
    }
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      {/* {console.log('FIlterListData', filterListData)} */}
      <Header refresh onRefreshPress={getUserTestResults} />
      <View style={styles.headingRowContainer}>
        <Text style={styles.headingText}>{Strings.PreviousResults}</Text>

        <View style={styles.iconAndClearCon}>
          {filterListData.length !== 0 && (
            <TouchableOpacity
              onPress={() => {
                filteredData();
              }}
              disabled={filterListData.length == 0}
            >
              <ICON_CONSTANTS.IonIcons
                style={[styles.menuIcon, clear && styles.ifClear]}
                name={'filter'}
              />
            </TouchableOpacity>
          )}
          {clear && (
            <TouchableOpacity
              onPress={() => {
                getUserTestResults();
                setClear(false);
              }}
            >
              <Text style={styles.clearText}>{Strings.clear}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && (
        <ActivityIndicator size="large" color={Colors.PINK.default} />
      )}

      <FlatList
        data={filterListData}
        // data={[dummyData, dummyData]}
        renderItem={({item}) => (
          <MyResultDetails item={item} clients={clients} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{flex:1}}
        ListEmptyComponent={() => {
          return (
            <View style={styles.listEmptyComponent}>
              <Text style={styles.listEmptyText}>No Results Available</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MyResult;
