/**
 * Video
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import Login from '../login';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from 'react-native-slider';

const {width} = Dimensions.get('window');

const VIDEO_URI = 'http://ottserver.hrtn.net:8080/msis/getPlayURL?playType=1&resolution=800*600&subID=99999999&terminalType=4&version=V001&resourceCode=';

class VideoCon1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
      rate: 1,
      paused: true,
      uriIsReady: false,
      resizeMode: 'contain',
      duration: 0,
      currentTime: 0,
      time: 0,
      onChange: false
    };
    this.onLoad = this.onLoad.bind(this);
    this.play = this.play.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.getUri = this.getUri.bind(this);
    this.onSeek = this.onSeek.bind(this);
    this.onSeekChange = this.onSeekChange.bind(this);
    //处理安卓Back键
    const { navigator } = this.props;
    const routers = navigator.getCurrentRoutes();
    const top = routers[routers.length - 1];
    top.handleBack = this.handleBack.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id != this.props.id) {
      this.setState({
        currentTime:0,
        duration: 0,
        uriIsReady:false,
        paused: true
      })
    }
  }

  handleBack() {
    this.setState({
      paused: true
    })
    //记录播放进度
    this.props.navigator.pop();
  }
  play() {
    if (!$USER_INFO.loginState) {
      this.props.navigator.push({ name: Login });
    } else {
      if (!this.state.uriIsReady) {
        ToastAndroid.show('播放串获取中,请稍后 ~', ToastAndroid.SHORT);
        this.getUri();
      }
      this.setState({
        paused: !this.state.paused
      })
    }
  }
  onEnd() {
    this.refs.video.seek(0);
    this.setState({
      paused: true
    })
  }
  onSeek(value) {
    this.setState({
      currentTime: value,
      onChange: false
    });
    this.refs.video.seek(value);
  }

  onSeekChange(value) {
    this.setState({
      time: value,
      onChange: true
    });
  }

  getUri() {
    const { id, info } = this.props;
    let URL = VIDEO_URI + id + '&productCode=' + 333 + '&userCode=' + $USER_INFO.userName + '&userName=' + $USER_INFO.userName;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        this.setState({
          uri: responseData.palyURL,
          uriIsReady: true
        })
        ToastAndroid.show('获取播放串成功~', ToastAndroid.SHORT);
      })
      .catch(() => {
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
        this.setState({
          paused: !this.state.paused
        })
      });
  }

  onLoad(data) {
    this.setState({ duration: data.duration });
    this.refs.video.seek(0);
  }

  onProgress(data) {
    this.setState({ currentTime: data.currentTime });
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }

  getTime(time) {
    let mins = parseInt(time / 60);
    let secs = parseInt(time % 60);
    return (mins < 10 ? ('0' + mins) : mins) + ':' + (secs < 10 ? ('0' + secs) : secs)
  }

  render() {
    const flexCompleted = this.getCurrentTimePercentage();
    const flexRemaining = (1 - this.getCurrentTimePercentage());
    let {currentTime, duration, paused, onChange, time} = this.state;

    return (
      <View style={styles.videocon}>
        {this.state.uriIsReady&&<Video source={{ uri: this.state.uri }}
          ref='video'
          style={styles.fullScreen}
          rate={1.0}
          paused={this.state.paused}
          volume={1.0}
          muted={false}
          playInBackground={false}
          resizeMode={this.state.resizeMode}
          onLoad={this.onLoad}
          onProgress={this.onProgress}
          onEnd={this.onEnd}
          repeat={false} />}

        <View style={styles.controls}>
          <TouchableOpacity activeOpacity={0.6} style={styles.actionbtn} onPress={this.play}>
            <Icon name={paused ? 'play-arrow' : 'pause'} size={24} color='#666' />
          </TouchableOpacity>
          <Text style={styles.timetext}>{this.getTime(onChange ? time : currentTime)}</Text>
          <Slider
            style={styles.progress}
            onSlidingComplete={this.onSeek}
            value={onChange ? time : currentTime}
            onValueChange={this.onSeekChange}
            minimumTrackTintColor={$THEME_COLOR}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            thumbTintColor={$THEME_COLOR}
            maximumValue={this.state.duration}
            />
          <Text style={styles.timetext}>{this.getTime(duration)}</Text>
          <TouchableOpacity activeOpacity={0.6} style={styles.actionbtn} onPress={() => this.refs.video.presentFullscreenPlayer()} >
            <Icon name='fullscreen' size={26} color='#666' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  videocon: {
    height: (width * 9 / 16) + 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 40,
    right: 0,
  },
  controls: {
    backgroundColor: "#eee",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  progress: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  track: {
    height: 2,
    borderRadius: 0
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 20
  },
  innerProgressCompleted: {
    height: 3
  },
  innerProgressRemaining: {
    height: 3,
    backgroundColor: '#ccc',
  },
  actionbtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timetext: {
    fontSize: 12,
    color: '#666'
  }
});

module.exports = VideoCon1;
