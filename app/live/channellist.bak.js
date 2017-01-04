/**
 * ChannelList
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ListView,
  Platform,
  StatusBar,
  View,
  ScrollView,
  Dimensions,
  ToastAndroid
} from 'react-native';

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STATUS_HEIGHT = (Platform.Version && Platform.Version >= 19) ? StatusBar.currentHeight : 0;

const CHANNEL_URL = 'http://ottserver.hrtn.net:8080/msis/getChannelProgram?version=V001&resolution=800*600&terminalType=3&channelResourceCode=';

const {width, height} = Dimensions.get('window');

class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      programId: 0,
      time: new Date().getTime(),
      dataSource: [],
      tempDataSource: []
    }
    this.fetchData = this.fetchData.bind(this);

    this.jsStrtoTime = this.jsStrtoTime.bind(this);
    this.setCurrent = this.setCurrent.bind(this);

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loaded != this.props.loaded) {
      this.fetchData();
    }
    if (prevProps.time[0] != this.props.time[0]) {
      //alert('切换频道')
    }
  }

  componentWillMount() {
    if (this.props.loaded) {
      this.fetchData();
    }
  }

  fetchData() {
    if (this.state.loaded) return
    let URL = `${CHANNEL_URL}${this.props.id}&beginTime=${this.props.date} 00:00:00&endTime=${this.props.date} 23:59:59`;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        this.setState({
          loaded: true,
          dataSource: responseData.program,
          tempDataSource: responseData.program
        })
      })
      .catch(() => {
        this.setState({
          loaded: false
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  setCurrent(programId, index) {
    let newData = JSON.parse(JSON.stringify(this.state.tempDataSource));
    //newData[index].selected = true;
    this.setState({
      programId: programId,
      dataSource: this.state.dataSource.cloneWithRows(newData)
    })
  }

  jsStrtoTime(str_time) {
    var new_str = str_time.replace(/:/g, "-");
    new_str = new_str.replace(/ /g, "-");
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    return strtotime = datum.getTime();
  }


  render() {
    if (!this.state.loaded) {
      return <View style={styles.content}><Loading /></View>
    }

    return (
      <View style={styles.content}>
        {
          (this.state.loaded) ? <ScrollView style={styles.content}>
            {this.state.dataSource.slice(0, 10).map((item, key) => {
              let year = item.beginTime.slice(0, 10);
              let beginTime = item.beginTime.slice(11, 16);
              let endTime = item.endTime.slice(11, 16);
              return (
                <Touchable key={key} style={[styles.listview, { borderLeftWidth: 5, borderColor: $THEME_COLOR }]} >
                  <View style={styles.listtitle}>
                    <Text style={styles.listtext} numberOfLines={1}>{item.eventName}</Text>
                    <Text style={[styles.listsubtext, { color: $THEME_COLOR }]}>{year + ' ' + beginTime + '-' + endTime}</Text>
                  </View>
                  <Text style={styles.text}>{}</Text><Icon name='play-arrow' size={24} color='#888' />
                </Touchable>
              )
            }
            )}
          </ScrollView> : <View style={styles.content}><Loading /></View>
        }
      </View>
    )
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
    height: height - 100 - STATUS_HEIGHT - width * 9 / 16,
  },
  sublist: {
    padding: 3,
  },
  listview: {
    margin: 2,
    padding: 2,
    paddingRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  listtitle: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 10,
  },
  listtext: {
    fontSize: 16,
    margin: 5,
    color: '#666'
  },
  listsubtext: {
    margin: 5,
    marginTop: 0,
    fontSize: 14
  },
  text: {
    fontSize: 14,
    color: '#666'
  }
});

module.exports = ChannelList;
