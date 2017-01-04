/**
 * Live
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
import LiveList from './livelist';
import NoImg from '../common/noimg';

const {width, height} = Dimensions.get('window');

const VIDEOURL = 'http://ottserver.hrtn.net:8080/msis/getAssetDetail?version=V001&terminalType=3&resolution=800*600&resourceCode='

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: false,
      id: this.props.route.id,
      playType: 2,
      title: '',
      programId:0,
      time: [],
    }
    this.set = this.set.bind(this);
  }
  set(playType,programId,title,time) {
    this.setState({
      playType: playType,
      time: time,
      title: title,
      programId:programId
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
    const { navigator, route } = this.props;
    let { actions, title, time,programId, id, playType,postion} = this.state
    return (
      <View style={styles.content}>
        <AppBar title={title || route.title} navigator={navigator} />
        <NoImg style={styles.videocon} img={{ width: 100, height: 100 }} />
        {actions && <VideoCon id={id} title={title || route.title} playType={playType} navigator={navigator} time={time} />}
        <LiveList loaded={actions} id={id} set={this.set} navigator={navigator} programId={programId} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  videocon: {
    height: width * 9 / 16,
    backgroundColor: '#000',
  }
});

module.exports = Live;
