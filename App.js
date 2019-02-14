import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  View,
  Text,
  TouchableWithoutFeedback,
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

var quoteArray = require('./quotes.json');

var showedImgsArray = [];

var matchingQuotesImages= [];
var noOfClicks = 0;
export default class HomeScreen extends Component {
  _shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

  constructor(props) {
     super(props);
     this.state = {
       quoteFontSize: 30,
       fontLoaded: false,
       pressScreenText: 'Press screen for more quotes!',
       pressScreenTextOpacity: new Animated.Value(1),
       fadeAnim: new Animated.Value(0),
       downloadIconOpacity: new Animated.Value(0),
       downloadIconTop: new Animated.Value(300),
     };
   }

   async componentDidMount() {
     this._matchImgAndQuote()

     await Font.loadAsync({
         'merriweather-regular': require('./Fonts/merriweather/merriweather-regular-webfont.ttf'),
         'riesling': require('./Fonts/riesling.ttf')
       });
       this.setState({
         fontLoaded: true
       })

       this._changeImage();
     }


async _matchImgAndQuote(){
  var j = 0;
  for(var i = 0; i < quoteArray.length; i++){
   if(j == 80)
     j = 0;

    quoteArray[i][3] = j;
    j++;
  };
  this.quoteArray = await this._shuffleArray(quoteArray);
}



 _onShare() {
   this.setState({
     pressScreenText: '',
   })

    this.refs.viewShot.capture().then(uri => {

      if(Platform.OS === "android")
      {
        Share.share({
           message: this.state.quoteText + this.state.quoteAuthor ,
           url: uri
       });
      } else {
       var origURL = CameraRoll.saveToCameraRoll(uri);
       let instagramURL = `instagram://library?AssetPath=${uri}`;
       Linking.openURL(instagramURL);
     }
  });
 };

  _previousQuote(){
   if(noOfClicks > 1)
      noOfClicks = noOfClicks - 2;

   this._changeImage();
 }

  _changeImage(){
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 0,
          duration: 400,
        }
      ).start();

      var randomQuote = quoteArray[noOfClicks];
      noOfClicks++;

       if(showedImgsArray.length == 35)
       showedImgsArray.shift();

      setTimeout(() => {
        this.setState({
          backgroundImageSource: Images['IMG_' + randomQuote[3]],
          quoteText: '',
          quoteAuthor: '',
          pressScreenText: '',
        })
         this._changeQuote(randomQuote[1], randomQuote[2]);
      }, 400);
    }

  _changeQuote(quote, author){
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
        quoteAuthor: "\n" + author,
        quoteFontSize: quoteFontSize,
        fontLoaded: true
      })

      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 700,
        }
      ).start();
  }

  async _screenshotPicture(){
    let permission = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL);

    if (permission.status === 'granted') {
      this.setState({
        pressScreenText: ""
      })

      this.refs.viewShot.capture().then(uri => {
         this._savePicture(uri);
         console.log(uri);
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

    _getRandomInt(interval)
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
        <Animated.View style={[Styles.backgroundContainer, {opacity: this.state.fadeAnim}]} >
              <TouchableWithoutFeedback style={Styles.container}  onPress={() => this._changeImage()}   >
              <View style={Styles.container} >
              <ViewShot ref="viewShot" style={Styles.container}  options={{ format: "jpg", quality: 0.9 }}>
                <View style={Styles.backgroundContainer}>
                  <ImageBackground style={Styles.backgroundContainer} source={this.state.backgroundImageSource}
                  />
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
                <Image style={{ alignSelf: 'center'}}
                       source={require('./images/iconUglyDownload.png')} />
                 </Animated.View>
                 </View>
              </TouchableWithoutFeedback>

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
                        label: 'Previous Quote',
                        onPress: () => this._previousQuote(),
                      },
                      {
                        label: 'Save image to device',
                        onPress: () => this._screenshotPicture(),
                      },
                      {
                        label: Platform.OS === "ios" ? 'Share to instagram' : 'Share Quote',
                        onPress: () => this._onShare(),
                      },
                    ]} />
          </Animated.View>

      </View>
    );
  }
};

// <TouchableOpacity style={{position: 'absolute', backgroundColor: 'rgba(255, 238, 170, 0.2)', height: '90%', width: '10%'}}
// onPress={() => this._lastImg()}>
// </TouchableOpacity>
AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
