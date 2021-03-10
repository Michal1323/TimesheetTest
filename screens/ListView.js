import React, { Component } from 'react';
import {  View,Text, FlatList} from 'react-native';
import { Button } from 'react-native-paper';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator, Item } from 'native-base';
import { DatabaseConnection } from '../components/database-connection';
import { DataTable } from 'react-native-paper';

const db = DatabaseConnection.getConnection();

function ListView ({ navigation }) {
    const [flatListItems, setFlatListItems] = React.useState([]);

    const pressHandler = () => 
    {
      navigation.navigate('Home')
    }

    React.useEffect(() => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM Timesheet',
            [],
            (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setFlatListItems(temp);
            }
          );
        });
      }, []);

      const listItemView = (item) => {
        return (
          <View>
           <Text>Tester</Text>
           <Button icon="plus" onPress={pressHandler}>
                Go Home
           </Button>
          </View>
        );
      };    



    return(
        <View>
            <FlatList
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}  
          />
        </View>
    );
}

export default ListView;