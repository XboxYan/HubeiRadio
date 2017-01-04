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
    Dimensions,
    ToastAndroid
} from 'react-native';

import Touchable from '../common/touchable';
import Loading from '../common/loading';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Login from '../login';

const STATUS_HEIGHT = (Platform.Version && Platform.Version >= 19) ? StatusBar.currentHeight : 0;

const CHANNEL_URL = 'http://ottserver.hrtn.net:8080/msis/getChannelProgram?version=V001&resolution=800*600&terminalType=3&channelResourceCode=';

const {width, height} = Dimensions.get('window');

class ChannelList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            programId: 0,
            isCurrent: this.props.loaded,
            isLive: true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            tempDataSource: []
        }
        this.fetchData = this.fetchData.bind(this);
        this.renderMovies = this.renderMovies.bind(this);
        this.jsStrtoTime = this.jsStrtoTime.bind(this);
        this.setCurrent = this.setCurrent.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.loaded != this.props.loaded) {
            this.fetchData();
            if(this.state.loaded){
                //this.refs.listView.scrollTo({y:300,animated:true})
            }
        }
        if (prevProps.programId != this.props.programId) {          
            if (this.state.isLive) { this.setState({ isLive: false }) }
            if (!this.props.loaded && this.state.isCurrent) {
                this.setState({ isCurrent: false });
                this.setCurrent(this.props.programId);
            }
        }
    }

    componentWillMount() {
        if (this.props.loaded) {
            this.fetchData();
        }
    }

    fetchData() {
        if (this.state.loaded) return
        let URL = `${CHANNEL_URL}${this.props.id}&beginTime=${this.props.date} 00:00:00&endTime=${this.props.date} 23:50:00`;
        fetch(URL)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then((responseData) => {
                this.setState({
                    loaded: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseData.program),
                    tempDataSource: responseData.program
                })
                this.refs.listView.scrollTo({y:300,animated:true})
            })
            .catch(() => {
                this.setState({
                    loaded: false
                })
                ToastAndroid.show('网络有误~', ToastAndroid.SHORT);
            });
    }

    setCurrent(programId) {
        let newData = JSON.parse(JSON.stringify(this.state.tempDataSource));
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

    renderMovies(rowDate, sectionID, rowID) {
        let year = rowDate.beginTime.slice(0, 10);
        let beginTime = rowDate.beginTime.slice(11, 16);
        let endTime = rowDate.endTime.slice(11, 16);
        let status = '';
        let isLive = false
        if (this.jsStrtoTime(rowDate.endTime) < new Date().getTime()) {
            status = ['回看', 'play-arrow', 1];
        } else if (this.jsStrtoTime(rowDate.beginTime) > new Date().getTime()) {
            status = ['预约', 'notifications', 0];
        } else {
            isLive = this.state.isLive;
            status = ['直播', 'equalizer', 2];
        }

        let selected = isLive || (rowDate.programId == this.state.programId);

        return (
            <Touchable style={[styles.listview, selected && { borderLeftWidth: 5, borderColor: $THEME_COLOR }]}
                onPress={() => {
                    if ($USER_INFO.loginState) {
                        if (!selected&&status[2]) {
                            this.setState({ isCurrent: true });
                            this.setCurrent(rowDate.programId, rowID);
                            if (status[2] === 1) {
                                this.props.set(3, rowDate.programId, rowDate.eventName, [rowDate.beginTime, rowDate.endTime]);
                            } else if (status[2] === 2) {
                                this.props.set(2, rowDate.programId);
                                ToastAndroid.show('直播中~', ToastAndroid.SHORT);
                            } 
                        }else {
                            ToastAndroid.show('预约功能还没做哦~', ToastAndroid.SHORT);
                        }
                    } else {
                        this.props.navigator.push({ name: Login });
                    }
                }
                } >
                <View style={styles.listtitle}>
                    <Text style={styles.listtext} numberOfLines={1}>{rowDate.eventName}</Text>
                    <Text style={[styles.listsubtext, { color: $THEME_COLOR }]}>{year + ' ' + beginTime + '-' + endTime}</Text>
                </View>
                <Text style={[styles.text, selected && { color: $THEME_COLOR }]}>{status[0]}</Text><Icon name={status[1]} size={22} color={selected ? $THEME_COLOR : '#888'} />
            </Touchable>
        )
    }
    render() {
        return (
            <View style={styles.content}>
                {
                    (this.state.loaded) ? <ListView contentContainerStyle={styles.sublist}
                        intialListSize={1}
                        ref='listView'
                        pageSize={1}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        renderSeparator={this.renderSeparator}
                        renderRow={this.renderMovies}
                        /> : <View style={styles.content}><Loading /></View>
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
        color: '#666',
        marginRight: 5
    }
});

module.exports = ChannelList;
