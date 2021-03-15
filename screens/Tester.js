import * as React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, LayoutAnimation, UIManager, TouchableOpacity, Platform, Dimensions, Animated, } from 'react-native';
import { Button, DataTable, Portal } from 'react-native-paper';
import WeekSelector from 'react-native-week-selector';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, ListItem, Separator, Item } from 'native-base';
import moment from 'moment';
import 'moment/locale/en-gb';
import { Ionicons } from '@expo/vector-icons';
import { DatabaseConnection } from '../components/database-connection';

const db = DatabaseConnection.getConnection();



export default function Test ({ navigation }) {

  const [flatListItems, setFlatListItems] = React.useState([]);
  const [Hours, setHours] = React.useState('');
  const [Minutes, setMinutes] = React.useState('');
  const [FINHours, setFINHours] = React.useState('');
  const [FINMinutes, setFINMinutes] = React.useState('');
  const [Week, setWeek] = React.useState();
  
    const pressHandler = () => 
    {
      navigation.navigate('Hour')
    }

    const deleteHandler = () => 
    {
      navigation.navigate('ViewEntry')
    }

    const saveWEEK = (value) => {
      moment.locale('en');
      console.log(moment(value).format('MMM Do'));
      setWeek(moment(value).format('MMM Do'));
    }

    React.useEffect(() => {
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='Timesheet'",
          [],
          function (txn, res) {
            console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS Timesheet', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS Timesheet(id_timesheet INTEGER PRIMARY KEY AUTOINCREMENT, user_id BIGINT(20), eow DATE, date DATETIME, projNum VARCHAR(30), comment VARCHAR(250), arrivalHours TIME, arrivalMinutes TIME,  departHours TIME, departMinutes TIME, startLHours TIME, startLMinutes TIME, FinishLHours TIME, FinishLMinutes TIME, totalHrs FLOAT, siteID VARCHAR(45), dayoftheweek VARCHAR(45))',
                []
              );
            }
          }
        );
      }),

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

    const formatTime = (item) => {
      
    }
    const listItemView = (item) => {
      var SHours = moment(item.arrivalHours, 'HH');
      var SMinutes = moment(item.arrivalMinutes, 'mm');

      setHours(SHours.format('HH'));
      setMinutes(SMinutes.format('mm'));

      var FHours = moment(item.departHours, 'HH');
      var FMinutes = moment(item.departMinutes, 'mm');

      setFINHours(FHours.format('HH'));
      setFINMinutes(FMinutes.format('mm'));
    


      const datess = item.date;
      const Frdates = moment(datess).format('dddd, MMMM Do YYYY')
      console.log(datess);
    
      return (
        <View
          key={item.user_id}
          style={{ marginTop: 20, padding: 30, borderRadius: 10, width: 450, marginLeft: -50 }}>
            
            <View style={{marginBottom: -30}}>
              <Collapse>
      <CollapseHeader style={{marginBottom: -10}}>
        <Separator>
          <Text style={{fontWeight: 'bold'}}>{Frdates}</Text>
        </Separator>
      </CollapseHeader>
      <CollapseBody >
        <ListItem >
          <DataTable.Cell>{item.projNum}{'\n'}{item.siteID}</DataTable.Cell>
          <DataTable.Cell style={{marginLeft: -60}}>{item.arrivalHours}:{item.arrivalMinutes}-{item.departHours}:{item.departMinutes}</DataTable.Cell>
          
          <DataTable.Cell style={{marginLeft: -80}}>{item.comment}</DataTable.Cell>
        </ListItem>        
      </CollapseBody>
    </Collapse>
            </View>
          </View>
      );
    };    
  
   
   
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
           
          
          <View style={{ flex: 1 }}>
          
            
              <FlatList
            style={{ marginTop: -20 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)} 
          />
          
        </View>
       
           </View>
        </SafeAreaView>
   );
   }
    /*<WeekSelector
            whitelistRange={[new Date(2018, 7, 13), new Date()]}
            weekStartsOn={6}
            onWeekChanged={saveWEEK}
          />*/
   
   const styles = StyleSheet.create({
       container:{
           flex: 1,
         backgroundColor: '#fff',
         alignItems: 'center',
           justifyContent: 'center'
           },
           
         text:{
           alignItems: 'center',
           marginTop:20,
           justifyContent: 'center'
           },
   
       icons:{
           alignItems: 'center',
           color:'white',
           marginBottom:200,
           justifyContent: 'center'
           },
           date: {
            flex: 1,
            fontWeight: 'bold',
            justifyContent: 'center',
          },
          weekstyle: {
            marginTop: -400
          },
   
           text1:{
             alignItems: 'center',
             marginTop: -50,
             marginBottom: 75,
             justifyContent: 'center'
             },
             textheader: {
              color: '#111',
              fontSize: 12,
              fontWeight: '700',
          
            },
            textbottom: {
              color: '#111',
              fontSize: 18,
            },
            accordion:{
              width: '90%',
              backgroundColor: '#F2F2F7',
              borderRadius: 10,
              padding:20,
              justifyContent: 'center'
            },
            accordionHeader: {
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginVertical: 10,
              backgroundColor: 'white',
              borderRadius: 5,
              padding:10,    
          
            },
            accordionTitle: {
              fontSize: 20, 
              fontWeight:'bold',
              marginBottom: 20,
              color: '#62625A'
            },
            accordionItems: {
              borderRadius: 5,
              backgroundColor:'white',
          
            },
            accordionItemValue:{
              flexDirection: 'row',
              justifyContent:"space-between",
              padding: 10,
          
            },
            accordionItemValueBadge: {
              color: '#42C382',
              padding: 5,
              fontWeight: 'bold'
            },
            accordionItemValueName: {
              color: '#62625A'
            }
     });
     
    /*<DataTable 
          style={{ marginTop: 20 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        data={tableItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={( item ) => entryTable(item)}
        />
        
        <FlatList
            style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}  
          />
        */