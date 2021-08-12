import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { Button } from 'react-native';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function login({ navigation }) { 
  // Endpoint
  const discovery = useAutoDiscovery('https://login.microsoftonline.com/c22e361c-58d9-4c39-a875-4b26582548fb/v2.0');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '5bf7a77a-a567-4887-a8ca-c07b522f3498',
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri: makeRedirectUri({
        scheme: 'exp://192.168.1.8:19000'
        }),
    },
    discovery
  );

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        navigation.navigate('Home');
        }}
    />
  );
      }