/**
 * Register
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  PixelRatio,
  ToastAndroid,
  View,
  InteractionManager
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppBar from '../common/appbar';
import Touchable from '../common/touchable';

const VERIFY_URL = 'http://ottserver.hrtn.net:8080/userCenter/verifyAccountName';
const REG_URL = 'http://ottserver.hrtn.net:8080/userCenter/registerUser';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      isRead: false,
      userName: '',
      passwd: '',
      secure: true
    }
    this.onsubmit = this.onsubmit.bind(this);
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        actions: true
      })
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
    //阅读注册协议
    if (!this.state.isRead) {
      ToastAndroid.show('请先阅读注册协议~', ToastAndroid.SHORT);
      return
    }
    //ToastAndroid.show('注册中...', ToastAndroid.SHORT);
    //判断是否已经注册
    fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: 'version=V001&userName=' + userName + '&authKey=' + '626db94ee7ad84b68cdb7680c4faedb8'
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        if (responseData.ret === "0") {
          //注册-----
          fetch(REG_URL, {
            method: 'POST',
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'version=V001&userName=' + userName + '&passwd=' + passwd + '&remark=none&diqu=5201&authKey=' + 'ee937896634bae86d86896809d7756a5'
          })
            .then((response) => {
              if (response.ok) {
                return response.json()
              }
            })
            .then((responseData) => {
              if (responseData.ret == "0") {
                ToastAndroid.show('注册成功~', ToastAndroid.SHORT);
                route.setValue({userName:userName});
                this.props.navigator.pop();
              } else {
                ToastAndroid.show(responseData.ret + responseData.retInfo, ToastAndroid.SHORT);
              }
            })
            .catch(() => {
              ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
            });
          //-----
        } else {
          //用户已注册
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
        <AppBar title='注册' navigator={navigator} />
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
          <View style={styles.readcommit}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => this.setState({ isRead: !this.state.isRead })} >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name={this.state.isRead ? 'check-box' : 'check-box-outline-blank'} size={20} color={this.state.isRead ? $THEME_COLOR : '#999'} />
                <Text style={{ color: '#666', marginLeft: 5 }}>我已阅读并同意以上</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity><Text style={{ color: $THEME_COLOR }}>协议</Text></TouchableOpacity>
          </View>
          <Touchable style={[styles.themebtn,{backgroundColor:$THEME_COLOR}]} onPress={this.onsubmit} >
            <Text style={styles.themebtntext}>注册</Text>
          </Touchable>
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
  readcommit: {
    flexDirection: 'row',
    marginTop: 10,
    paddingLeft: 10,
    height: 30,
    paddingRight: 10,
    alignItems: 'center',
  },
  actbtn: {
    padding: 10
  }
});

module.exports = Register;
