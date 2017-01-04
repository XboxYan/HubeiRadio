/**
 * Update
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  PixelRatio,
} from 'react-native';
import AppBar from '../common/appbar';
import Touchable from '../common/touchable';

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <AppBar title='软件更新' navigator={navigator} />
        <View style={styles.listwrap}>
          <View style={styles.list}>
            <View style={styles.setlist}>
              <Text style={styles.name}>当前版本</Text>
              <Text style={styles.subname}>V1.0.0</Text>
            </View>
            <View style={styles.setlist}>
              <Text style={styles.name}>最新版本</Text>
              <Text style={styles.subname}>V1.0.0</Text>
            </View>
            <View style={styles.setlist}>
              <Text style={styles.name}>新版本功能</Text>
              <Text style={styles.subname}>当前已经是最新版本</Text>
            </View>
          </View>
          <Touchable
             style={[styles.themebtn,{backgroundColor: $THEME_COLOR}]}
             onPress={() => ToastAndroid.show('已经是最新版本了~', ToastAndroid.SHORT)} >
            <Text style={styles.themebtntext}>开始更新</Text>
          </Touchable>
        </View>
        <View style={styles.copyright}>
          <Text style={styles.copyrighttext}>湖北广电网络版权所有</Text>
          <Text style={styles.copyrighttext}>Copyright©Hrtn CO.,LTD. All Right Reserved</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  listwrap: {
    marginTop: 10,
    flex: 1
  },
  list: {
    backgroundColor: '#fff'
  },
  copyright: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyrighttext: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 24
  },
  name: {
    color: '#666',
    fontSize: 14
  },
  subname: {
    color: '#999',
    fontSize: 12
  },
  themebtn: {
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 2
  },
  themebtntext: {
    color: '#fff',
    fontSize: 16
  },
  setlist: {
    backgroundColor: '#fff',
    marginTop: -1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#cecece',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 10
  }
});

module.exports = Update;
