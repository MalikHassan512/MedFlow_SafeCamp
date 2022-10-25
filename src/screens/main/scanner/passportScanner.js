import React from 'react';
import {Animated, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
import PropTypes from 'prop-types';
import {Colors, wp, hp, Fonts, IS_IPHONE_X} from '../../../constants';
import ml from '@react-native-firebase/ml';
import {IS_PAD} from '../../../constants/Dimensions';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // ...StyleSheet.absoluteFillObject,
  },
  finder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightEdge: {
    position: 'absolute',
    top: 0,
    right: 0,
    // color: 'red',
  },
  bottomLeftEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRightEdge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  maskOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '10%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    backgroundColor: 'transparent',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: {
    display: 'flex',
    flexDirection: 'row',
  },
  animatedLine: {
    position: 'absolute',
    elevation: 4,
    zIndex: 0,
  },
  scanButton: {
    position: 'absolute',
    bottom: hp(5),
    alignSelf: 'center',
    height: wp(25),
    width: wp(25),
    borderRadius: wp(17),
    backgroundColor: Colors.WHITE.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
class PassportScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edgeRadiusOffset: props.edgeRadius ? -Math.abs(props.edgeRadius / 3) : 0,
      showBar: false,
    };
    this.camera = React.createRef();
  }

  componentDidMount() {
    this._startLineAnimation();
  }

  componentWillUnmount() {
    if (this.animation) {
      this.animation.stop();
    }
  }

  _startLineAnimation = () => {
    const intervalId = setInterval(() => {
      const {finderLayout, intervalId} = this.state;
      if (finderLayout && finderLayout.height > 0) {
        this._animateLoop();
        clearInterval(intervalId);
      }
    }, 500);
    this.setState({
      intervalId,
    });
  };
  _takePhoto = async () => {
    try {
      if (this.camera.current == null) throw new Error('Camera ref is null!');
      console.log('Taking photo...');
      this.props.scanning(true);
      const photo = await this.camera.current.takePictureAsync();
      // this.setState({showBar: true});
      this.onMediaSelect(photo.uri);
    } catch (e) {
      console.error('Failed to take photo!', e);
      this.setState({showBar: false});
    }
  };
  onMediaSelect = async img => {
    // 'PAISLAEVARSDOTTIR<<THURIDUR<OESP<<<<<<<<<<<<\nA3536444<7ISL1212123<3103108121212<1239<<<68'
    //'I<UTOD23145890<1233<<<<<<<<<<<\n7408122F1204159UTO<<<<<<<<<<<6\nERIKSSON<<ANNA<MARIA<<<<<<<<<<'
    // 'P<POLKOWALSKA<<ANNA<<<<<<<<<<<<<<<<<<<<<<<<<\nZS00001774POL7203305F1607130<<<<<<<<<<<<<<08'
    try {
      var result = await ml().cloudDocumentTextRecognizerProcessImage(img);
      // this.setState({showBar: false});
      this.props.scanning(false);
      let mrz = '';
      let newArr = [];
      for (let i = 0; i < result.blocks.length; i++) {
        if (
          result.blocks[i].text.includes('<') ||
          result.blocks[i].text.match(/([A-Za-z]{3}[0-9]{7}[FMfm<]{1}[0-9]{6})/)
        ) {
          newArr.push(result.blocks[i].text.replace(/[\n\r\s]/g, '').trim());
        }
      }

      mrz = newArr.toString().replace(/,/g, '');
      let index = mrz.indexOf('<<<');
      let dynamicFirst = '';
      if (index > -1)
        dynamicFirst = (
          mrz.substring(0, index) + '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
        ).substring(0, 44);
      else dynamicFirst = mrz.substring(0, 44);
      let dynamicLast = mrz.slice(-44);
      // let hardCodedFirst = "P<USACLARKE<<PAUL<FRANCIS<<<<<<<<<<<<<<<<<<<";
      // let hardCodedLast = "6739492772USA7712061M3108228688474908<470522"
      const parse = require('mrz').parse;
      let result2 = parse(dynamicFirst + '\n' + dynamicLast);
      // let result2 = parse(dynamicFirst + '\n' + "GN12371021KOR8303213M07081881849915V12866560");

      result.text =
        'First Name:' +
        result2.fields.firstName +
        '\n' +
        'Last Name:' +
        result2.fields.lastName +
        '\n' +
        'sex:' +
        result2.fields.sex +
        '\n' +
        'birthDate:' +
        result2.fields.birthDate +
        '\n' +
        'ID:' +
        result2.fields.documentNumber;
      this.props.scanResult(result2);
    } catch (error) {
      console.log(
        '🚀 ~ file: passportScanner.js ~ line 173 ~ PassportScanner ~ error',
        error,
      );
      // this.setState({showBar: false});
      this.props.scanning(false);
      alert('Passport scanning failed.');
    }
  };

  _animateLoop = () => {
    const {
      animatedLineOrientation,
      lineAnimationDuration,
      useNativeDriver,
    } = this.props;
    const {lineTravelWindowDistance} = this.state;
    const isHorizontal = animatedLineOrientation !== 'vertical';
    const propertyToChange = isHorizontal ? 'top' : 'left';
    const startValue = -lineTravelWindowDistance;
    const endValue = lineTravelWindowDistance;
    this.animation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.state[propertyToChange], {
          toValue: endValue,
          duration: lineAnimationDuration,
          useNativeDriver,
        }),
        Animated.timing(this.state[propertyToChange], {
          toValue: startValue,
          duration: lineAnimationDuration,
          useNativeDriver,
        }),
      ]),
    );
    this.animation.start();
  };

  _applyMaskFrameStyle = () => {
    const {backgroundColor, outerMaskOpacity} = this.props;
    return {backgroundColor, opacity: outerMaskOpacity, flex: 1};
  };

  _renderEdge = edgePosition => {
    const {
      edgeWidth,
      edgeHeight,
      edgeColor,
      edgeBorderWidth,
      edgeRadius,
    } = this.props;
    const {edgeRadiusOffset} = this.state;
    const defaultStyle = {
      width: edgeWidth,
      height: edgeHeight,
      borderColor: edgeColor,
    };
    const edgeBorderStyle = {
      topRight: {
        borderRightWidth: edgeBorderWidth,
        borderTopWidth: edgeBorderWidth,
        borderTopRightRadius: edgeRadius,
        top: edgeRadiusOffset,
        right: edgeRadiusOffset,
      },
      topLeft: {
        borderLeftWidth: edgeBorderWidth,
        borderTopWidth: edgeBorderWidth,
        borderTopLeftRadius: edgeRadius,
        top: edgeRadiusOffset,
        left: edgeRadiusOffset,
      },
      bottomRight: {
        borderRightWidth: edgeBorderWidth,
        borderBottomWidth: edgeBorderWidth,
        borderBottomRightRadius: edgeRadius,
        bottom: edgeRadiusOffset,
        right: edgeRadiusOffset,
      },
      bottomLeft: {
        borderLeftWidth: edgeBorderWidth,
        borderBottomWidth: edgeBorderWidth,
        borderBottomLeftRadius: edgeRadius,
        bottom: edgeRadiusOffset,
        left: edgeRadiusOffset,
      },
    };
    return (
      <View
        style={[
          defaultStyle,
          styles[edgePosition + 'Edge'],
          edgeBorderStyle[edgePosition],
        ]}
      />
    );
  };

  _calculateLineTravelWindowDistance({layout, isHorizontalOrientation}) {
    return ((isHorizontalOrientation ? layout.height : layout.width) - 10) / 2;
  }

  _onFinderLayoutMeasured = ({nativeEvent}) => {
    const {animatedLineOrientation, onLayoutMeasured} = this.props;
    const {layout} = nativeEvent;
    const isHorizontal = animatedLineOrientation !== 'vertical';
    const travelDistance = this._calculateLineTravelWindowDistance({
      layout,
      isHorizontalOrientation: isHorizontal,
    });
    this.setState({
      top: new Animated.Value(-travelDistance),
      left: new Animated.Value(-travelDistance),
      lineTravelWindowDistance: travelDistance,
      finderLayout: layout,
    });
    if (onLayoutMeasured) {
      onLayoutMeasured({nativeEvent});
    }
  };

  render() {
    const {
      width,
      height,
      showAnimatedLine,
      animatedLineColor,
      animatedLineWidth,
      animatedLineHeight,
      animatedLineOrientation,
      edgeBorderWidth,
    } = this.props;
    const animatedLineStyle = {
      backgroundColor: animatedLineColor,
      height: animatedLineHeight,
      maxHeight: height,
      width: animatedLineWidth,
      maxWidth: width,
      margin: edgeBorderWidth,
    };
    const {finderLayout, top, left} = this.state;
    if (finderLayout && animatedLineOrientation !== 'vertical') {
      animatedLineStyle.transform = [
        {
          translateY: top,
        },
      ];
    } else if (finderLayout) {
      animatedLineStyle.transform = [
        {
          translateX: left,
        },
      ];
    }

    return (
      // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <>
        {!this.state.showBar ? (
          <RNCamera flashMode={this.props.flashMode} captureAudio={false} ref={this.camera} style={{flex: 1}}>
            <View style={[styles.container]}>
              <View
                style={[
                  styles.finder,
                  {
                    width,
                    height,
                    top: IS_IPHONE_X ? (IS_PAD ? hp(20) : hp(25)) : hp(20),
                  },
                ]}
                onLayout={this._onFinderLayoutMeasured}
              >
                {this._renderEdge('topLeft')}
                {this._renderEdge('topRight')}
                {this._renderEdge('bottomLeft')}
                {this._renderEdge('bottomRight')}
                {showAnimatedLine && (
                  <Animated.View
                    style={[styles.animatedLine, animatedLineStyle]}
                  />
                )}
              </View>
              <View style={styles.maskOuter}>
                <View style={[styles.maskRow, this._applyMaskFrameStyle()]} />
                <View style={[{height}, styles.maskCenter]}>
                  <View style={[this._applyMaskFrameStyle()]} />
                  <View style={[styles.maskInner, {width, height}]} />
                  <View style={[this._applyMaskFrameStyle()]} />
                </View>
                <View style={[styles.maskRow, this._applyMaskFrameStyle()]} />
              </View>
            </View>
            <TouchableOpacity
              onPress={this._takePhoto}
              style={styles.scanButton}
            >
              <Text style={{fontSize: wp(3)}}>
                {this.state.showBar ? 'Scaning...' : 'Scan'}
              </Text>
            </TouchableOpacity>
          </RNCamera>
        ) : null}
      </>
      // </View>
    );
  }
}

const propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  edgeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  edgeHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  edgeColor: PropTypes.string,
  edgeBorderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  edgeRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  outerMaskOpacity: PropTypes.number,
  showAnimatedLine: PropTypes.bool,
  animatedLineColor: PropTypes.string,
  animatedLineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  animatedLineWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lineAnimationDuration: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  animatedLineOrientation: PropTypes.string,
  useNativeDriver: PropTypes.bool,
  onLayoutMeasured: PropTypes.func,
};

const defaultProps = {
  width: IS_PAD ? wp(65) : wp(75),
  height: hp(30),
  edgeWidth: 20,
  edgeHeight: 20,
  edgeColor: '#FFF',
  edgeBorderWidth: 4,
  backgroundColor: 'rgb(0, 0, 0)',
  outerMaskOpacity: 0.6,
  showAnimatedLine: true,
  animatedLineColor: '#FFF',
  animatedLineHeight: 2,
  animatedLineWidth: '85%',
  lineAnimationDuration: 5000,
  animatedLineOrientation: 'horizontal',
  useNativeDriver: true,
};

PassportScanner.propTypes = propTypes;
PassportScanner.defaultProps = defaultProps;

export default PassportScanner;
