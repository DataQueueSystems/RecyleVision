import React, { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { useNetInfoInstance } from '@react-native-community/netinfo';
import { useTheme } from 'react-native-paper';

const NetworkInfo = () => {
    let theme=useTheme()
    const { netInfo: { type, isConnected, isInternetReachable, details } } = useNetInfoInstance();

    useEffect(() => {
        console.log('Network Info:', { type, isConnected, isInternetReachable, details });
         // Show details in an alert
         if (details) {
            Alert.alert('Network Details', JSON.stringify(details, null, 2), [{ text: 'OK' }]);
        }
    }, [type, isConnected, isInternetReachable, details]);

    return (
        <View style={{backgroundColor:theme.colors.background,flex:1}}>
            <Text>Network Type: {type}</Text>
            <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
            <Text>Internet Reachable: {isInternetReachable ? 'Yes' : 'No'}</Text>
            {type === 'wifi' && details && (
                <>
                    <Text>SSID: {details.ssid}</Text>
                    <Text>BSSID: {details.bssid}</Text>
                    <Text>Signal Strength: {details.strength}</Text>
                    <Text>IP Address: {details.ipAddress}</Text>
                </>
            )}
        </View>
    );
};

export default NetworkInfo;
