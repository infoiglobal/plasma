import React, { Component } from "react";
import {
  AppRegistry,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";

// import Key from Config.goolge_vision_key;
import RNFS from 'react-native-fs';
// import Spinner from 'react-native-spinkit';
import Config from "../../Config";
import {Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';

export default class TakePhoto extends Component {
  constructor() {
    super()
    this.state = {
      loading: false
    }
  }

  static navigationOptions = {
    title: "Verify",
    header: null
  };

  componentWillMount() {
    StatusBar.setHidden(true);
  }

  cleanData(data) {

    this.setState({
      loading: false
    })

    const cleanedData = JSON.parse(data._bodyText).responses[0].fullTextAnnotation.text;

    Actions.home({textDetect: cleanedData, capturePhotoPath : this.props.pictureData.uri});
    //
    // this.props.navigation.navigate('ImageResult', {
    //   path: cleanedData,
    //   homeKey: this.props.navigation.state.params.homeKey,
    //   cameraKey: this.props.navigation.state.key
    // })
  }

  async usePhoto(imgPath) {

    this.setState({
      loading: true
    })

    try {
      const fetchData = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${Config.goolge_vision_key}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                "requests": [{
                  "image": { "content": imgPath },
                  "features": [ { "type": "DOCUMENT_TEXT_DETECTION" } ]
                }]
        })
      })
      this.cleanData(fetchData);
    }

    catch(err) {
      console.log({ err })
    }
  }

  async convertImg() {

    //from camera /Users/jbecks/Library/Developer/CoreSimulator/Devices/D9FE59D4-5706-4B0B-98D7-9D7B9519D18A/data/Containers/Data/Application/CCDC4308-F7FA-443A-B9B1-0DEBBDF93C01/Documents/24D6D353-B8FA-414F-ADEC-92B672FD056D.jpg

    //from cameraRoll assets-library://asset/asset.JPG?id=729F50DA-9627-42A9-802D-69B22C9EECD2&ext=JPG

    // const imgPath = this.props.navigation.state.params.path;
    const imgPath =     this.props.pictureData.uri;

    try {
      const readInfo = await RNFS.readFile(imgPath, 'base64');
      this.usePhoto(readInfo);
    }
      
    catch(err) {
      console.log({ err })
    } 
  }

  render() {
    
    // console.log('key in verify', this.props.navigation.state.params.homeKey)

    // const { state, goBack } = this.props.navigation;

    return (
      <View>
        <ImageBackground
          style={ styles.img }
          source={{
            uri: state.params.path
          }}>

          <View style={ styles.topBar } />

          {/*<Spinner isVisible={ this.state.loading }*/}
                   {/*size={ 100 }*/}
                   {/*type={ 'Wave' }*/}
                   {/*color={ '#3DD8CE' } />*/}

          <View style={ styles.bottomBar }> 

            <TouchableOpacity style={ [styles.goBackBtn, styles.Btn] } onPress={ () => Actions.pop() }>
              {/*<Image source={require("../../../assets/left-arrow.png")}*/}
                  {/*style={ styles.icon } />*/}
              <Icon name='ios-camera'/>
              <Text style={ styles.btnTxt }>Quay lại</Text>
            </TouchableOpacity>

            <TouchableOpacity style={ [styles.submitBtn, styles.Btn] } onPress={ this.convertImg.bind(this) }>
              {/*<Image source={require("../../../assets/send.png")}*/}
                    {/*style={ styles.icon } />*/}
              <Icon name='ios-arrow-back'/>
              <Text style={ styles.btnTxt }>Dùng ảnh</Text>
            </TouchableOpacity>
            
          </View>

        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },

  img: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "space-between",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },

  topBar: {
    backgroundColor: "rgba(0,0,0,1)",
    height: 20,
    width: "100%"
  },

  bottomBar: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    width: '100%'    
  },
  
  Btn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    marginTop: 10
  },

  goBackBtn: {
    marginLeft: 15
  },

  btnTxt: {
    color: 'white'
  },

  submitBtn: {
    marginRight: 15
  },

  icon: {
    height: 25,
    width: 25
  }
});