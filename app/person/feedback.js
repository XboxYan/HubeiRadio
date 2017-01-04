/**
 * Feedback
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  KeyboardAvoidingView,
  View,
  Dimensions,
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppBar from '../common/appbar';
import Touchable from '../common/touchable';

const FEEDBACK_TYPE = ['问题反馈', '改善建议', '内容需求', '新手咨询', '其他'];
const { width } = Dimensions.get('window');

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedtype: 0
    }
  }
  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <AppBar title='建议与反馈' navigator={navigator} />
        <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <ScrollView style={styles.content}>
          <View style={styles.feedtype}>
            {FEEDBACK_TYPE.map(
              (item, index) => (
                <Touchable
                  key={'feedtype' + index}
                  onPress={() => this.setState({ feedtype: index })}
                  style={[styles.feeditem, (this.state.feedtype === index) && {borderColor:$THEME_COLOR}]}>
                  <Text style={[styles.feeditemtext, (this.state.feedtype === index) && {color:$THEME_COLOR}]}>{item}</Text>
                </Touchable>
              )
            )}
          </View>
          <Text style={[styles.title,{color:$THEME_COLOR}]}>请详细描述您的建议、意见、问题等：</Text>
          <View style={styles.inputwrap}>
            <TextInput
              style={styles.textarea}
              placeholder="请输入点什么..."
              placeholderTextColor="#ccc"
              autoFocus={true}
              multiline={true}
              numberOfLines={10}
              underlineColorAndroid='transparent' />
          </View>
          <Text style={[styles.title,{color:$THEME_COLOR}]}>您的联系方式（至少填写一项）:</Text>
          <View style={styles.inputwrap}>
            <View style={styles.inputitem}>
              <Text style={styles.inputlabel}>手机</Text>
              <TextInput style={styles.inputbar} keyboardType="numeric" maxLength={11} underlineColorAndroid='transparent' />
            </View>
            <View style={styles.inputitem}>
              <Text style={styles.inputlabel}>邮箱</Text>
              <TextInput style={styles.inputbar} keyboardType="email-address" underlineColorAndroid='transparent' />
            </View>
            <View style={styles.inputitem}>
              <Text style={styles.inputlabel}>QQ</Text>
              <TextInput style={styles.inputbar} keyboardType="numeric" underlineColorAndroid='transparent' />
            </View>
          </View>
          <Touchable style={[styles.themebtn,{backgroundColor:$THEME_COLOR}]} >
            <Text style={styles.themebtntext}>提交</Text>
          </Touchable>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedtype: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 7
  },
  feeditem: {
    width: (width - 32) / 3,
    height: 40,
    margin: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor:'transparent'
  },
  feeditemtext: {
    fontSize: 14,
    color: '#666'
  },
  title: {
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff'
  },
  textarea: {
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  inputwrap: {
    padding: 10,
    marginBottom: 10,
    paddingTop: 0,
    backgroundColor: '#fff'
  },
  inputitem: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputlabel: {
    width: 30,
    marginRight: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'right'
  },
  inputbar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#cecece',
  },
  themebtn: {
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 0,
    borderRadius: 2
  },
  themebtntext: {
    color: '#fff',
    fontSize: 16
  }
});

module.exports = Feedback;
