/**
 * Video
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  LayoutAnimation,
  UIManager,
  ViewPagerAndroid,
  View,
} from 'react-native';
import Touchable from '../common/touchable';
import Loading from '../common/loading';
import Videoabs from './videoabs';
import Videocomments from './videocomments';
import Videocomrel from './videocomrel';

const {width} = Dimensions.get('window');

class VideoInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
    this.onPageScroll = this.onPageScroll.bind(this);
    this.onSetPage = this.onSetPage.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
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
  onSetPage(index,bool=true) {
    this.refs.viewpager.setPage(index); 
    this.setState({
      index: index
    })
    if(bool){
      LayoutAnimation.spring()
    };
  }

  render() {
    let { index } = this.state;
    let { info, id, loaded, set } = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.tabhd}>
          <Touchable
            onPress={() => loaded && this.onSetPage(0)}
            style={styles.tabbar} >
            <Text style={[styles.tabbartext, index === 0 && { color: $THEME_COLOR }]}>简介</Text>
          </Touchable>
          <Touchable
            onPress={() => loaded && this.onSetPage(1)}
            style={styles.tabbar} >
            <Text style={[styles.tabbartext, index === 1 && { color: $THEME_COLOR }]}>评论</Text>
          </Touchable>
          <Touchable
            onPress={() => loaded && this.onSetPage(2)}
            style={styles.tabbar} >
            <Text style={[styles.tabbartext, index === 2 && { color: $THEME_COLOR }]}>相关</Text>
          </Touchable>
          <View style={[styles.tabline, { backgroundColor: $THEME_COLOR, left: index / 3 * width }]} />
        </View>
        {loaded ? <ViewPagerAndroid
          style={styles.content}
          ref='viewpager'
          initialPage={index}
          onPageSelected={this.onPageScroll}>
          <Videoabs set={set} id={id} />
          <Videocomments id={id} />
          <Videocomrel id={id} set={set} onSetPage={this.onSetPage} />
        </ViewPagerAndroid> : <Loading height={250} />}
      </View>
    );
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
    width: width / 3,
    height: 2
  }
});

module.exports = VideoInfo;
