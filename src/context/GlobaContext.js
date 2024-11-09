import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {createContext, useContext, useEffect, useState} from 'react';
import NetInfo, {useNetInfoInstance} from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';

import {showToast} from '../../utils/Toast';

const Authcontext = createContext();
export const AuthContextProvider = ({children}) => {
  const [isLogin, setIsLogin] = useState(false);

  const Checknetinfo = async () => {
    const state = await NetInfo.fetch(); // Get the current network state
    if (!state.isConnected) {
      showToast('No internet connection.', 'error');
      return false; // No internet connection
    }
    return true; // Internet connection is available
  };

  const [ipAddress, setIpAddress] = useState(null);

  const GetEndPoint = async () => {
    try {
      // Initial fetch to get data once
      const docSnapshot = await firestore().collection('EndPoint').doc('port').get();
      if (docSnapshot.exists) {
        const IpDetail = docSnapshot.data().IpAddress;
        setIpAddress(IpDetail);
      } else {
        console.log('No matching document found');
      };

      // Setup onSnapshot to listen for real-time updates
      const unsubscribe = firestore()
        .collection('EndPoint')
        .doc('port')
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            const IpDetail = snapshot.data().IpAddress;
            setIpAddress(IpDetail);
          } else {
            console.log('No matching documents found');
          }
        });
  
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching endpoint:", error);
    }
  };
  
  useEffect(() => {
    const initialize = async () => {
      let isConnected = await Checknetinfo();
      if (!isConnected) {
        showToast('No internet connection');
        return;
      }
      const unsubscribe = GetEndPoint();
      return () => unsubscribe && unsubscribe();
    };
    initialize();
  }, []);

  return (
    <Authcontext.Provider
      value={{
        isLogin,
        setIsLogin,
        Checknetinfo,
        ipAddress,
      }}>
      {children}
    </Authcontext.Provider>
  );
};

export const useAuthContext = () => useContext(Authcontext);
