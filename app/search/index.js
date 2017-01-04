/**
 * Search
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ToastAndroid,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  InteractionManager
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchMain from './searchmain';
import Touchable from '../common/touchable';
import Loading from '../common/loading';

const STATUS_HEIGHT = (Platform.Version&&Platform.Version>=19)?StatusBar.currentHeight:0;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      text: '',
      ischange: true,
      search: false,
      history: []
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onClearall = this.onClearall.bind(this);
    //处理安卓Back键
    const { navigator } = this.props;
    const routers = navigator.getCurrentRoutes();
    const top = routers[routers.length - 1];
    top.handleBack = this.handleBack.bind(this);
  }
  handleBack() {
    storage.save({
      key: 'searchhistory',  // 注意:请不要在key中使用_下划线符号!
      rawData: this.state.history,
      expires: null
    });
    let isBack = this.state.text;
    if (!isBack) {
      this.props.navigator.pop();
    } else {
      this.setState({
        text: '',
        ischange: true,
        search: false,
      })
    }
  }
  onSubmit(keys) {
    let text = keys.replace(/^ +| +$/g, '');
    if (!text) {
      ToastAndroid.show('请输入点内容~', ToastAndroid.SHORT);
      this.refs.searchbar.focus();
      this.setState({
        text: ''
      })
    } else if (this.state.ischange) {
      this.setState({
        search: true,
        ischange: false
      })
      let _history = this.state.history;
      let index = _history.indexOf(text);
      if (index >= 0) {
        _history.splice(index, 1);
      }
      _history.push(text);
      //最多保留20条搜索历史记录
      if (_history.length > 20) {
        _history.reverse().pop();
        _history.reverse()
      }
      this.setState({
        history: _history
      })
      this.refs.searchbar.blur();
    }
  }
  onClear(index) {
    let _history = this.state.history;
    _history.splice(index, 1);
    this.setState({
      history: _history
    })
  }
  onClearall() {
    this.setState({
      history: []
    })
  }
  onChange(text) {
    this.setState({
      text: text,
      ischange: true,
      search: false
    })
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        actions: true
      })
      storage.load({
        key: 'searchhistory',
      }).then(ret => {
        this.setState({ history: ret })
      }).catch(err => {
        this.setState({ history: [] })
      })
    })
  }
  render() {
    const { navigator } = this.props;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <View style={[styles.searchhd, { backgroundColor: $THEME_COLOR }]}>
          <Touchable
            style={styles.btn}
            onPress={() => this.props.navigator.pop()} >
            <Icon name='arrow-back' size={24} color='#fff' />
          </Touchable>
          <TextInput
            ref="searchbar"
            onChangeText={this.onChange}
            onSubmitEditing={() => this.onSubmit(this.state.text)}
            value={this.state.text}
            style={styles.searchbar}
            placeholder="请输入片名、演员、导演"
            placeholderTextColor="#fff"
            autoFocus={true}
            returnKeyType="search"
            underlineColorAndroid='transparent' />
          <Touchable style={styles.btn} onPress={() => this.onSubmit(this.state.text)}>
            <Icon name='search' size={24} color='#fff' />
          </Touchable>
        </View>
        <View style={styles.searchbd}>
          {this.state.actions ? <SearchMain state={this.state.search} ischange={this.state.ischange} keywords={this.state.text} history={this.state.history} navigator={navigator} onChangeText={this.onChange} onClear={this.onClear} onClearall={this.onClearall} onSubmit={this.onSubmit} /> : <Loading />}
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  searchhd: {
    paddingTop: STATUS_HEIGHT,
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
  searchbar: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    color: '#fff'
  },
  searchbd: {
    flex: 1
  }

});

module.exports = Search;
