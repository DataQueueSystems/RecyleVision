import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import SemiBoldText from '../../customText/SemiBoldText';
import {Button, useTheme} from 'react-native-paper';
import {useAuthContext} from '../../context/GlobaContext';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import BoldText from '../../customText/BoldText';
import LightText from '../../customText/LightText';

const OnboardingScreen = ({}) => {
  let navigation = useNavigation();
  let windowWidth = Dimensions.get('window').width - 20;
  let windowHeight = Dimensions.get('window').height / 2.5;

  const {isLogin} = useAuthContext();
  console.log(isLogin, 'isLogin');
  let theme = useTheme();

  const handleBtnPress = () => {
    if (isLogin) {
      showToast('Login First');
      navigation.navigate('Login');
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <Onboarding
      onSkip={handleBtnPress} // Replace 'HomeScreen' with your desired navigation target
      onDone={handleBtnPress} // Navigate after the last onboarding screen
      pages={[
        {
          backgroundColor: theme.colors.onboardingBackground1,
          image: (
            <Image
              style={{
                width: windowWidth,
                height: windowHeight,
                borderRadius: 200,
              }}
              source={require('../../../assets/images/onboarding/first.png')}
            />
          ), // Replace with your image
          title: 'Welcome to RecycleVision',
          subtitle:
            "Identify what's recyclable with just a snap. Together, we can reduce waste and build a cleaner future.",
          titleStyles: {
            fontFamily: 'Sora-Bold', // Replace with your desired font family for the title
            fontSize: 24, // Customize font size if needed
            color: '#000', // Customize text color if needed
          },
          subTitleStyles: {
            fontFamily: 'Sora-Regular', // Replace with your desired font family for the subtitle
            fontSize: 16, // Customize font size if needed
            color: '#666', // Customize text color if needed
          },
        },
        {
          backgroundColor: theme.colors.onboardingBackground2,
          image: (
            <Image
              style={{width: windowWidth, height: windowHeight}}
              source={require('../../../assets/images/onboarding/second.png')}
            />
          ), // Replace with your image
          title: 'Capture Any Object',
          subtitle:
            "Snap a photo of any item, and we'll let you know if it can be recycled or not.",
          titleStyles: {
            fontFamily: 'Sora-Bold',
            fontSize: 24,
            color: '#000',
          },
          subTitleStyles: {
            fontFamily: 'Sora-Regular',
            fontSize: 16,
            color: '#666',
          },
        },
        {
          backgroundColor: theme.colors.onboardingBackground3,
          image: (
            <Image
              style={{width: windowWidth, height: windowHeight}}
              source={require('../../../assets/images/onboarding/third.png')}
            />
          ), // Replace with your image
          title: 'Start Recycling Smarter',
          subtitle: (
            <View>
              <Text
                style={{
                  marginBottom: 10,
                  marginHorizontal: 5,
                  fontFamily: 'Sora-Regular',
                  fontSize: 16,
                  color: '#666',
                  textAlign: 'center',
                }}>
                Tap below to start identifying recyclable items. It’s quick and
                easy!
              </Text>
              <Button
                onPress={handleBtnPress}
                mode="contained"
                style={[
                  styles.btn,
                  {backgroundColor: theme.colors.onBackground},
                ]}>
                <BoldText style={{color: theme.colors.background}}>
                  Get started
                </BoldText>
              </Button>
            </View>
          ),
          titleStyles: {
            fontFamily: 'Sora-Bold',
            fontSize: 24,
            color: '#000',
          },
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
});

export default OnboardingScreen;
