import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
  ActivityIndicator,
  Emitter,
  CameraRoll
} from 'react-native';
import { Font, Asset } from 'expo';
import Images from './images/index.js';
import Styles from './components/HomeScreenStyle.js';
import ViewShot from "react-native-view-shot";

const quoteArray = require('./quotes.json');
//import RNFS from 'react-native-fs';

var showedImgsArray = [];

export default class HomeScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       quoteText: '',
       quoteAuthor: '',
       quoteFontSize: 30,
       backgroundImageSource: Images['IMG_12'],
       fontLoaded: false,
       pressScreenText: 'Press screen for more quotes!',
       fadeAnim: new Animated.Value(0),
       downloadIconOpacity: 1
     };
   }

async componentDidMount() {
  await Font.loadAsync({
      'merriweather-regular': require('./Fonts/merriweather/merriweather-regular-webfont.ttf'),
      'riesling': require('./Fonts/riesling.ttf')
    });
    this.setState({
      fontLoaded: true
    })
  }

  _changeImage = () => {
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 0,
          duration: 700,
        }
      ).start();

      var imgName = 'IMG_' + this._getRandomInt(28);
      while(showedImgsArray.includes(imgName)){
          imgName = 'IMG_' + this._getRandomInt(28);
       }
       showedImgsArray.push(imgName);

       if(showedImgsArray.length == 10)
       showedImgsArray = [];


      setTimeout(() => {
        this.setState({
          backgroundImageSource: Images[imgName],
          quoteText: '',
          quoteAuthor: '',
          pressScreenText: '',
        })
      }, 900);
    }

  _changeQuote = () => {
      var randomQuote = quoteArray[this._getRandomInt(quoteArray.length)];
      var quote = randomQuote[1];
      var author = randomQuote[2];
      var quoteFontSize = 30;

      if(quote.length <= 200)
        quoteFontSize = 30;
      else if(quote.length > 400)
          quoteFontSize = 18;
      else if(quote.length > 200)
        quoteFontSize = 20;
      else if(quote.length > 145)
        quoteFontSize = 25;


      this.setState({
        quoteText: quote,
        quoteAuthor: author.trim() == '' ? author : "\n-- " + author,
        quoteFontSize: quoteFontSize,
        fontLoaded: true
      })

      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 900,
        }
      ).start();
  }

  async _screenshotPicture () {
    let permission = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL);

    if (permission.status === 'granted') {
      this.setState({
        downloadIconOpacity: 0,
        pressScreenText: ""
      })

      setTimeout(() => {


        this.refs.viewShot.capture().then(uri => {
           console.log("do something with ", uri);
           this._savePicture(uri);
           this.setState({
             downloadIconOpacity: 1,
           })

        });
      }, 900);
    }

  }

  _savePicture(uri){
    var promise = CameraRoll.saveToCameraRoll(uri);
    promise.then(function(result) {
      console.log('save succeeded ' + result);
    }).catch(function(error) {
      console.log('save failed ' + error);
    });
  }

  _getRandomInt = (interval) =>
  {
      return Math.floor(Math.random() * interval);
  }

  render() {
    if (!this.state.fontLoaded) {
        return null;
      }
    return (
      <View style={Styles.container}>
        <Text style={Styles.headText}>
          Daily Wisdom
        </Text>
        <View style={{top: '10%'}}>
          <ActivityIndicator size="large" color='rgba(255, 238, 170, 0.9)'/>
        </View>
          <Animated.View style={[Styles.backgroundContainer, {opacity: this.state.fadeAnim}]} >
              <TouchableOpacity style={Styles.container}  onPress={() => this._changeImage()}   >
              <ViewShot ref="viewShot" style={Styles.container}  options={{ format: "jpg", quality: 0.9 }}>
                <View style={Styles.backgroundContainer}>
                  <ImageBackground style={Styles.container} source={this.state.backgroundImageSource}
                  onLoad={() => this._changeQuote()}/>
                </View>
                <View>
                  <Text style={Styles.headText}>
                    Daily Wisdom
                  </Text>
                  <Text style={[Styles.quoteText, {fontSize: this.state.quoteFontSize}]} >
                    {this.state.quoteText}
                    <Text style={Styles.authorText}>
                        {this.state.quoteAuthor}
                    </Text>
                  </Text>
                  <Text style={Styles.pressScreenText}>
                    {this.state.pressScreenText}
                  </Text>
                </View>
                </ViewShot>
              </TouchableOpacity>

              <TouchableOpacity style={{top: '92%', left: '85%', opacity: this.state.downloadIconOpacity}} onPress={() => this._screenshotPicture()}>
                <Image style={{ height: 50, width: 50 }} source={require('./images/iconDownload.png')} />
              </TouchableOpacity>

          </Animated.View>

      </View>
    );
  }
};

AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
