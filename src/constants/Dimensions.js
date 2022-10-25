import {Dimensions, PixelRatio, Platform} from 'react-native';

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width;
// Retrieve initial screen's height
let screenHeight = Dimensions.get('window').height;

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const aspectRatio = height/width;
const IS_PAD = !(aspectRatio>1.6)
const IS_IPHONE_X = !!(
  Platform.OS === 'ios' &&
  (height > 800 || width > 800)
);

const IS_IPHONE = !!(Platform.OS === 'ios');


const widthPercentageToDP = (widthPercent) => {
  // Parse string percentage input and convert it to number.
  const elemWidth =
      typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

const heightPercentageToDP = (heightPercent) => {
  // Parse string percentage input and convert it to number.
  const elemHeight =
      typeof heightPercent === 'number'
          ? heightPercent
          : parseFloat(heightPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  height,
  width,
  IS_IPHONE_X,
  IS_IPHONE,
  IS_PAD
};
