/**
 * Video
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  View,
} from 'react-native';

import Loading from '../common/loading';

const VIDEOURL = 'http://ottserver.hrtn.net:8080/msis/getAssetDetail?version=V001&terminalType=3&resolution=800*600&resourceCode='

class TextView extends Component {
  render() {
    return (
      <View style={styles.textcon}>
        <View style={{marginTop:3,height:14,width:2,backgroundColor: $THEME_COLOR}}></View>
        <View style={[styles.texthd, { borderColor: $THEME_COLOR }]}><Text style={styles.texthdtext}>{this.props.title}</Text></View>
        <View style={styles.textbd}><Text style={styles.textbdtext}>{this.props.text}</Text></View>
      </View>
    )
  }
}

class Videoabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      loaded: false
    }
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(bool = false) {
    let URL = VIDEOURL + this.props.id;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let info = {};
        let Data = responseData.assetInfo;
        info.assetName = Data.assetName;
        info.captionName = Data.captionName;
        info.assetTypes = Data.assetTypes;
        info.director = Data.director;
        info.leadingActor = Data.leadingActor;
        info.keyWord = Data.keyWord;
        info.summary = Data.summaryLong;
        info.product = Data.product.productCode
        this.setState({
          loaded: true,
          info: info
        })
        if (bool) {
          this.props.set(this.props.id, this.state.info.assetName);
        }
      })
      .catch(() => {
        this.setState({
          loaded: false
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  componentWillMount() {
    this.fetchData(true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id != this.props.id) {
      this.setState({
        loaded: false
      })
      this.fetchData();
    }
  }

  render() {
    let { info, loaded } = this.state;
    return (
      <ScrollView style={styles.content}>
        {
          loaded ? <View style={styles.textwrap}>
            <Text style={[styles.videotitle, { color: $THEME_COLOR }]}>{info.assetName || '暂无'}</Text>
            <TextView title='语言:' text={info.captionName || '暂无'} />
            <TextView title='类型:' text={info.assetTypes || '暂无'} />
            <TextView title='导演:' text={info.director || '暂无'} />
            <TextView title='主演:' text={info.leadingActor || '暂无'} />
            <TextView title='关键词:' text={info.keyWord || '暂无'} />
            <TextView title='简介:' text={info.summary || '暂无'} />
          </View> : <Loading height={250} />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  textwrap: {
    padding: 5,
  },
  textcon: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    margin: 5,
  },
  texthd: {
    paddingRight:15,
    alignItems: 'center',
  },
  texthdtext: {
    fontSize: 14,
    color: '#666',
    width: 55,
    textAlign:'right'
  },
  textbd: {
    flex: 1,
    alignItems: 'flex-start'
  },
  textbdtext: {
    fontSize: 14,
    color: '#666'
  },
  videotitle: {
    fontSize: 18,
    paddingVertical: 10,
    paddingLeft: 5
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = Videoabs;
