/**
 * Video
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import EmptyContent from '../common/emptycontent';

class Videocomments extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
        <EmptyContent text='暂无相关评论~' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    height:250,
    backgroundColor:'#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = Videocomments;
