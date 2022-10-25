import {Platform} from 'react-native';
export default {
  SF_PRO_TEXT: {
    ...Platform.select({
      ios: {
        Black: 'SFProText-Black',
        BlackItalic: 'SFProText-BlackItalic',
        Bold: 'SFProText-Bold',
        BoldItalic: 'SFProText-BoldItalic',
        Regular: 'SFProText-Regular',
        Medium: 'SFProText-Medium',
        Text: 'SFProText-Regular',
        Thin: 'SFProText-Thin',
      },
      android: {
        Black: 'SF-Pro-Text-Black',
        BlackItalic: 'SF-Pro-Text-BlackItalic',
        Bold: 'SF-Pro-Text-Bold',
        BoldItalic: 'SF-Pro-Text-BoldItalic',
        Regular: 'SF-Pro-Text-Regular',
        Medium: 'SF-Pro-Text-Medium',
        Text: 'SF-Pro-Text-Regular',
        Thin: 'SF-Pro-Text-Thin',
      },
    }),
  },
};
