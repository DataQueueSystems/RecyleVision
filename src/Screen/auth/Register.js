import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import BoldText from '../../customText/BoldText';
import globalStyles from '../../Styles/Globalstyle';
import {Button, useTheme} from 'react-native-paper';
import LightText from '../../customText/LightText';
import RegularText from '../../customText/RegularText';
import Header from '../../Component/Header';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  let theme = useTheme();
  let GlobalStyle = globalStyles(theme);

  // State for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigation=useNavigation()
  const handleLogin = () => {
    navigation.navigate("Login")
    
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
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            onPress={handleLogin}
            mode="contained"
            style={[styles.btn, {backgroundColor: theme.colors.onBackground}]}>
            <BoldText style={{color: theme.colors.background}}>Login</BoldText>
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
          <TouchableOpacity
            onPress={handleLogin}>
            <RegularText style={{color: 'blue'}}>Login</RegularText>
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
    borderColor: '#ccc',
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
