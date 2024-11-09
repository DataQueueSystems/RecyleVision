import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import BoldText from '../../customText/BoldText';
import {Button, useTheme} from 'react-native-paper';
import LightText from '../../customText/LightText';
import RegularText from '../../customText/RegularText';
import Header from '../../Component/Header';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../context/GlobaContext';
import axios from 'axios';
import {showToast} from '../../../utils/Toast';

export default function Register() {
  let theme = useTheme();
  const {Checknetinfo, ipAddress} = useAuthContext();
  // State for email and password inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [spinner, setSpinner] = useState(false);

  let navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = async () => {
    const isConnected = await Checknetinfo();
    if (!isConnected) {
      setSpinner(false);
      return;
    }
    // Handle login action here
    // Prepare for data
    let data = {
      name,
      email,
      password,
    };

    try {
      let response = await  axios.post(`${ipAddress}/register`, data); //Live
      // let response = await axios.post(`http://10.0.2.2:5000/register`,data); //for emulator
        let message = response.data.message;
        showToast(`${message}`);
        navigation.navigate('Login');
    } catch (error) {
      Alert.alert("fdsfd")
      if (axios.isAxiosError(error)) {
        // Check if the error has a response (like status 400 errors)
        if (error.response) {
          showToast(`${error.response.data.error}`);
        }
      }
    }
  };
  let screenName = 'Register';

  return (
    <>
      <Header screenName={screenName} />
      <View
        style={[
          styles.mainContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        {/* Heading */}
        <View style={styles.headingContainer}>
          <BoldText style={styles.authHead}>Register</BoldText>
          <LightText style={{marginTop: 10}}>create your account</LightText>
          <LightText style={{marginTop: 10}}>Connecting on {ipAddress}</LightText>
        </View>
        {/* Inputs */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.onBackground,
                borderColor: theme.colors.onBackground,
              },
            ]}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.onBackground,
                borderColor: theme.colors.onBackground,
              },
            ]}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.onBackground,
                borderColor: theme.colors.onBackground,
              },
            ]}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            onPress={spinner ? () => {} : handleRegister}
            mode="contained"
            style={[styles.btn, {backgroundColor: theme.colors.onBackground}]}>
            {spinner ? (
              <ActivityIndicator size={24} color={theme.colors.background} />
            ) : (
              <BoldText style={{color: theme.colors.background}}>
                Register
              </BoldText>
            )}
          </Button>
        </View>

        <View
          style={{
            marginVertical: 2,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <LightText>Already have an account? </LightText>
          <TouchableOpacity onPress={handleLogin}>
            <RegularText style={{color: theme.colors.blue}}>Login</RegularText>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'red',
    flex: 1,
  },
  headingContainer: {
    paddingVertical: 36,
    paddingHorizontal: 16,
  },
  authHead: {
    fontSize: 26,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  btn: {
    padding: 4,
    marginTop: 20,
  },
});
