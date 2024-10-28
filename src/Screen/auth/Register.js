import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import BoldText from '../../customText/BoldText';
import globalStyles from '../../Styles/Globalstyle';
import {Button, useTheme} from 'react-native-paper';
import LightText from '../../customText/LightText';
import RegularText from '../../customText/RegularText';
import Header from '../../Component/Header';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../context/GlobaContext';
import axios from 'axios';

export default function Register() {
  let theme = useTheme();
  let GlobalStyle = globalStyles(theme);
  const {Checknetinfo} = useAuthContext();

  // State for email and password inputs
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
      email,
      password,
    };

    try {
      console.log('data:', data);
      let response = await axios.post('endpoint', data);
      console.log(response.data, 'response');
      //    await AsyncStorage.setItem('IsLogin', 'true');
      // setIsLogin(false);
      // navigation.navigate('Home');
    } catch (err) {
      // Log and handle any error
      console.log('Error:', err);
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
