/**
 * Person
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Text,
  View,
  PixelRatio,
} from 'react-native';
import Feedback from './feedback';
import Update from './update';
import Settings from './settings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';
import Login from '../login';

class UserSet extends Component {
  render() {
    return (
      <Touchable
        onPress={this.props.onPress}
        style={[this.props.style, { paddingTop: 20, paddingBottom: 20, }]} >
        <Icon name={this.props.name} size={30} color={this.props.color} />
        <Text style={[styles.tabText, { fontSize: 12, marginTop: 5 }]}>{this.props.title}</Text>
      </Touchable>
    )
  }
}

class SetList extends Component {
  render() {
    return (
      <Touchable
        onPress={this.props.onPress}
        style={this.props.style} >
        <Icon name={this.props.name} size={18} color='#999' />
        <Text style={styles.listtext}>{this.props.text}</Text>
        <Icon name="keyboard-arrow-right" size={20} color='#999' />
      </Touchable>
    )
  }
}

class Person extends Component {
  constructor(props) {
    super(props);
    this.loginTo = this.loginTo.bind(this);
  }
  loginTo(go) {
    if ($USER_INFO.loginState) {
      go();
    } else {
      this.props.navigator.push({ name: Login });
    }
  }

  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <View style={[styles.usertop,{backgroundColor:$THEME_COLOR}]}>
          <TouchableOpacity activeOpacity={.6} onPress={() => this.loginTo(() => navigator.push({ name: Settings }))}>
            <Icon name='account-circle' size={80} color='#fff' />
            <Text style={styles.username}>{$USER_INFO.loginState ? $USER_INFO.userName : '登录/注册'}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.userlink}>
            <UserSet style={styles.center} name="watch-later" title="历史记录" color="#eda358" onPress={() => this.loginTo(() => alert('登录成功1'))} />
            <UserSet style={styles.center} name="notifications" title="我的预约" color="#6b8dee" onPress={() => this.loginTo(() => alert('登录成功2'))} />
            <UserSet style={styles.center} name="star" title="影片收藏" color="#ef6b92" onPress={() => this.loginTo(() => alert('登录成功3'))} />
          </View>
          <View style={styles.settings}>
            <SetList style={styles.setlist} name="email" text="建议与反馈" onPress={() => navigator.push({ name: Feedback })} />
            <SetList style={styles.setlist} name="backup" text="版本更新" onPress={() => navigator.push({ name: Update })} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usertop: {
    height: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  username: {
    color: '#fff',
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center'
  },
  userlink: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    zIndex: 2
  },
  settings: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  setlist: {
    marginTop: -1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#cecece',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10
  },
  listtext: {
    color: '#666',
    fontSize: 14,
    paddingLeft: 10,
    flex: 1
  }
});

module.exports = Person;
