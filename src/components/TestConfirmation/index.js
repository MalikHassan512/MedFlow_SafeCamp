import React from 'react';
import {StyleSheet, View, Modal, Text, Pressable,TouchableOpacity} from 'react-native';
import { Colors } from '../../constants';
import {hp, wp} from '../../constants/Dimensions';

const TestConfirmation = props => {
  const {
    display,
    setDisplay,
    title = 'Success!',
    message,
    isForSysncing = false,
    isLabTestConfirmation = false,
    onPressYes,
    onPressNo,
  } = props;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={display}
      onRequestClose={() => setDisplay(!display)}
    >
      <Pressable
        // onPress={() => setDisplay(!display)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: wp('100%'),
          height: hp('100%'),
          backgroundColor:`${Colors.WHITE.default}50`
        }}
      >
        <View style={[styles.modalView, isForSysncing ? {} : {}]}>
          {!isForSysncing && (
            <View style={styles.headerCon}>
              <Text style={styles.header}>{title}</Text>
              <View style={styles.separator} />
            </View>
          )}
          {/* <View style={styles.headerCon}>
                <Text style={styles.header}>{title}</Text>
                <View style={{borderBottomColor: "#FF3366", width: "100%", borderBottomWidth: 1}}/>
            </View> */}
          <Text style={[styles.msg, isForSysncing ? {fontWeight: '900'} : {}]}>
            {message}
          </Text>

          {isLabTestConfirmation && (
            <>
              <View style={styles.separator} />
              <View style={{flexDirection: 'row', height: 40, width: '100%'}}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={onPressNo}
                >
                  <Text style={styles.noTextStyle}> No</Text>
                </TouchableOpacity>
                <View style={styles.horizentalSeparator} />
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={onPressYes}
                >
                  <Text style={styles.yesTextStyle}> Yes</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#343a40',
    // height: 200,
    width: wp('70%'),
    alignSelf: 'center',
    // position: "absolute",
    // top: "45%",
    flexDirection: 'column',
    borderRadius: 30,
    alignItems: 'center',
    // padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    elevation: 8,
    overflow: 'hidden',
  },
  headerCon: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    color: '#D8D8D8',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 5,
  },
  msg: {
    color: '#D8D8D8',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
    padding: 10,
  },
  separator: {
    borderBottomColor: '#FF3366',
    width: '100%',
    borderBottomWidth: 1,
    marginTop: 5,
  },
  horizentalSeparator: {
    backgroundColor: '#FF3366',
    // flex: 1,
    width: 1,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesTextStyle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  noTextStyle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default TestConfirmation;
