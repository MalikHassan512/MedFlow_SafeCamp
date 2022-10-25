import {
  InterfaceType,
  StarConnectionSettings,
  StarXpandCommand,
  StarDeviceDiscoveryManagerFactory,
} from 'react-native-star-io10';
import {Platform, Alert, Linking, PermissionsAndroid} from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {Strings, TestTypes, UpdatedTestTypes} from '../constants';
import moment from 'moment';
import Utilits from './utilityMethods';

const printTest = async (printer, name, message = '') => {
  var settings = new StarConnectionSettings();
  settings.interfaceType = InterfaceType.BluetoothLE;
  settings.identifier = '00:11:62:00:00:00';

  try {
    var builder = new StarXpandCommand.StarXpandCommandBuilder();
    builder.addDocument(
      new StarXpandCommand.DocumentBuilder().addPrinter(
        new StarXpandCommand.PrinterBuilder()
          .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
          // .actionPrintText('Connected to ' + name + "'s device")
          .actionPrintText(
            message === '' ? 'Connected to ' + name + "'s device" : message,
          )

          .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
          .actionPrintBarcode(
            new StarXpandCommand.Printer.BarcodeParameter(
              'TEST',
              StarXpandCommand.Printer.BarcodeSymbology.Code93,
            )
              .setBarDots(1)
              .setHeight(16.505)
              .setPrintHri(true),
          )
          .actionFeedLine(2),
      ),
    );
    var commands = await builder.getCommands();
    await printer.open();
    await printer.print(commands);
  } catch (error) {
  } finally {
    await printer.close();
    await printer.dispose();
  }
};
const getBluetoothState = async (printerId, callBack) => {
  const isEnabled = await BluetoothStateManager.getState();
  if (isEnabled === 'PoweredOff') {
    Alert.alert(Strings.useBluetooth, Strings.allowBlueToothInSettings, [
      {
        text: Strings.settings,
        onPress: () => {
          goToSettings();
        },
      },
      {
        text: Strings.Close,
        onPress: () => {},
      },
    ]);
    callBack({
      isSuccess: false,
      printerList: null,
      message: Strings.bluetoothNotAvailable,
    });
  } else {
    if (Platform.OS == 'android' && 31 <= Platform.Version) {
      // if (this.state.bluetoothIsEnabled) {
      var hasPermission = await confirmBluetoothPermission();

      if (!hasPermission) {
        alert(
          `PERMISSION ERROR: You have to allow Nearby devices to use the Bluetooth printer`,
        );
        return;
        // }
      }
    }
    discoverPrinters(printerId, data => {
      callBack(data);
    });
  }
};
const goToSettings = () =>
  Platform.OS === 'ios'
    ? Linking.openURL('App-Prefs:Bluetooth')
    : AndroidOpenSettings.bluetoothSettings();
const discoverPrinters = async (printerId, callBack) => {
  try {
    var printersToSave = [];
    var printerList = [];
    var interfaceTypes = [
      Platform.OS === 'ios'
        ? InterfaceType.BluetoothLE
        : InterfaceType.Bluetooth,
    ];
    var manager = await StarDeviceDiscoveryManagerFactory.create(
      interfaceTypes,
    );

    manager.discoveryTime = 5000;

    // Callback for printer found.
    manager.onPrinterFound = printer => {
      printersToSave.push(printer);
      printerList.push({
        name: printer.connectionSettings.identifier,
        value: printer,
      });
    };

    manager.onDiscoveryFinished = () => {
      callBack({
        isSuccess: true,
        printerList,
        message: Strings.printerList,
      });
    };
    await manager.startDiscovery();
  } catch (error) {
    callBack({
      isSuccess: false,
      printerList: null,
      message: error,
    });
  }
};

const confirmBluetoothPermission = async () => {
  var hasPermission = false;

  try {
    hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    );

    if (!hasPermission) {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );
      hasPermission = status == PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    console.warn(err);
  }

  return hasPermission;
};

