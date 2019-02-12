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
  CameraRoll,
  Share,
  Platform
} from 'react-native';
import { Font, Asset, Linking } from 'expo';
import Images from './images/index.js';
import Styles from './components/HomeScreenStyle.js';
import ViewShot from "react-native-view-shot";
import ReactNativeTooltipMenu from 'react-native-tooltip-menu';

const quoteArray = require('./quotes.json');
var showedImgsArray = [];
var showedQuotesArray = [];
export default class HomeScreen extends Component {
  constructor(props) {
     super(props);
     this.state = {
       quoteText: '',
       quoteAuthor: '',
       quoteFontSize: 30,
       backgroundImageSource: Images['IMG_' + Math.floor(Math.random() * 28)],
       fontLoaded: false,
       pressScreenText: 'Press screen for more quotes!',
       pressScreenTextOpacity: new Animated.Value(1),
       fadeAnim: new Animated.Value(0),
       downloadIconOpacity: new Animated.Value(0),
       downloadIconTop: new Animated.Value(300),
     };
   }

 onShare () {
   this.setState({
     pressScreenText: '',
   })

    this.refs.viewShot.capture().then(uri => {
      var origURL = CameraRoll.saveToCameraRoll(uri);

      if(Platform.OS === "android")
      {
        Share.share({
         message:
           'React Native | A framework for building native apps using React',
           url: origURL
       });
     }else {
       console.log("HAAAY - " +uri);
       var origURL = CameraRoll.saveToCameraRoll(uri);
       let instagramURL = `instagram://library?AssetPath=${uri}`;
       console.log("Wilshare . " + instagramURL);
       Linking.openURL(instagramURL);
     }
  });

};

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
       showedImgsArray.shift();

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

      while(showedQuotesArray.includes(randomQuote[1])){
          randomQuote = quoteArray[this._getRandomInt(quoteArray.length)];
       }
       showedQuotesArray.push(randomQuote);

      if(showedQuotesArray.length == 40)
          showedQuotesArray.shift();

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
        quoteAuthor: author == '' ? author : "\n-- " + author,
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

  async _screenshotPicture() {
    let permission = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL);

    if (permission.status === 'granted') {
      this.setState({
        pressScreenText: ""
      })

      this.refs.viewShot.capture().then(uri => {
         this._savePicture(uri);
         console.log(uri);
         //this.onShare(uri);
      });
    }
  }

  _savePicture(uri){
    var promise = CameraRoll.saveToCameraRoll(uri);

    Animated.parallel([
      Animated.timing(
        this.state.downloadIconOpacity,
        {
          toValue: 1,
          duration: 500,
        }
      ),
      Animated.timing(
        this.state.downloadIconTop,
        {
          toValue: 1000,
          duration: 2100,
        }
      )
    ]).start();

    setTimeout(() => {
      Animated.timing(
        this.state.downloadIconOpacity,
        {
          toValue: 0,
          duration: 700,
          delay: 500
        }
      ).start();
    }, 500);

    setTimeout(() => {
      this.setState({
        downloadIconTop: new Animated.Value(50),
        pressScreenText: "Image saved to cameraroll"
      })

      Animated.timing(
        this.state.pressScreenTextOpacity,
        {
          toValue: 0,
          duration: 1700,
        }
      ).start();
    }, 1500);

    setTimeout(() => {
      this.setState({
        downloadIconTop: new Animated.Value(50),
        pressScreenText: ""
      })

      Animated.timing(
        this.state.pressScreenTextOpacity,
        {
          toValue: 1,
          duration: 100,
        }
      ).start();
    }, 4000);

    promise.then(function(result) {
      console.log('save succeeded');
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
                  <Animated.View style={{ opacity: this.state.pressScreenTextOpacity }} >
                    <Text style={Styles.pressScreenText}>
                      {this.state.pressScreenText}
                    </Text>
                  </Animated.View>
                </View>
                </ViewShot>
                <Animated.View style={{opacity: this.state.downloadIconOpacity, top: this.state.downloadIconTop}} >
                <Image style={{
                           alignSelf: 'center'}}
                       source={require('./images/iconUglyDownload.png')} />
                 </Animated.View>

              </TouchableOpacity>

              <ReactNativeTooltipMenu
                    buttonComponent={
                      <View style={{
                          backgroundColor: color='rgba(255, 238, 170, 0.7)',
                          padding: 10,
                          borderRadius: 25,
                        }}>
                        <Image source={require('./images/iconMenu.png')} />
                      </View>
                    }
                    items={[
                      {
                        label: 'Save image to device',
                        onPress: () => this._screenshotPicture(),
                      },
                      {
                        label: 'Share to instagram',
                        onPress: () => this.onShare(),
                      },
                    ]} />
          </Animated.View>

      </View>
    );
  }
};

AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
