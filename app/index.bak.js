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
import Home from './home/index';
import Favorite from './favorite/index';
import Movie from './movie/index';
import Person from './person/index';

class Tabitem extends Component {
  render() {
    let selected = this.props.selected;
    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        onPress={this.props.onPress}
        background={TouchableNativeFeedback.Ripple('#ccc') } >
        <View style={this.props.style}>
          <Icon name={this.props.name} size={24} color={selected ? '#38f' : '#666'} />
          <Text style={[styles.tabText, selected && { color: '#38f' }]}>{this.props.title}</Text>
        </View>
      </TouchableNativeFeedback>
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
      selectedTab: Home
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

  onBackAndroid() {
    let navigator = this.props.navigator;
    const routers = navigator.getCurrentRoutes();
    if (routers.length > 1) {
      navigator.pop();
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

  renderScene(route) {
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
      }else{
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
            ref = 'navigator'
            initialRoute = {{ name: Home }}
            configureScene = {() => Navigator.SceneConfigs.FadeAndroid}
            renderScene = {this.renderScene}
            />
        </View>
        <View style={styles.tabbar}>
          <Tabitem style={styles.center} name="home" title="主页" selected={TabContent === Home} onPress={() => this.jumpPage(Home) } />
          <Tabitem style={styles.center} name="favorite" title="关注" selected={TabContent === Favorite} onPress={() => this.jumpPage(Favorite) } />
          <Tabitem style={styles.center} name="movie" title="视频" selected={TabContent === Movie}  onPress={() => this.jumpPage(Movie) } />
          <Tabitem style={styles.center} name="person" title="我的" selected={TabContent === Person}  onPress={() => this.jumpPage(Person) } />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#f1f1f1',
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
