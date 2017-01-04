/**
 * Settings
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  Text,
  View,
  Picker,
  Switch,
  Alert,
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppBar from '../common/appbar';
import Touchable from '../common/touchable';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option_fontsize: null,
      option_wifi: null,
      switch_listView: false,
      switch_notice: true,
      switch_col: false
    }
    this.logout = this.logout.bind(this);
  }
  logout() {
    const { navigator } = this.props;
    storage.remove({
      key: 'user'
    });
    $USER_INFO.loginState = false;
    $USER_INFO.userName = '';
    navigator.pop();
  }
  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <AppBar title='用户中心' navigator={navigator} />
        <ScrollView style={styles.content}>
          <View style={styles.setview}>
            <View style={styles.listwrap}>
              <View style={styles.setlist}>
                <Text style={styles.name}>列表显示摘要</Text>
                <Switch
                  onValueChange={(value) => this.setState({ switch_listView: value })}
                  value={this.state.switch_listView} />
              </View>
              <Touchable style={styles.setlist}>
                <Text style={styles.name}>字体大小</Text>
                <Text style={styles.subname}>中</Text>
              </Touchable>
            </View>
            <View style={styles.listwrap}>
              <Touchable style={styles.setlist}>
                <Text style={styles.name}>非Wifi网络流量</Text>
              </Touchable>
              <Touchable style={styles.setlist}>
                <Text style={styles.name}>清除缓存</Text>
                <Text style={styles.subname}>0MB</Text>
              </Touchable>
            </View>
            <View style={styles.listwrap}>
              <View style={styles.setlist}>
                <Text style={styles.name}>推送通知</Text>
                <Switch
                  onValueChange={(value) => this.setState({ switch_notice: value })}
                  value={this.state.switch_notice} />
              </View>
              <View style={styles.setlist}>
                <Text style={styles.name}>收藏时转发</Text>
                <Switch
                  onValueChange={(value) => this.setState({ switch_col: value })}
                  value={this.state.switch_col} />
              </View>
            </View>
            <View style={styles.listwrap}>
              <Touchable style={styles.setlist} onPress={() => Alert.alert('应用更新', '已经时最新版本了~')}>
                <Text style={styles.name}>检查新版本</Text>
                <Text style={styles.subname}>1.0.0</Text>
              </Touchable>
            </View>
            <Touchable
              style={styles.themebtn}
              onPress={this.logout} >
              <Text style={styles.themebtntext}>退出登录</Text>
            </Touchable>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor:'#f1f1f1'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setview: {

  },
  listwrap: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  name: {
    color: '#666',
    fontSize: 14
  },
  subname: {
    color: '#999',
    fontSize: 12
  },
  setlist: {
    marginTop: -1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#cecece',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 10
  },
  themebtn: {
    height: 46,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 2
  },
  themebtntext: {
    color: '#fff',
    fontSize: 16
  },
});

module.exports = Settings;
