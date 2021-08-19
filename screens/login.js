import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery, exchangeCodeAsync } from 'expo-auth-session';
import { Button } from 'react-native';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function login({ navigation }) { 

  const [tok, setTok] = React.useState();
  // Endpoint
  const discovery = useAutoDiscovery('https://login.microsoftonline.com/c22e361c-58d9-4c39-a875-4b26582548fb/v2.0');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '5bf7a77a-a567-4887-a8ca-c07b522f3498',
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri: makeRedirectUri({
        scheme: 'exp://192.168.1.2:19000'
        }),
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
                          scheme: 'exp://192.168.1.2:19000'
                          }),
                        scopes: ['openid', 'profile', 'email', 'offline_access'],
                        extraParams: {
                          code_verifier: request?.codeVerifier || "",
                      },
                    }, {
                        tokenEndpoint: 'https://login.microsoftonline.com/c22e361c-58d9-4c39-a875-4b26582548fb/oauth2/v2.0/token' // Sera utilisé pour le refresh
                    })

                    console.log('------- Before ----------------')
                    console.log(accessToken)
                    console.log('-----------------------')
                    setTok(accessToken);
                    
                      /* make a GET request using fetch and querying with the token */
                      let graphResponse = null;
                      await fetch('https://graph.microsoft.com/v1.0/me?$select=surname', {
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
console.log(obj.surname)

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