/**
 * SearchMain
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
  LayoutAnimation,
  UIManager,
  ViewPagerAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';
import PageStream from './pagestream';
import PageLive from './pagelive';
import SearchHistory from './searchhistory';
import SearchKey from './searchkey';

const {width} = Dimensions.get('window');

const SEARCHURL = 'http://ottserver.hrtn.net:8080/msis/queryAssetList?version=V001&pageSize=&curPage=&resolution=800*600&terminalType=3&';

class SearchMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchnum: [0, 0],
      actions: false,
      index: 0
    }
    this.onPageScroll = this.onPageScroll.bind(this);
    this.onSetPage = this.onSetPage.bind(this);
    this.onSetNum = this.onSetNum.bind(this);
    this.onSearch = this.onSearch.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    //LayoutAnimation.spring();
  }
  onSearch(text) {
    this.props.onChangeText(text);
    this.props.onSubmit(text);
  }
  onSetNum(index, num) {
    let _searchnum = this.state.searchnum;
    _searchnum[index] = num;
    this.setState({ searchnum: _searchnum });
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
  render() {
    const { navigator, keywords, state, ischange, history, onClear, onClearall} = this.props;
    let { index } = this.state;
    if (!state) {
      if (ischange&&keywords) {
        return <SearchKey keywords={keywords} onSearch={this.onSearch} />
      } else {
        return (
          <SearchHistory history={history} onSearch={this.onSearch} onClear={onClear} onClearall={onClearall} />
        )
      }

    }
    return (
      <View style={styles.content}>
        <View style={styles.tabhd}>
          <Touchable
            onPress={() => this.onSetPage(0)}
            style={styles.tabbar} >
            <Text style={[styles.tabbartext, index === 0 && { color: $THEME_COLOR }]}>点播 ({this.state.searchnum[0]})</Text>
          </Touchable>
          <Touchable
            onPress={() => this.onSetPage(1)}
            style={styles.tabbar} >
            <Text style={[styles.tabbartext, index === 1 && { color: $THEME_COLOR }]}>直播 ({this.state.searchnum[1]})</Text>
          </Touchable>
          <View style={[styles.tabline, { backgroundColor: $THEME_COLOR, left: index / 2 * width }]} />
        </View>
        <ViewPagerAndroid
          style={styles.content}
          ref='viewpager'
          initialPage={index}
          onPageSelected={this.onPageScroll}
          >
          <PageStream url={SEARCHURL} onSetNum={this.onSetNum} keywords={keywords} navigator={navigator} />
          <PageLive url={SEARCHURL} onSetNum={this.onSetNum} keywords={keywords} navigator={navigator} />
        </ViewPagerAndroid>
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
    width: width / 2,
    height: 2
  }
});

module.exports = SearchMain;
