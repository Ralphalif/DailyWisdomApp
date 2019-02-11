import {StyleSheet} from 'react-native';
import { Font } from 'expo';

Font.loadAsync({
  'merriweather-regular': require('../Fonts/merriweather/merriweather-regular-webfont.ttf'),
  'riesling': require('../Fonts/riesling.ttf')
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  backgroundContainer:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 238, 170, 0.9)',
    padding: 15,
    position: 'absolute',
    bottom:0,
    width: '100%',
    height:'10%'
  },
  quoteText: {
    color: '#FFF',
    fontSize: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
   fontFamily: 'merriweather-regular',
  },
  authorText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'rgba(255, 238, 170, 1)'
  },
  headText: {
  	textAlign: 'center',
  	fontSize: 90,
  	color: 'rgba(255, 238, 170, 0.9)',
  	margin: 45,
    fontFamily: 'riesling'
  },
  pressScreenText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'rgba(255, 238, 170, 1)',
    top: 40,
    backgroundColor: 'rgba(0,0,0,0)',
  },
})


export default styles;
