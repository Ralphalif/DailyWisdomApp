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
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import * as Animatable from 'react-native-animatable';


var quoteArray = require('./quotes.json');
var showedImgsArray = [];
var matchingQuotesImages= [];
var noOfClicks = 0;
var direction = '';
export default class HomeScreen extends Component {
  handleViewRef = ref => this.view = ref;
  swipeTextRef =  ref => this.view = ref;

  constructor(props) {
     super(props);
     this.state = {
       quoteFontSize: 30,
       fontLoaded: false,
       pressScreenTextOpacity: new Animated.Value(1),
       fadeAnim: new Animated.Value(0),
       downloadIconOpacity: new Animated.Value(0),
       downloadIconTop: new Animated.Value(300),
       activityIndicatorOpacity: new Animated.Value(0),
     };
   }

  _shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

 async componentDidMount() {
   this._matchImgAndQuote()

   await Font.loadAsync({
       'merriweather-regular': require('./Fonts/merriweather/merriweather-regular-webfont.ttf'),
       'riesling': require('./Fonts/riesling.ttf')
     });

     this.setState({
       fontLoaded: true,
     })

     this._changeImage();

     setTimeout(() => {
       this.setState({
         pressScreenText: "Swipe for more"
       })
     }, 700);
   }

async _matchImgAndQuote(){
  var numbersArray = Array(80).fill(0).map((e,i)=>i+1);
  this.numbersArray = this._shuffleArray(numbersArray);

  this.quoteArray = this._shuffleArray(quoteArray);

  var j = 0;
  for(var i = 0; i < quoteArray.length; i++){
   if(j == 80)
      j = 0;

    quoteArray[i][3] = numbersArray[j];
    j++;
  };
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
       this._changeImage();
   }

  _changeImage(){
      var randomQuote = quoteArray[noOfClicks];
      noOfClicks++;

       if(showedImgsArray.length == 35)
       showedImgsArray.shift();

        this.setState({
          backgroundImageSource: Images['IMG_' + randomQuote[3]],
        })
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
          duration: 500,
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
          }
        ).start();
      }, 700);

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
          pressScreenText: "",
          pressScreenTextOpacity: new Animated.Value(1)
        })
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



  _swipeForward(){
    this.view.fadeOutLeftBig(600);

    setTimeout(() => {
      this._changeImage();
    }, 160);
    this.direction = 'right'

    this.setState({
      pressScreenText: ""
    })

    Animated.timing(
      this.state.activityIndicatorOpacity,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start();
  }

  _swipeBack(){
    if(noOfClicks > 1){
      Animated.timing(
        this.state.activityIndicatorOpacity,
        {
          toValue: 1,
          duration: 1000,
        }
      ).start();

      noOfClicks = noOfClicks - 2;
      this.view.fadeOutRightBig(600);

      setTimeout(() => {
        this._previousQuote();
      }, 160);
      this.direction = 'left'
    }
  }

_fadeIn(){
  Animated.timing(
    this.state.activityIndicatorOpacity,
    {
      toValue: 0,
      duration: 600,
    }
  ).start();

  this._changeQuote(quoteArray[noOfClicks][1], quoteArray[noOfClicks][2]);


  if(this.direction == 'right'){
    this.view.fadeInRightBig(800);
  }
  else if(this.direction == 'left'){
    this.view.fadeInLeftBig(800);
  }
}

  render() {
    if (!this.state.fontLoaded) {
        return null;
      }
    return (
      <View style={Styles.container}>
        <Animatable.Text animation="slideInDown" duration={900} style={Styles.headText}>
          Daily Wisdom
        </Animatable.Text>

        <Animated.View style={[Styles.backgroundContainer, {opacity: this.state.fadeAnim}]} >
          <GestureRecognizer style={Styles.container} onSwipeRight={() => this._swipeBack()}
          onSwipeLeft={() => this._swipeForward()} >
                <Animatable.View ref={this.handleViewRef} style={Styles.container} >
                <ViewShot ref="viewShot" style={Styles.container}  options={{ format: "jpg", quality: 0.9 }}>
                  <View style={Styles.backgroundContainer}>
                    <ImageBackground style={Styles.backgroundContainer} source={this.state.backgroundImageSource}
                    onLoad={() => this._fadeIn()}/>
                  </View>

                  <View>
                    <Text style={Styles.headText} animation="slideInDown" duration={900} >
                      Daily Wisdom
                    </Text>
                    <Animatable.Text animation="slideInUp" duration={1500} style={[Styles.quoteText, {fontSize: this.state.quoteFontSize}]} >
                      {this.state.quoteText}
                      <Text style={Styles.authorText}>
                          {this.state.quoteAuthor}
                      </Text>
                    </Animatable.Text>
                    <Animatable.View ref={this.swipeTextRef}>
                      <Animated.View style={{ opacity: this.state.pressScreenTextOpacity }} >
                        <Animatable.Text style={Styles.pressScreenText} animation="zoomInUp" duration={2300}>
                          {this.state.pressScreenText}
                        </Animatable.Text>
                      </Animated.View>
                    </Animatable.View>
                  </View>

                  </ViewShot>
                  <Animated.View style={{opacity: this.state.downloadIconOpacity, top: this.state.downloadIconTop}} >
                  <Image style={{ alignSelf: 'center'}}
                         source={require('./images/iconUglyDownload.png')} />
                   </Animated.View>
                 </Animatable.View>

                 <Animated.View style={{top: '40%', opacity: this.state.activityIndicatorOpacity}}>
             <ActivityIndicator size="large" color='rgba(255, 238, 170, 0.8)'/>
           </Animated.View>

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
                          label: Platform.OS === "ios" ? 'Share to instagram' : 'Share Quote',
                          onPress: () => this._onShare(),
                        },
                      ]} />
            </ GestureRecognizer>
          </Animated.View>
      </View>
    );
  }
};

AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
