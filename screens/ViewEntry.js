import React, {useState,useEffect} from 'react';
import { StyleSheet, View, Text, Image, StatusBar, Animated, TouchableOpacity, Alert, Pressable, Modal, TouchableHighlight} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, IconButton, Card, Colors } from 'react-native-paper';
import { FloatingAction } from "react-native-floating-action";
//import axios from axios



export default function DeleteUser ({ navigation })  {
   const actions = [
    {
      text: "Add Entry",
      icon: <IconButton icon="plus"  color={Colors.white} size={35} style={{marginLeft: 20, marginTop: -65, position: 'absolute', backgroundColor: '#34c0eb' }} />
      ,
      name: "bt_language",
      position: 1
    
    },
    {
      text: "Lunch",
      icon: <IconButton icon="food"  color={Colors.white} size={35} style={{marginLeft: 330, marginTop: -65, position: 'absolute', backgroundColor: '#091629'}}/>
      ,
      name: "bt_room",
      position: 2
    },
    {
      text: "Submit",
      icon: <IconButton icon="check"  color={Colors.white} size={35} style={{marginLeft: 170, marginTop: -65, position: 'absolute', backgroundColor: '#52f549'}} />
,
      name: "bt_videocam",
      position: 3
    }
  ];

  return (
  
  <View style={styles.container}>
    <FloatingAction
      actions={actions}
      onPressItem={name => {
        console.log(`selected button: ${name}`);
      }}
    />
  </View>
  )
        
    
}

const styles = StyleSheet.create({
    container:{
      alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingBottom: 150
        }
    })

