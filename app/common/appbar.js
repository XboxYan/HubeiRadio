/**
 * index
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  StatusBar,
  Platform,
  View,
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from './touchable';

const STATUS_HEIGHT = (Platform.Version&&Platform.Version>=19)?StatusBar.currentHeight:0;

class AppBar extends Component {

  render() {
    const { navigator } = this.props;
    return (
      <View style={[styles.appbar,{backgroundColor:$THEME_COLOR}]}>
        <Touchable
          style={styles.btn}
          onPress={() => this.props.navigator.pop()}
          >
          <Icon name='arrow-back' size={24} color='#fff' />
        </Touchable>
        <Text style={styles.apptitle} numberOfLines={1}>{this.props.title || ''}</Text>
        <View style={styles.btn}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appbar: {
    paddingTop:STATUS_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    width: 50,
    height: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apptitle: {
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    color: '#fff'
  }

});

module.exports = AppBar;
