/**
 * Tv
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  UIManager,
  StatusBar,
  Platform,
  InteractionManager,
  ViewPagerAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';
import TvList from './tvlist';
import Search from '../search';
import Loading from '../common/loading';

const STATUS_HEIGHT = (Platform.Version&&Platform.Version>=19)?StatusBar.currentHeight:0;

const {width} = Dimensions.get('window');

const CHANNELURL = 'http://ottserver.hrtn.net:8080/msis/getChannels?version=V001&channelVersion=0&resolution=800*600&terminalType=3&videoType=';

class Tv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      index:0,
    }
    this.onPageScroll = this.onPageScroll.bind(this);
    this.onSetPage = this.onSetPage.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  onPageScroll(e) {
    this.setState({ index: e.nativeEvent.position });
    LayoutAnimation.configureNext({
      duration:200,
      update:{
        type:'easeInEaseOut'
      }
    });
  }
  onSetPage(index) {
    this.refs.viewpager.setPage(index);
    LayoutAnimation.spring();
    this.setState({
      index:index
    })
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        actions: true
      })
    })
  }

  render() {
    let { index } = this.state;
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <View style={[styles.top,{backgroundColor: $THEME_COLOR}]}>
          <Icon name="live-tv" size={24} color="#fff" />
          <Text style={styles.toptext}>电视直播</Text>
          <Touchable
            onPress={() => navigator.push({ name: Search })}
            style={styles.search} >
            <Icon name="search" size={24} color="#fff" />
          </Touchable>
        </View>
        <View style={styles.tabhd}>
          <Touchable
            onPress={() => this.state.actions&&this.onSetPage(0)}
            style={styles.tabbar} >
            <Text style={[styles.tabbartext, index === 0 && { color: $THEME_COLOR }]}>高清频道</Text>
          </Touchable>
          <Touchable
            onPress={() => this.state.actions&&this.onSetPage(1)}
            style={styles.tabbar} >
            <Text style={[styles.tabbartext, index === 1 && { color: $THEME_COLOR }]}>标清频道</Text>
          </Touchable>
          <View style={[styles.tabline,{backgroundColor: $THEME_COLOR,left:index/2*width}]} />
        </View>
        {(this.state.actions)?<ViewPagerAndroid
          style={styles.content}
          ref='viewpager'
          initialPage={index}
          onPageSelected={this.onPageScroll}
          >
          <TvList navigator={navigator} url={CHANNELURL + '1'} />
          <TvList navigator={navigator} url={CHANNELURL + '0'} />
        </ViewPagerAndroid>:<Loading />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  tabhd: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingBottom: 2
  },
  tabbar: {
    height: 48,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbartext: {
    fontSize: 14,
    color: '#666'
  },
  tabline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width:width/2,
  },
  top: {
    paddingTop:STATUS_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  search: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toptext: {
    color: '#fff',
    flex: 1,
    paddingLeft: 5,
    fontSize: 18,
  },

});

module.exports = Tv;