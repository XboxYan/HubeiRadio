/**
 * SearchMain
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  PixelRatio,
  TouchableOpacity,
  ListView,
  LayoutAnimation
} from 'react-native';
import EmptyContent from '../common/emptycontent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/touchable';

const URI = 'http://ottserver.hrtn.net:8080/msis/getRelatedKeyWords?version=V001&keyWord=';

class SearchKey extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      loaded: false,
      isempty: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    }
  }
  renderItem(rowDate) {
    return (
      <View style={styles.searchitem}>
        <Touchable style={styles.searchtext} onPress={() => this.props.onSearch(rowDate.keyWord)}>
          <View style={styles.searchicon}><Icon name='youtube-searched-for' size={24} color='#999' /></View>
          <Text style={styles.searchtitle}>{rowDate.keyWord}</Text>
        </Touchable>
      </View>
    )
  }
  fetchData(keywords) {
    let _URL = URI + keywords;
    fetch(_URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(responseData.datas)
        })
        if (!responseData.datas.length) {
          this.setState({
            isempty: true
          })
        }else{
          this.setState({
            isempty: false
          })
        }
      })
      .catch(() => {
        this.setState({
          loaded: false,
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }
  componentWillMount() {
    this.fetchData(this.props.keywords)
  }
  componentWillUpdate(prevProps, prevState) {
    if (prevProps.keywords != this.props.keywords) {
      this.fetchData(prevProps.keywords)
    }
  }

  render() {
    if (this.state.isempty) {
      return (
        <EmptyContent text='找不到关联项~' />
      )
    }
    return (
      <ListView contentContainerStyle={styles.searchhistory}
        dataSource={this.state.dataSource}
        renderRow={this.renderItem}
        enableEmptySections={true}
        />
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  searchhistory: {
    backgroundColor: '#fff',
    flexDirection: 'column-reverse',
  },
  searchitem: {
    marginTop: -1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#cecece',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchtext: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  searchicon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchtitle: {
    fontSize: 15,
    color: '#333'
  },
  clearall: {
    height: 44,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearallbtn: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

module.exports = SearchKey;
