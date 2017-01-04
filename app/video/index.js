/**
 * Video
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  InteractionManager,
  Dimensions,
  ToastAndroid,
  View,
} from 'react-native';
import AppBar from '../common/appbar';
import VideoCon from '../common/videocon';
import VideoInfo from './videoinfo';
import NoImg from '../common/noimg';

const {width,height} = Dimensions.get('window');

const VIDEOURL = 'http://ottserver.hrtn.net:8080/msis/getAssetDetail?version=V001&terminalType=3&resolution=800*600&resourceCode='

class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      id: this.props.route.id,
      title: ''
    }
    this.set = this.set.bind(this);
  }
  set(id, title) {
    this.setState({
      id: id,
    })
    if (title) {
      this.setState({
        title: title
      })
    }
  }
  componentWillUpdate() {
    //alert(44444)
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        actions: true
      })
    })
  }
  
  render() {
    const { navigator } = this.props;
    let { actions, index, id,type } = this.state
    return (
      <View style={styles.content}>
        <AppBar title={this.state.title || '正在加载...'} navigator={navigator} />
        <NoImg style={styles.videocon} img={{width:100,height:100}} />
        {actions&&<VideoCon id={id} playType={1} title={this.state.title || '正在加载...'} navigator={navigator} />}
        <VideoInfo id={id} set={this.set} loaded={actions} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  videocon:{
    height: width * 9 / 16,
    backgroundColor: '#000',
  }
});

module.exports = Videos;
