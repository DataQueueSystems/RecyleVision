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
import {Iconify} from 'react-native-iconify';
import RegularText from '../../customText/RegularText';

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

  let iconSize = 180;

  return (
    <Onboarding
      skipLabel={
        <RegularText
          style={{
            fontSize: 16,
            color: theme.colors.appColor,
            fontFamily: 'Sora-Regular',
          }}>
          Skip
        </RegularText>
      }
      nextLabel={
        <RegularText
          style={{
            fontSize: 16,
            color: theme.colors.appColor,
            fontFamily: 'Sora-Regular',
          }}>
          Next
        </RegularText>
      }
      onSkip={handleBtnPress} // Replace 'HomeScreen' with your desired navigation target
      onDone={handleBtnPress} // Navigate after the last onboarding screen
      pages={[
        {
          backgroundColor: theme.colors.background,
          title: (
            <View style={styles.contentIcons}>
              <Iconify
                icon="ri:recycle-line"
                size={iconSize}
                color={theme.colors.onBackground}
              />
            </View>
          ),

          subtitle: (
            <View>
              <RegularText
                style={{
                  marginBottom: 10,
                  marginHorizontal: 15,
                  fontFamily: 'Sora-Regular',
                  fontSize: 17, // Customize font size if needed
                  textAlign: 'center',
                }}>
                {` Welcome to RecycleVision \n Identify what's recyclable with just a
                snap. Together, we can reduce waste and build a cleaner future.`}
              </RegularText>
            </View>
          ),
        },
        {
          backgroundColor: theme.colors.background,
          title: (
            <View style={styles.contentIcons}>
              <Iconify
                icon="tabler:capture-filled"
                size={iconSize}
                color={theme.colors.onBackground}
              />
            </View>
          ),

          subtitle: (
            <View>
              <RegularText
                style={{
                  marginBottom: 10,
                  marginHorizontal: 15,
                  fontSize: 17, // Customize font size if needed
                  textAlign: 'center',
                }}>
                Capture Any Object Snap a photo of any item, and we'll let you
                know if it can be recycled or not.
              </RegularText>
            </View>
          ),
        },
        {
          backgroundColor: theme.colors.background,
          title: (
            <View style={styles.contentIcons}>
              <Iconify
                icon="lucide:list-restart"
                size={iconSize}
                color={theme.colors.onBackground}
              />
            </View>
          ),
          subtitle: (
            <View>
              <RegularText
                style={{
                  marginBottom: 10,
                  marginHorizontal: 15,
                  fontSize: 17, // Customize font size if needed
                  textAlign: 'center',
                }}>
                Start Recycling Smarter Tap below to start identifying
                recyclable items. It’s quick and easy!
              </RegularText>
            </View>
          ),
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
  contentIcons: {
    // position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default OnboardingScreen;
