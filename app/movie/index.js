/**
 * Movie
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class Movie extends Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
      <View style={styles.container}>
        <Text style={{color:'#fff'}}>视频页面</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

module.exports = Movie;
