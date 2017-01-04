/**
 * PageStream
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  Image,
  ListView,
  View,
  ToastAndroid,
  Dimensions,
  ViewPagerAndroid
} from 'react-native';

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import EmptyContent from '../common/emptycontent';
import NoImg from '../common/noimg';
import Videos from '../video';

const { width, height} = Dimensions.get('window');

class PageStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isened: false,
      isempty: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    }
    this.renderFooter = this.renderFooter.bind(this);
    this.renderMovies = this.renderMovies.bind(this);
    this.renderEnd = this.renderEnd.bind(this);
  }

  componentWillMount() {
    let URL = this.props.url + 'queryType=2&keyWord=' + this.props.keywords;
    this.props.onSetNum(0, 0);
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let Date = responseData.datas;
        this.props.onSetNum(0, Date.length);
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(Date)
        })
        if (!Date.length) {
          this.setState({
            isempty: true
          })
        }
      })
      .catch(() => {
        this.setState({
          loaded: false
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  renderFooter() {
    if (!this.state.loaded) {
      return <Loading height={height - 150} />
    } else if (this.state.isempty) {
      return (
        <EmptyContent height={height - 150} />
      )
    }
  }

  renderEnd() {
    if (!this.state.isended && !this.state.isempty) {
      ToastAndroid.show('已经没有更多数据了~', ToastAndroid.SHORT);
      this.setState({
        isended: true
      })
    }
  }

  renderMovies(rowDate, i, j) {
    return (
      <Touchable style={styles.listview} onPress={() => this.props.navigator.push({ name: Videos, id: rowDate.resourceCode })}>
        {(rowDate.posters[0]) ? <Image style={styles.listimg} source={{ uri: rowDate.posters[rowDate.posters.length - 1].LocalPath }} /> : <NoImg style={{ flex: 1 }} />}
        <View style={styles.listtextwrap}><Text numberOfLines={1} style={styles.listtext}>{rowDate.resourceName}</Text></View>
      </Touchable>
    )
  }
  render() {
    return (
      <ListView contentContainerStyle={styles.sublist}
        intialListSize={1}
        pageSize={1}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this.renderMovies}
        renderFooter={this.renderFooter}
        onEndReachedThreshold={50}
        onEndReached={this.renderEnd}
        />
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
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
  listtextwrap: {
    justifyContent: 'center',
    alignItems: 'center',
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

module.exports = PageStream;
