import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const remote = 'https://lumiere-a.akamaihd.net/v1/images/Yoda-Retina_2a7ecc26.jpeg?region=0%2C0%2C1536%2C864';

export default class BackgroundImage extends Component {

  state = {
    quoteText: wisdom[0][1],
    quoteAuthor: wisdom[0][2]
  };

  onPress = () => {
    var rand = wisdom[Math.floor(Math.random() * wisdom.length)];

    this.setState({
      quoteText: rand[1],
      quoteAutor: rand[2]
    })
  };

  render() {
    const resizeMode = 'center';

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#eee',
        }}>

        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%' }}>
          <Image style={{ flex: 1 }} source={{ uri: remote }} />
        </View>

        <View>

        <Text style={styles.headText}>
          Daily Wisdom
        </Text>

        <Text style={styles.quoteText}>
            {this.state.quoteText}
        </Text>

        <Text style={styles.authorText}>
            {this.state.quoteAuthor}
        </Text>

        <TouchableOpacity
            style={styles.button}
            onPress={() => this.onPress()}>
            <Text> Next Quote </Text>
        </TouchableOpacity>

        </View>
      </View>
    );
  }
};


const wisdom = [
  ["","Don't think you are, know you are.",""],
  ["","Do or do not, there is no try.",""],
  ["","It is not lack of ability or opportunity that holds you back; it is only lack of confidence in yourself.",""],
  ["","There are no limits to what you can accomplish, except the limits you place on your own thinking.",""],
  ["","Self-confidence is the foundation of all great success and achivement.",""]
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffeeaa',
    padding: 15
  },
  countContainer: {
    alignItems: 'center',
    padding: 10
  },
  countText: {
    color: '#FF00FF'
  },
  codeHighlightText: {
    color: '#000',
    alignItems: 'center'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  navigationFilename: {
    marginTop: 5,
  },
  quoteText: {
    color: '#000',
    fontSize: 40,
    textAlign: 'center',
  },
  authorText: {
    textAlign: 'center',
    color: '#FF00FF'
  },
  headText: {
  	textAlign: 'center',
  	fontSize: 70,
  	color: 'rgba(255, 238, 170, 0.51)',
  	margin: 20
  }
})

AppRegistry.registerComponent('BackgroundImage', () => BackgroundImage);