const printBarcode = async (
  demographics,
  testCount,
  printer,
  barcodeId,
  testType,
  id,
  response,
) => {
  var settings = new StarConnectionSettings();
  settings.interfaceType = InterfaceType.BluetoothLE;
  settings.identifier = '00:11:62:00:00:00';
  // let date = moment(demographics?.dob).format('MM-DD-YYYY');
  // if (date.toLowerCase() == 'invalid date') {
  //   date = Utilits.formatDOB(demographics?.dob);
  // }
  let date = demographics?.dob;
  let returned = true;
  if (testType === Strings.pcr) {
    try {
      var builder = new StarXpandCommand.StarXpandCommandBuilder();
      var idNumber = barcodeId
        ? barcodeId
        : `${demographics.idNumber}-${30 + testCount + 1}`;
        idNumber = idNumber.toUpperCase()
      builder.addDocument(
        new StarXpandCommand.DocumentBuilder().addPrinter(
          new StarXpandCommand.PrinterBuilder()
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .styleBold(true)
            .actionPrintText(
              `${demographics.lastName.toUpperCase()}, ${demographics.firstName.toUpperCase()} - ${date}, ${id}`,
            )
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .actionPrintBarcode(
              new StarXpandCommand.Printer.BarcodeParameter(
                idNumber,
                StarXpandCommand.Printer.BarcodeSymbology.Code93,
              )
                .setBarDots(1)
                .setHeight(16.505)
                .setPrintHri(true),
            )
            .actionFeedLine(2),
        ),
      );
      var commands = await builder.getCommands();
      if (printer) {
        await printer.open();
        await printer.print(commands);
      }
    } catch (error) {
      returned = false;
      response(false);
      return false;
    } finally {
      if (printer) {
        await printer.close();
        await printer.dispose();
        returned && response(true);
        return true;
      }
    }
  } else {
    try {
      var builder = new StarXpandCommand.StarXpandCommandBuilder();
      builder.addDocument(
        new StarXpandCommand.DocumentBuilder().addPrinter(
          new StarXpandCommand.PrinterBuilder()
            .actionFeedLine(1)
            .actionFeed(1)
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .styleBold(true)
            .actionPrintText(
              `${demographics.lastName.toUpperCase()}, ${demographics.firstName.toUpperCase()} -> ${getTestTypeName(
                testType,
              )}`,
            )
            .actionFeedLine(2)
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .styleMagnification(
              new StarXpandCommand.MagnificationParameter(2, 2),
            )
            .styleCharacterSpace(1)
            .styleBold(true)
            .actionPrintText(`${id}`)
            .actionFeedLine(2)
            .actionFeed(6.5),
          // .actionPrintBarcode(
          //     new StarXpandCommand.Printer.BarcodeParameter(
          //         printInfo.barcode,
          //         StarXpandCommand.Printer.BarcodeSymbology.Code93,
          //     )
          //         .setBarDots(1)
          //         .setHeight(16.505)
          //         .setPrintHri(true),
          // )
          // .actionFeedLine(2),
        ),
      );
      var commands = await builder.getCommands();
      await printer.open();
      await printer.print(commands);
    } catch (error) {
      returned = false;
      response(false);
      return false;
    } finally {
      await printer.close();
      await printer.dispose();
      returned && response(true);
      return true;
    }
  }
};
const reprintBarcode = async (printInfo, printer) => {
  var settings = new StarConnectionSettings();
  settings.interfaceType = InterfaceType.BluetoothLE;
  settings.identifier = '00:11:62:00:00:00';
  let idNumber = printInfo.barcode ? printInfo.barcode.toUpperCase() : ''
  try {
    var builder = new StarXpandCommand.StarXpandCommandBuilder();
    builder.addDocument(
      new StarXpandCommand.DocumentBuilder().addPrinter(
        new StarXpandCommand.PrinterBuilder()
          .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
          .styleBold(true)
          .actionPrintText(
            `${printInfo.last.toUpperCase()}, ${printInfo.first.toUpperCase()} - ${
              printInfo.dob
            }, ${printInfo.id}`,
          )
          .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
          .actionPrintBarcode(
            new StarXpandCommand.Printer.BarcodeParameter(
              idNumber,
              StarXpandCommand.Printer.BarcodeSymbology.Code93,
            )
              .setBarDots(1)
              .setHeight(16.505)
              .setPrintHri(true),
          )
          .actionFeedLine(2),
      ),
    );
    var commands = await builder.getCommands();
    await printer.open();
    await printer.print(commands);
  } catch (error) {
    console.log(
      '🚀 ~ file: printerHelper.js ~ line 293 ~ reprintBarcode ~ error',
      error,
    );
  } finally {
    await printer.close();
    await printer.dispose();
  }
};
const reprintBarcodeTimer = async (printInfo, printer) => {
  var settings = new StarConnectionSettings();
  settings.interfaceType = InterfaceType.BluetoothLE;
  settings.identifier = '00:11:62:00:00:00';

  try {
    var builder = new StarXpandCommand.StarXpandCommandBuilder();
    builder.addDocument(
      new StarXpandCommand.DocumentBuilder().addPrinter(
        new StarXpandCommand.PrinterBuilder()
          .actionFeedLine(1)
          .actionFeed(1)
          .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
          .styleBold(true)
          .actionPrintText(
            `${printInfo.last.toUpperCase()}, ${printInfo.first.toUpperCase()} -> ${getTestTypeName(
              printInfo.testType,
            )}`,
          )
          .actionFeedLine(2)
          .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
          .styleMagnification(new StarXpandCommand.MagnificationParameter(2, 2))
          .styleCharacterSpace(1)
          .styleBold(true)
          .actionPrintText(`${printInfo.sequenceNo}`)
          .actionFeedLine(2)
          .actionFeed(6.5),
        // .actionPrintBarcode(
        //     new StarXpandCommand.Printer.BarcodeParameter(
        //         printInfo.barcode,
        //         StarXpandCommand.Printer.BarcodeSymbology.Code93,
        //     )
        //         .setBarDots(1)
        //         .setHeight(16.505)
        //         .setPrintHri(true),
        // )
        // .actionFeedLine(2),
      ),
    );
    var commands = await builder.getCommands();
    await printer.open();
    await printer.print(commands);
  } catch (error) {
    console.log(
      '🚀 ~ file: printerHelper.js ~ line 345 ~ reprintBarcodeTimer ~ error',
      error,
    );
  } finally {
    await printer.close();
    await printer.dispose();
  }
};
export const getTestTypeName = type => {
  console.log('test type is: ', type);
  if (type === TestTypes.ANTIGEN) {
    return UpdatedTestTypes.ANTIGEN;
  } else if (type === TestTypes.MOLECULAR) {
    return UpdatedTestTypes.MOLECULAR;
  } else if (type === TestTypes.OTHER) {
    return UpdatedTestTypes.OTHER;
  } else {
    return type;
  }
};
export default {
  printTest,
  getBluetoothState,
  discoverPrinters,
  goToSettings,
  confirmBluetoothPermission,
  printBarcode,
  reprintBarcode,
  reprintBarcodeTimer,
  getTestTypeName,
};
