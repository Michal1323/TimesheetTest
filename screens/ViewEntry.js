import React, {useState,useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

//import axios from axios

export default function DeleteUser ({ navigation })  {
    const [values, setValues] = React.useState([]);
    const [selectedValue, setSelectedValue] = useState(null);

     useEffect(() => {
    //     fetch('https://10.0.0.19:4433/api/sites')
    //     .then(response => response.json())
    //     .then(responseJson => {
    //         setValues(responseJson.results)
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //       });
    //   }, []);

      axios
      .get('https://192.168.1.2:8000/api/WeatherForecast')
      .then(function (response) {
        // handle success
        alert(response);
          setValues(response)
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      })
      .finally(function () {
        // always executed
        alert('Finally called');
      });
  }, []);

    return (        
        <View style={{flex: 1,backgroundColor:'white'}}>
                <Picker
                    selectedValue={selectedValue ? selectedValue.id : null}
                    style={{ width: '100%' }}
                    onValueChange={(itemValue) => setSelectedValue({ id: itemValue })}>
                    { values.map((value, i) => {
                        return <Picker.Item key={i} value={value.id} label={value.name} />
                    })}


                </Picker>
                <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="fast-food" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => console.log("Notifications tapped!")}>
            <Icon name="checkmark" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => console.log("All tasks tapped!")}>
            <Icon name="add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
               </View> 
        
    )
}

const styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
  });
