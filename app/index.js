/**
 * index
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Navigator,
  TouchableNativeFeedback,
  Text,
  View,
  Platform,
  BackAndroid,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Home from './home';
import Tv from './tv';
import Movie from './movie';
import Person from './person';
import Login from './login';
import Touchable from './common/touchable';
import Orientation from 'react-native-orientation';

let $USER_INFO = {};
let $THEME_COLOR = 'orangered';//#17d2fb';
global.$USER_INFO = $USER_INFO;
global.$THEME_COLOR = $THEME_COLOR;

class Tabitem extends Component {
  render() {
    let selected = this.props.selected;
    return (
      <Touchable
        onPress={this.props.onPress}
        style={[this.props.style, selected && { backgroundColor: $THEME_COLOR }]} >
        <Icon name={this.props.name} size={24} color={selected ? '#fff' : '#666'} />
        <Text style={[styles.tabText, selected && { color: '#fff' }]}>{this.props.title}</Text>
      </Touchable>
    )
  }
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.jumpPage = this.jumpPage.bind(this);
    this.onBackAndroid = this.onBackAndroid.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.state = {
      selectedTab: Home,
    }
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  componentDidMount() {

    Orientation.lockToPortrait();
    storage.load({
      key: 'user',
    }).then(ret => {
      // 如果找到数据，则在then方法中返回
      ToastAndroid.show('用户登录成功~', ToastAndroid.SHORT);
      $USER_INFO.loginState = ret.loginState;
      $USER_INFO.userName = ret.userName;
    }).catch(err => {
      // 如果没有找到数据且没有同步方法，
      // 或者有其他异常，则在catch中返回
      ToastAndroid.show('用户未登录~', ToastAndroid.SHORT);
      $USER_INFO.loginState = false;
      $USER_INFO.userName = '';
    })
  }

  onBackAndroid() {
    let navigator = this.props.navigator;
    const routers = navigator.getCurrentRoutes();
    if (routers.length > 1) {
      const top = routers[routers.length - 1];
      if (top.ignoreBack) {
        // 路由或组件上决定这个界面忽略back键
        return true;
      }
      const handleBack = top.handleBack;
      //console.log(top)
      if (handleBack) {
        // 路由或组件上决定这个界面自行处理back键
        handleBack();
      } else {
        // 默认行为： 退出当前界面。
        navigator.pop();
      }
      return true;
    } else {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  }

  renderScene(route, navigator) {
    let Component = route.name;
    return (
      <Component navigator={this.props.navigator} route={route} />
    );
  }

  jumpPage(page) {
    let navigator = this.refs.navigator;
    let CurrentRoutes = navigator.getCurrentRoutes();
    let index = 0;
    let isExist = false;

    CurrentRoutes.some((el, i) => {
      if (el.name === page) {
        index = i;
        isExist = true;
      }
    })

    if (isExist) {
      let nextRoute = CurrentRoutes[index];
      if (this.state.selectedTab != page) {
        navigator.jumpTo(nextRoute);
      } else {
        //alert('正在当前页面')
      }
    } else {
      navigator.push({ name: page });
    }
    this.setState({ selectedTab: page });
  }

  render() {
    let TabContent = this.state.selectedTab
    return (
      <View style={styles.content}>
        <View style={styles.content}>
          <Navigator
            ref='navigator'
            initialRoute={{ name: TabContent }}
            configureScene={() => Object.assign(Navigator.SceneConfigs.FadeAndroid, { defaultTransitionVelocity: 200 })}
            renderScene={this.renderScene}
            />
        </View>
        <View style={styles.tabbar}>
          <Tabitem style={styles.center} name="home" title="推荐" selected={TabContent === Home} onPress={() => this.jumpPage(Home)} />
          <Tabitem style={styles.center} name="live-tv" title="电视" selected={TabContent === Tv} onPress={() => this.jumpPage(Tv)} />
          <Tabitem style={styles.center} name="local-movies" title="影视" selected={TabContent === Movie} onPress={() => this.jumpPage(Movie)} />
          <Tabitem style={styles.center} name="person" title="我的" selected={TabContent === Person} onPress={() => this.jumpPage(Person)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  tabbar: {
    backgroundColor: '#fff',
    height: 48,
    flexDirection: 'row',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 10,
    color: '#666'
  },
});

module.exports = Index;
