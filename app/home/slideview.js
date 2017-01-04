/**
 * ViewPager
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import Banner from 'react-native-banner';
import NoImg from '../common/noimg';
import Videos from '../video';

const { width } = Dimensions.get('window');

const BANNER_URL = 'http://ottserver.hrtn.net:8080/msis/getRecommendResource?version=V001&resolution=2&terminalType=3'

class SlideView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      dataSource: null
    }
  }

  componentWillMount() {
    fetch(BANNER_URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let banner_arr = []
        responseData.indexRemList.forEach((item) =>
          banner_arr.push({
            title: '',
            id: item.resourceCode,
            image: item.poster[0].LocalPath
          })
        )
        this.setState({
          loaded: true,
          dataSource: banner_arr
        })
      })
      .catch(() => {
        this.state = {
          loaded: false
        }
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });

  }

  render() {
    const { navigator } = this.props;
    const {loaded, dataSource} = this.state;
    if (!loaded) {
      return <NoImg style={{ height: width*9 / 16 }} img={{width:100,height:100}}  />
    }
    return (
      <Banner
        banners={dataSource}
        defaultIndex={0}
        intent={(index) => navigator.push({ name: Videos, id: dataSource[index].id })}
        />
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
});

module.exports = SlideView