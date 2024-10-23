import {StyleSheet, Text, View, Image, TouchableOpacity, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BoldText from '../customText/BoldText';
import LightText from '../customText/LightText';
import {useTheme} from 'react-native-paper';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import SemiBoldText from '../customText/SemiBoldText';
import RegularText from '../customText/RegularText';

export default function Home() {
  let theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);


  // Animation reference
  const colorAnimation = useRef(new Animated.Value(0)).current;

  // Color interpolation
  const animatedColor = colorAnimation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['#8B0000', '#2F4F4F', '#006400', '#9B870C'], // Dark Red, Dark Grey, Dark Green, Dark Yellow

  });

  // Start the color animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 2,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 3,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnimation]);


  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error:', response.errorMessage);
      } else {
        const uri = response.assets[0]?.uri;
        setSelectedImage(uri);
      }
    });
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
      } else {
        const uri = response.assets[0]?.uri;
        setSelectedImage(uri);
      }
    });
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: theme.colors.background},
      ]}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <Animated.Text style={[styles.appName, {color: animatedColor}]}>
          Recycle Vision
        </Animated.Text>
      </View>

      {/* How it works */}
      <View style={styles.howItWorksContainer}>
        <BoldText style={styles.sectionTitle}>How it works</BoldText>
        <LightText style={styles.description}>
          Recycle Vision helps you determine if the items in your waste are
          recyclable. Simply upload a picture of the item, and the app will
          analyze it to let you know whether it is recyclable or not, along with
          suggestions on how to properly recycle it.
        </LightText>
      </View>
{selectedImage&&(
      <RegularText style={{textAlign: 'center', fontSize: 14}}>
        Image Preview
      </RegularText>
)}

      {/* Display the selected image */}
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{uri: selectedImage}} style={styles.imageStyle} />
        </View>
      )}

      {/* Upload and Camera buttons */}
      <View style={styles.uploadcontainer}>
        <TouchableOpacity style={styles.uploadView} onPress={handleImagePicker}>
          <Ionicon size={50} name="cloud-upload-outline" color={'grey'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadView}
          onPress={handleCameraLaunch}>
          <Ionicon size={50} name="camera-outline" color={'grey'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headingContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  appName: {
    fontSize: 21,
    textAlign: 'center',
    fontFamily:'Sora-Bold'
  },
  howItWorksContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  uploadcontainer: {
    padding: 5,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  uploadView: {
    backgroundColor: 'rgba(231, 227, 227, 0.237)',
    padding: 20,
    borderRadius: 100,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
