import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  View,
  Text,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { Font } from 'expo';
import Images from '../images/index.js';
import Styles from '../components/HomeScreenStyle.js';
Font.loadAsync({
  'merriweather-regular': require('../Fonts/merriweather/merriweather-regular-webfont.ttf'),
  'riesling': require('../Fonts/riesling.ttf')
});

const quoteArray = require('../quotes.json');

var lastimg = 0;

export default class HomeScreen extends Component {

  constructor(props) {
     super(props);
     this.state = {
       quoteText: '',
       quoteAuthor: '',
       quoteFontSize: 30,
       backgroundImageSource: Images['IMG_12'],
     };
   }

  _changeImage = () => {
      this.setState({
        quoteText: '',
        quoteAuthor: '',
        backgroundImageSource: ''
      })

      var imgnr = this._getRandomInt(16);
      while(imgnr == lastimg){
        imgnr = this._getRandomInt(16);
      }
      lastimg = imgnr;

      setTimeout(() => {
        this.setState({
          backgroundImageSource: Images['IMG_' + imgnr]
        })
      }, 50);
  }

  _changeQuote = () => {
      var randomQuote = quoteArray[this._getRandomInt(quoteArray.length)];
      var quote = randomQuote[1];
      var author = randomQuote[2];
      var quoteFontSize = 30;

      if(quote.length > 200)
        quoteFontSize = 20;
      else if(quote.length > 145)
        quoteFontSize = 25;

      this.setState({
        quoteText: quote,
        quoteAuthor: author.trim() == '' ? author : "\n-- " + author,
        quoteFontSize: quoteFontSize,
      })
  }

  _getRandomInt = (interval) =>
  {
      return Math.floor(Math.random() * interval);
  }

  render() {
    return (
      <View style={Styles.container} >
          <TouchableOpacity style={Styles.container}  onPress={() => this._changeImage()}>
            <View style={Styles.backgroundContainer}>
              <ImageBackground style={Styles.container} source={this.state.backgroundImageSource} onLoadEnd={() => this._changeQuote()}/>
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
            </View>
            <TouchableOpacity style={Styles.button} onPress={() => this._changeImage()}>
                <Text style={{ fontSize: 30}}> Next Quote </Text>
            </TouchableOpacity>
          </TouchableOpacity>
      </View>
    );
  }
};


AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
