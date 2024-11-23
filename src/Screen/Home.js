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
  Alert,
  ScrollView,
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
import {Iconify} from 'react-native-iconify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgComponent from '../Component/SVGComponent';

export default function Home() {
  let theme = useTheme();
  const {Checknetinfo, ipAddress, setIsLogin} = useAuthContext();
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
    setPrediction(null);
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
      const uploadedImageUrl = await uploadImageToCloudinary(selectedImage);
      console.log('Uploaded Image URL:', uploadedImageUrl);
      // Prepare the form data for prediction
      const formData = new FormData();
      formData.append('file', {
        uri: uploadedImageUrl || selectedImage,
        type: 'image/jpeg', // Use the correct MIME type based on your image
        name: selectedImage.fileName || 'image.jpg', // Use file name if available
      });

      let response = await axios.post(
        // `http://10.0.2.2:5000/predict`,  //for Android
        `${ipAddress}/predict`, //Live
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      // Log the response and handle the prediction result
      if (response.data && response.data) {
        setPrediction(response.data);
        // Update the UI with the prediction result
        // Example: setPrediction(response.data.prediction);
      } else {
      }
    } catch (err) {
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

  let navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout', //title
      'Are you sure ,you want to logout ?', //message
      [
        {
          text: 'Cancel', // Cancel button
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', // OK button
          onPress: () => {
            setIsLogin(true);
            AsyncStorage.setItem('IsLogin', 'false');
            AsyncStorage.clear();
            showToast('Logout successfully!');
            // some logic
          },
        },
      ],
      {cancelable: false}, // Optionally prevent dismissing by tapping outside the alert
    );
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: theme.colors.background},
      ]}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {/* Heading */}
        <View style={styles.headingContainer}>
          <View>
            <BoldText style={{fontSize: 24}}>Welcome to,</BoldText>
            <BoldText style={{fontSize: 24, top: -2}}>Recycle Vision</BoldText>
          </View>

          <Iconify
            icon="heroicons-outline:logout"
            size={38}
            color={theme.colors.onBackground}
            onPress={handleLogout}
          />
        </View>

        <SvgComponent />

        {/* How it works */}
        <View style={styles.howItWorksContainer}>
          <BoldText style={styles.sectionTitle}>How it works</BoldText>
          <LightText style={styles.description}>
            Recycle Vision helps you determine if the items in your waste are
            recyclable. Simply upload a picture of the item, and the app will
            analyze it to let you know whether it is recyclable or not, along
            with suggestions on how to properly recycle it.
          </LightText>
        </View>

        {!spinner && (
          <>
            {/* Upload and Camera buttons */}
            <View style={styles.uploadcontainer}>
              <TouchableOpacity
                disabled={spinner ? true : false}
                style={styles.uploadView}
                onPress={handleImagePicker}>
                <Ionicon size={48} name="cloud-upload-outline" color={'grey'} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={spinner ? true : false}
                style={styles.uploadView}
                onPress={handleCameraLaunch}>
                <Ionicon size={48} name="camera-outline" color={'grey'} />
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.imageprediction}>
          {/* Display the selected image */}
          {selectedImage && (
            <>
              <View>
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: selectedImage}}
                    style={styles.imageStyle}
                  />
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
                    <ActivityIndicator
                      size={40}
                      color={theme.colors.onBackground}
                    />
                    <TouchableOpacity onPress={handleCancel}>
                      <SemiBoldText>Cancel</SemiBoldText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {!prediction && (
                      <>
                        {/* Show the submit Btn if image is there */}
                        <Button
                          disabled={spinner ? true : false}
                          style={styles.btn}
                          onPress={spinner ? () => {} : handleSubmit}>
                          <BoldText style={{color: '#fff', fontSize: 15}}>
                            Submit
                          </BoldText>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </View>

              <View>
                {prediction && (
                  <View style={{marginTop: 20}}>
                    <SemiBoldText style={styles.responsehead}>
                      Prediction:
                    </SemiBoldText>
                    <BoldText
                      style={[
                        styles.responseText,
                        {color: theme.colors.green},
                      ]}>
                      {prediction?.class}
                    </BoldText>
                    <SemiBoldText style={styles.responsehead}>
                      Probability:
                    </SemiBoldText>
                    <RegularText
                      style={{fontSize: 13, width: 140}}
                      numberOfLines={2}>
                      {prediction?.probability}
                    </RegularText>

                    <View style={{marginVertical: 10}}>
                      {prediction.class == 'Recyclable' ? (
                        <Iconify
                          icon="fluent:bin-recycle-full-24-regular"
                          size={80}
                          color={theme.colors.onBackground}
                          onPress={handleLogout}
                        />
                      ) : (
                        <Iconify
                          icon="hugeicons:organic-food"
                          size={80}
                          color={theme.colors.onBackground}
                          onPress={handleLogout}
                        />
                      )}
                    </View>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        {prediction && (
          <View style={{margin: 3, marginHorizontal: 10, marginBottom: 100}}>
            <SemiBoldText style={{fontSize: 19}}>Tips:</SemiBoldText>
            <RegularText style={{fontSize: 14}}>{prediction?.tips}</RegularText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headingContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  howItWorksContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 70,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  uploadcontainer: {
    padding: 5,
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 10,
  },
  uploadView: {
    backgroundColor: 'rgba(231, 227, 227, 0.237)',
    padding: 12,
    borderRadius: 100,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 220,
    height: 220,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  responsehead: {
    fontSize: 15,
  },
  responseText: {
    fontSize: 22,
  },
  imageprediction: {
    flexDirection: 'row',
    padding: 8,
    margin: 8,
    gap: 15,
  },
  btn: {
    width: 220,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: 'rgb(147, 179, 234)',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
