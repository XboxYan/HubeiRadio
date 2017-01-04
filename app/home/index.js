/**
 * Home
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  PixelRatio,
  StatusBar,
  Platform,
  StyleSheet
} from 'react-native';
import SlideView from './slideview';
import LatestList from './listview';
import Search from '../search';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';

const STATUS_HEIGHT = (Platform.Version&&Platform.Version>=19)?StatusBar.currentHeight:0;

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <View style={[styles.top,{backgroundColor:$THEME_COLOR}]}>
          <Image style={styles.logo} source={require('../../source/img/logo_m.png')} />
          <Touchable
            onPress={() => navigator.push({ name: Search })}
            style={styles.search} >
            <Icon name="search" size={24} color="#fff" />
          </Touchable>
        </View>
        <ScrollView style={styles.content}>
          <SlideView navigator={navigator} />
          <LatestList navigator={navigator} />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  top: {
    paddingTop:STATUS_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  search: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 40,
    resizeMode: 'contain',
  },
  toptext: {
    color: '#fff',
    flex: 1,
    fontSize: 16,
  },
  slideview: {
    height: 200,
  }
});

module.exports = Home;