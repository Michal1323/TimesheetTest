import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery, exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import { StyleSheet, View, Text, Image, StatusBar, Animated, TouchableOpacity, Alert, SafeAreaView, TouchableHighlight} from 'react-native';
import { AuthSession } from 'expo-auth-session';
import { Button } from 'react-native';
import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';
import { Buffer } from 'buffer';
import * as Linking from 'expo-linking';
import { constant } from 'lodash';
import LoginScreen from '../app/index';

WebBrowser.maybeCompleteAuthSession();

export default function login({ navigation }) { 
 
//   function URLEncode(str) {
//     return str.replace(/\+/g, '-')
//         .replace(/\//g, '_')
//         .replace(/=/g, '');
// }

// async function sha256(buffer) {
//   return await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA256,
//       buffer,
//       { encoding: Crypto.CryptoEncoding.BASE64 
//   );
// }
// let randomBytes = 0; 
// const base64String = Buffer.from(randomBytes).toString('base64');
// const code_verifier = URLEncode(base64String);
// const challenge ;

//   async function random(){
// randomBytes = await Random.getRandomBytesAsync(32);
// challenge = URLEncode(await sha256(code_verifier));
// }


  const [tok, setTok] = React.useState();
  // Endpoint
  const discovery = useAutoDiscovery('https://login.microsoftonline.com/c22e361c-58d9-4c39-a875-4b26582548fb/v2.0');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '5bf7a77a-a567-4887-a8ca-c07b522f3498',
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri: makeRedirectUri({
        scheme: 'exp://192.168.1.5:19000'
        }),
        // codeChallenge: '65EAF20592B581A9748B057E282C5FA93A69EA5BC88D8D0E264E31E0ED6B0EEE',
        // codeChallengeMethod: 'S256',
        // usePKCE: true
      },
    discovery
  );

  React.useEffect(() => {
    if (response && 'params' in response) {
        if (response.params && 'code' in response.params) {

            (async function getToken() {
                console.log('-----------------------')
                console.log(response.params.code)
                console.log('-----------------------')

                try {
                    // @ts-ignore
                    const { accessToken } = await exchangeCodeAsync({
                        code: response.params.code,
                        clientId: '5bf7a77a-a567-4887-a8ca-c07b522f3498',
                        redirectUri: makeRedirectUri({
                          scheme: 'exp://192.168.1.5:19000'
                          }),
                        scopes: ['openid', 'profile', 'email', 'offline_access'],
                        grant_type: "authorization_code",
                        extraParams: {
                          // code_verifier: "YTFjNjI1OWYzMzA3MTI4ZDY2Njg5M2RkNmVjNDE5YmEyZGRhOGYyM2IzNjdmZWFhMTQ1ODg3NDcxY2Nl",
                          code_verifier: request?.codeVerifier || '' ,
                      },
                    }, {
                        tokenEndpoint: 'https://login.microsoftonline.com/c22e361c-58d9-4c39-a875-4b26582548fb/oauth2/v2.0/token' // Sera utilisé pour le refresh
                    })

                    console.log('------- Access ----------------')
                    console.log(accessToken)
                    console.log('-----------------------')
                    setTok(accessToken);

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                      /* make a GET request using fetch and querying with the token */
                      let graphResponse = null;
                      await fetch('https://graph.microsoft.com/v1.0/me?$select=displayName', {
                        method: 'GET',
                        headers: {
                          'Authorization': 'Bearer ' + accessToken,
                        }
                      })
                      .then((response) => response.json())
                      .then((response) => {
                        graphResponse = response;

                      })
                      .catch((error) => {
                        graphResponse = error;
                      });

                      /* 
    Spread the results of the graph and add a type property with a value of success to indicate
    that the AzureAD info grabbing was a success
  */ 
  const finalResponse = {
    ...graphResponse,
    type: "success",
   
  }
  console.log(finalResponse);
  var json = JSON.stringify(finalResponse);
  console.log("------------------------------------------")
  console.log(json)
  var obj = JSON.parse(json);
  console.log("------------------------------------------")
console.log(obj.displayName)
var fullname = obj.displayName
navigation.navigate('Home', { name : fullname });
  return finalResponse;
 //end callMsGraph()


               
                  } 
                catch (e) {
                    console.log(e)
                    console.log(e.status)
                    console.log(e.message)
                }
            })()
        }
    }
   
}, [response]);




  return (
    <View>
    <LoginScreen>
    </LoginScreen>
 <View style={{marginTop: 50}}>
    
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        }}
    />
    </View>

    </View>
  );
      }



