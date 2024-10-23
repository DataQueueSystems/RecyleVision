// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { AuthContextProvider } from './src/context/GlobaContext'
// import AppNavigator from './src/AppNavigator'

// export default function App() {
//   return (
//    <>
//    <AuthContextProvider>
//     <AppNavigator />
//    </AuthContextProvider>

//    </>
//   )
// }

// const styles = StyleSheet.create({})

import React, {useContext} from 'react';
import {AuthContextProvider} from './src/context/GlobaContext';
import AppNavigator from './src/AppNavigator';
import {ThemeContext, ThemeProvider} from './src/context/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

function AppWithTheme() {
  const {theme} = useContext(ThemeContext);
  if (!theme) {
    return null; // or a loading spinner if desired
  }

  return (
    <>
      <AuthContextProvider>
        <AppNavigator />
      </AuthContextProvider>
    </>
  );
}
