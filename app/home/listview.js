/**
 * ViewPager
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ListView,
  ProgressBarAndroid,
  StyleSheet,
  ScrollView,
  Dimensions,
  ToastAndroid,
  TouchableNativeFeedback,
  TouchableOpacity
} from 'react-native';

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import Videos from '../video';

const { width, height} = Dimensions.get('window');

let COMLUMN_URL = 'http://ottserver.hrtn.net:8080/msis/getCatalog?version=V001&catalogType=1&userCode=&parentId=&accessSource=3&resolution=800*600&terminalType=3'

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.renderMovies = this.renderMovies.bind(this);
    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    }
  }
  componentWillMount() {
    let MOVIE_URL = 'http://ottserver.hrtn.net:8080/msis/getAssetList?version=V001&pageSize=&curPage=&resolution=800*600&userCode=&queryType=0&catalogId='
      + this.props.columnID + '&assetType=&originName=&publishDate=&terminalType=3';
    fetch(MOVIE_URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(responseData.assetList)
        })
      })
      .catch(() => {
        this.setState({
          loaded: false,
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });

  }
  renderMovies(rowDate, i, j) {
    const { navigator } = this.props;
    return (
      <Touchable style={styles.listview} onPress={() => navigator.push({ name: Videos, id: rowDate.resourceCode })} >
        <Image style={styles.listimg} source={{ uri: rowDate.posterInfo[0].serverLocalPath }} />
        <View style={styles.listtextwrap}><Text numberOfLines={1} style={styles.listtext}>{rowDate.assetName}</Text></View>
      </Touchable>
    )
  }
  render() {
    if (!this.state.loaded) {
      return (
        <Loading height={200} />
      )
    }
    return (
      <ListView contentContainerStyle={styles.sublist}
        dataSource={this.state.dataSource}
        renderRow={this.renderMovies}
        />
    )
  }
}

class LatestList extends Component {
  constructor(props) {
    super(props);
    this.renderNews = this.renderNews.bind(this);
    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    }
  }
  componentWillMount() {
    fetch(COMLUMN_URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(responseData.Catalog)
        })
      })
      .catch(() => {
        this.state = {
          loaded: false
        }
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });

  }
  renderNews(rowDate, i, j) {
    const { navigator, userInfo } = this.props;
    return (
      <View>
        <Text style={[styles.subtitle,{color: $THEME_COLOR}]}>{rowDate.columnName}</Text>
        <MovieList columnID={rowDate.columnID} navigator={navigator} userInfo={userInfo} />
      </View>
    )
  }
  render() {
    if (!this.state.loaded) {
      return (
        <Loading height={300} />
      )
    }
    return (
      <View style={styles.content}>
        <ListView contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this.renderNews}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  sublist: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 3,
  },
  listview: {
    width: (width - 18) / 3,
    margin: 2,
    height: (width - 18) * 179 / 399 + 30,
    backgroundColor: '#fff',
  },
  subtitle: {
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 10
  },
  listtextwrap: {
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
  },
  listtext: {
    fontSize: 14,
    color: '#666'
  },
  listimg: {
    flex: 1,
    resizeMode: 'contain'
  }
});

module.exports = LatestList