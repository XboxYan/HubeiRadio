/**
 * LiveList
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  InteractionManager,
  Dimensions,
  ToastAndroid,
  UIManager,
  LayoutAnimation,
  ViewPagerAndroid,
  View,
} from 'react-native';

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import ChannelList from './channellist';

const {width, height} = Dimensions.get('window');

const Day = 1000 * 60 * 60 * 24;

class LiveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      loaded: false,
      date: []
    }
    this.onPageScroll = this.onPageScroll.bind(this);
    this.onSetPage = this.onSetPage.bind(this);
    this.getDate = this.getDate.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  getDate(day) {
    let $Date = new Date();
    $Date.setTime(new Date().getTime() + Day * day);
    return `${$Date.getFullYear()}-${$Date.getMonth() + 1}-${$Date.getDate()}`
  }

  onPageScroll(e) {
    this.setState({ index: e.nativeEvent.position });
    LayoutAnimation.configureNext({
      duration: 200,
      update: {
        type: 'easeInEaseOut'
      }
    });
  }
  onSetPage(index) {
    this.refs.viewpager.setPage(index);
    LayoutAnimation.spring();
    this.setState({
      index: index
    })
  }

  componentWillMount() {
    this.setState({
      index: 2,
      date: [this.getDate(-2), this.getDate(-1), this.getDate(0), this.getDate(1), this.getDate(2)]
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loaded != this.props.loaded) {
      this.setState({
        loaded: true
      })
    }
  }

  render() {
    let {date, index} = this.state;
    const { navigator } = this.props;
    if (!this.state.loaded) {
      return <View style={styles.center}><Loading /></View>
    }
    return (
      <View style={styles.content}>
        <View style={styles.tabhd}>
          {
            date.map((item, key) => (
              <Touchable
                key={key}
                onPress={() => this.onSetPage(key)}
                style={styles.tabbar} >
                <Text style={[styles.tabbartext, (key === index) && { color: $THEME_COLOR }]}>{key === (parseInt(date.length / 2)) ? '今天' : item.substr(5)}</Text>
              </Touchable>
            ))
          }
          <View style={[styles.tabline, { width:width / date.length, backgroundColor: $THEME_COLOR, left: index / date.length * width }]}></View>
        </View>
        <ViewPagerAndroid
          style={styles.content}
          ref='viewpager'
          initialPage={index}
          onPageSelected={this.onPageScroll}
          >
          {
            date.map((item, key) => (
              <ChannelList set={this.props.set} navigator={navigator} programId={this.props.programId} id={this.props.id} loaded={key === index} key={'s'+key} index={key} date={item} />
            ))
          }
        </ViewPagerAndroid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  videocon: {
    height: width * 9 / 16,
    backgroundColor: '#333',
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
    height: 2
  },
});

module.exports = LiveList;
