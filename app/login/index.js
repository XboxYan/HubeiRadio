/**
 * Login
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  PixelRatio,
  ToastAndroid,
  InteractionManager
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppBar from '../common/appbar';
import Register from './register';
import Touchable from '../common/touchable';

const LOGIN_URL = 'http://ottserver.hrtn.net:8080/userCenter/login';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      passwd: '',
      secure: true
    }
    this.onsubmit = this.onsubmit.bind(this);
    this.setValue = this.setValue.bind(this);
  }
  setValue(ret) {
    this.setState({
      userName: ret.userName,
      //passwd:ret.passwd
    })
  }
  onsubmit() {
    const { navigator, route } = this.props;
    let userName = this.state.userName.replace(/^ +| +$/g, '');
    let passwd = this.state.passwd.replace(/^ +| +$/g, '');
    if (!userName || !passwd) {
      ToastAndroid.show('请输入用户名和密码~', ToastAndroid.SHORT);
      return
    }
    fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'version=V001&userName=' + userName + '&passwd=' + passwd + '&terminalName=phone&authKey=' + '3d07c0ab69ec466d4297b71f37c3a2f3'
    })
      .then((response) => {
        //ToastAndroid.show('登录中...', ToastAndroid.SHORT);
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {

        if (responseData.ret === "0") {
          $USER_INFO.loginState = true;
          $USER_INFO.userName = userName;
          storage.save({
            key: 'user',  // 注意:请不要在key中使用_下划线符号!
            rawData: {
              userName: userName,
              loginState: true
            },
            expires: null
          });
          if (route.callback) {
            route.callback();
          }
          ToastAndroid.show('登录成功~', ToastAndroid.SHORT);
          navigator.pop();
        } else {
          ToastAndroid.show(responseData.retInfo, ToastAndroid.SHORT);
        }
      })
      .catch(() => {
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }
  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <AppBar title='登录' navigator={navigator} />
        <View style={styles.formwrap}>
          <View style={styles.form}>
            <View style={styles.inputwrap}>
              <Icon name="person" size={24} color='#999' />
              <TextInput
                style={styles.input}
                onChangeText={(userName) => this.setState({ userName })}
                value={this.state.userName}
                placeholder="请输入用户名"
                placeholderTextColor="#ccc"
                underlineColorAndroid='transparent' />
              {
                (!!this.state.userName) && <Touchable style={styles.actbtn} onPress={() => this.setState({ userName: '' })}>
                  <Icon name="cancel" size={20} color='#999' />
                </Touchable>
              }
            </View>
            <View style={styles.inputwrap}>
              <Icon name="vpn-key" size={24} color='#999' />
              <TextInput
                style={styles.input}
                onChangeText={(passwd) => this.setState({ passwd })}
                value={this.state.passwd}
                secureTextEntry={this.state.secure}
                placeholder="请输入密码"
                placeholderTextColor="#ccc"
                underlineColorAndroid='transparent' />
              {
                (!!this.state.passwd) && <Touchable style={styles.actbtn} onPress={() => this.setState({ secure: !this.state.secure })}>
                  <Icon name={this.state.secure ? 'visibility-off' : 'visibility'} size={20} color='#999' />
                </Touchable>
              }

            </View>
          </View>
          <Touchable style={[styles.themebtn, { backgroundColor: $THEME_COLOR }]} onPress={this.onsubmit} >
            <Text style={styles.themebtntext}>登录</Text>
          </Touchable>
          <View style={styles.register}>
            <Text style={{ color: '#666', fontSize: 14 }}>还没有账号?</Text>
            <TouchableOpacity onPress={() => this.props.navigator.push({ name: Register, setValue: this.setValue })}>
              <Text style={{ color: $THEME_COLOR, fontSize: 14 }}>立即注册</Text>
            </TouchableOpacity>
          </View>
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
  formwrap: {
    marginTop: 10,
  },
  form: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10
  },
  inputwrap: {
    marginTop: -1 / PixelRatio.get(),
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#cecece',
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    color: '#333',
    borderBottomColor: 'transparent'
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
  register: {
    flexDirection: 'row',
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actbtn: {
    padding: 10
  }
});

module.exports = Login;
