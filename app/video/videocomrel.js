/**
 * Videocomrel
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  Image,
  ListView,
  View,
  Dimensions,
  ToastAndroid,
  ViewPagerAndroid
} from 'react-native';

const { width } = Dimensions.get('window');

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import EmptyContent from '../common/emptycontent';
import NoImg from '../common/noimg';

const RELURL = 'http://ottserver.hrtn.net:8080/msis/getRelateAsset?version=V001&resolution=800*600&userCode=&terminalType=3&resourceCode=';

class Videocomrel extends Component {
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
    this.set = this.set.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  set(id,title) {
    this.props.set(id,title);
    this.props.onSetPage(0,false);
  }

  fetchData() {
    let URL = RELURL + this.props.id;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let Data = responseData.assetList;
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(Data)
        })
        if (!Data.length) {
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

  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id != this.props.id) {
      this.setState({
        loaded: false
      })
      this.fetchData();
    }
  }

  renderFooter() {
    if (!this.state.loaded) {
      return <Loading height={250} />
    } else if (this.state.isempty) {
      return (
        <EmptyContent text='没有相关影片~' height={250} />
      )
    }
  }

  renderEnd() {
    if (!this.state.isended) {
      ToastAndroid.show('已经没有更多数据了~', ToastAndroid.SHORT);
      this.setState({
        isended: true
      })
    }
  }

  renderMovies(rowDate, i, j) {
    return (
      <Touchable style={styles.listview} onPress={() => this.set(rowDate.resourceCode,rowDate.assetName)} >
        {(rowDate.posterInfo[0]) ? <Image style={styles.listimg} source={{ uri: rowDate.posterInfo[rowDate.posterInfo.length - 1].LocalPath }} /> : <NoImg style={{ flex: 1 }} />}
        <View style={styles.listtextwrap}><Text numberOfLines={1} style={styles.listtext}>{rowDate.assetName}</Text></View>
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

module.exports = Videocomrel;
