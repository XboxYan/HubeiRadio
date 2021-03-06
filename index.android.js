/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StatusBar,
  View,
  Navigator
} from 'react-native';

import Storage from 'react-native-storage';
import Index from './app';
import SplashScreen from 'react-native-splash-screen';

let storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync同步方法，无缝返回最新数据。
  sync: {
    // 同步方法的具体说明会在后文提到
  }
})

global.storage = storage;

class App extends Component {

  constructor(props) {
    super(props);
  }

  renderScene(route, navigator) {
    let Component = route.name;
    return (
      <Component {...route.prams} navigator={navigator} route={route} />
    );
  }

  componentDidMount() {
    // do anything while splash screen keeps, use await to wait for an async task.
    SplashScreen.hide();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        
        <Navigator
          initialRoute={{ name: Index }}
          configureScene={(route) => Object.assign(Navigator.SceneConfigs.PushFromRight, { defaultTransitionVelocity: 10, gestures:null })}
          renderScene={this.renderScene}
          />
      </View>

    );
  }
}


AppRegistry.registerComponent('HubeiRadio', () => App);
