/**
 * PageLive
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
  ActivityIndicator,
  ViewPagerAndroid
} from 'react-native';

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import EmptyContent from '../common/emptycontent';
import NoImg from '../common/noimg';

const { height} = Dimensions.get('window');

class PageLive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isened:false,
      isempty:false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    }
    this.renderFooter = this.renderFooter.bind(this);
    this.renderMovies = this.renderMovies.bind(this);
    this.renderEnd = this.renderEnd.bind(this);
  }

  componentWillMount() {
    let URL = this.props.url + 'queryType=1&orderType=1&keyWord=' + this.props.keywords;
    this.props.onSetNum(1,0);
    fetch(URL)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((responseData) => {
        let Date = responseData.datas;
        this.props.onSetNum(1,Date.length);
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(Date)
        })
        if(!Date.length){
          this.setState({
            isempty:true
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

  renderFooter(){
    if(!this.state.loaded){     
      return <Loading height={height-150} />
    }else if(this.state.isempty){
      return (
        <EmptyContent height={height-150} />
      )
    }
  }

  renderEnd(){
    if(!this.state.isended&&!this.state.isempty){     
      ToastAndroid.show('已经没有更多数据了~', ToastAndroid.SHORT);
      this.setState({
        isended:true
      })
    }
  }

  renderMovies(rowDate, i, j) {
    let year = rowDate.beginTime.slice(0,10);
    let beginTime = rowDate.beginTime.slice(11,16);
    let endTime = rowDate.endTime.slice(11,16);
    return (
      <View style={styles.listview} >
        {(rowDate.posters[0])?<Image style={styles.listimg} source={{ uri: rowDate.posters[0].LocalPath }} />:<NoImg  style={{width:60,height:60}} />}
        <View style={styles.listtitle}>
          <Text style={styles.listtext} numberOfLines={1}>{rowDate.resourceName}</Text>
          <Text style={[styles.listsubtext,{color: $THEME_COLOR}]}>{year+' '+beginTime+'~'+endTime}</Text>
        </View>
      </View>
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
    padding:6,
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
    fontSize: 14,
  },
  listimg: {
    width:60,
    height:60,
    resizeMode:'contain'
  }
});

module.exports = PageLive;
