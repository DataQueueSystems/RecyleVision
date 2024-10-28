import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  BackHandler,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BoldText from '../customText/BoldText';
import LightText from '../customText/LightText';
import {Button, useTheme} from 'react-native-paper';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import SemiBoldText from '../customText/SemiBoldText';
import RegularText from '../customText/RegularText';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {showToast} from '../../utils/Toast';
import {useAuthContext} from '../context/GlobaContext';
import axios from 'axios';
import {uploadImageToCloudinary} from '../../utils/cloudinary';
import { useNetInfoInstance } from '@react-native-community/netinfo';
export default function Home() {
  let theme = useTheme();
   // Create an isolated instance of NetInfo
 const { netInfo: { type, isConnected, details } } = useNetInfoInstance();
 console.log(details?.ipAddress,'details');
  const {Checknetinfo,} = useAuthContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [prediction, setPrediction] = useState(null);

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
        setPrediction(null);
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
        setPrediction(null);
      }
    });
  };

  const handleSubmit = async () => {
    setSpinner(true); // Show the spinner
    const isConnected = await Checknetinfo(); // Check network connection
    if (!isConnected) {
      setSpinner(false); // Hide spinner if not connected
      return;
    }

    try {
      // Ensure selectedImage is defined
      if (!selectedImage) {
        console.error('No image selected');
        setSpinner(false);
        return;
      }

      // // Upload the selected image to Cloudinary
      // const uploadedImageUrl = await uploadImageToCloudinary(selectedImage);
      // console.log('Uploaded Image URL:', uploadedImageUrl);

      // Prepare the form data for prediction
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        type: 'image/jpeg', // Use the correct MIME type based on your image
        name: selectedImage.fileName || 'image.jpg', // Use file name if available
      });

      // Make the prediction request
      const response = await axios.post(
        `http://${details?.ipAddress}/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Log the response and handle the prediction result
      if (response.data && response.data.prediction) {
        console.log('Prediction:', response.data.prediction);
        setPrediction(response.data.prediction);
        // Update the UI with the prediction result
        // Example: setPrediction(response.data.prediction);
      } else {
        console.error('Prediction failed:', response.data.message);
      }
    } catch (err) {
      // Log and handle any error
      console.error('Error during image upload or prediction:', err);
    } finally {
      setSpinner(false); // Hide the spinner at the end
    }
  };

  const handleCancel = () => {
    setSpinner(false);
  };

  const backPressedOnce = useRef(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isFocused) {
          if (!backPressedOnce.current) {
            backPressedOnce.current = true;
            showToast('Tap again to exit');
            setTimeout(() => {
              backPressedOnce.current = false;
            }, 2000); // Reset backPressedOnce after 2 seconds
            return true;
          } else {
            BackHandler.exitApp(); // If tapped again within 2 seconds, exit the app
            return true;
          }
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [isFocused]);


  let navigation=useNavigation()
  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: theme.colors.background},
      ]}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <Animated.Text
          style={[styles.appName, {color: theme.colors.onBackground}]}>
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

{/* NetworkInfo */}
<Button onPress={()=>navigation.navigate("NetworkInfo")}>
NetworkInfo
</Button>

      
      {selectedImage && (
        <RegularText style={{textAlign: 'center', fontSize: 14}}>
          Image Preview
        </RegularText>
      )}

      {/* Display the selected image */}
      {selectedImage && (
        <>
          <View style={styles.imageContainer}>
            <Image source={{uri: selectedImage}} style={styles.imageStyle} />
          </View>

          {/* Show the Spinner */}
          {spinner ? (
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignSelf: 'center',
                gap: 10,
                alignItems: 'center',
              }}>
              <ActivityIndicator size={40} color={theme.colors.onBackground} />
              <TouchableOpacity onPress={handleCancel}>
                <SemiBoldText>Cancel</SemiBoldText>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Show the submit Btn if image is there */}
              <Button
                mode="elevated"
                disabled={spinner ? true : false}
                style={{
                  width: Dimensions.get('window').width / 2,
                  alignSelf: 'center',
                }}
                onPress={spinner ? () => {} : handleSubmit}>
                <SemiBoldText>Submit</SemiBoldText>
              </Button>
            </>
          )}

          {prediction && (
            <View style={{alignItems: 'center', marginTop: 10}}>
              <SemiBoldText style={styles.responsehead}>
                Prediction:
              </SemiBoldText>
              <SemiBoldText style={styles.responseText}>
                {prediction}
              </SemiBoldText>
            </View>
          )}
        </>
      )}

      {!spinner && (
        <>
          {/* Upload and Camera buttons */}
          <View style={styles.uploadcontainer}>
            <TouchableOpacity
              disabled={spinner ? true : false}
              style={styles.uploadView}
              onPress={handleImagePicker}>
              <Ionicon size={50} name="cloud-upload-outline" color={'grey'} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={spinner ? true : false}
              style={styles.uploadView}
              onPress={handleCameraLaunch}>
              <Ionicon size={50} name="camera-outline" color={'grey'} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Sora-Bold',
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
  responsehead: {
    fontSize: 15,
  },
  responseText: {
    fontSize: 22,
  },
});
