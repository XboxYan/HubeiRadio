/**
 * TvList
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

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import NoImg from '../common/noimg';

import Live from '../live';

const {height} = Dimensions.get('window');

class TvList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isened:false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    }
    this.renderFooter = this.renderFooter.bind(this);
    this.renderMovies = this.renderMovies.bind(this);
    this.renderEnd = this.renderEnd.bind(this);
  }

  componentWillMount() {
    let URL = this.props.url;
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let Date = responseData.channelInfo;
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(Date)
        })
      })
      .catch(() => {
        this.setState({
          loaded: false
        })
        ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
      });
  }

  renderFooter(){
    if(!this.state.loaded){     
      return <Loading height={height-200} />
    }
  }

  renderEnd(){
    if(!this.state.isended){     
      ToastAndroid.show('已经没有更多数据了~', ToastAndroid.SHORT);
      this.setState({
        isended:true
      })
    }
  }

  renderMovies(rowDate, i, j) {
    return (
      <Touchable style={styles.listview}  onPress={() => this.props.navigator.push({ name: Live, id: rowDate.ResourceCode, title:rowDate.channelName })} >
        <View style={styles.imgwrap}>{(rowDate.poster[0])?<Image style={styles.listimg} source={{ uri: rowDate.poster[0].LocalPath }} />:<NoImg style={{flex:1}} />}</View>
        <View style={styles.listtitle}>
          <Text style={styles.listtext} numberOfLines={1}>{rowDate.channelName}</Text>
        </View>
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
    padding: 3,
  },
  listview: {
    margin: 2,
    padding:2,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  listtitle:{
    flex:1,
    paddingLeft:10,
    paddingRight:10,
  },
  listtext: {
    fontSize: 16,
    color: '#666'
  },
  listsubtext:{
    marginTop:5,
    fontSize: 14
  },
  imgwrap:{
    backgroundColor:'#eee',
    padding:10,
    width:80,
    height:60,
  },
  listimg: {
    flex:1,
    resizeMode:'contain'
  }
});

module.exports = TvList;
