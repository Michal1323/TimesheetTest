import * as React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableHighlight} from 'react-native';
import { Button, DataTable, Portal } from 'react-native-paper';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Picker } from '@react-native-picker/picker';
import { Thumbnail, ListItem, Separator, Item } from 'native-base';
import moment from 'moment';
import WeekSelector from 'react-native-week-selector';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from "lodash";
import { DatabaseConnection } from '../components/database-connection';
import { TouchableOpacity } from 'react-native'
import Dialog from "react-native-dialog";
const db = DatabaseConnection.getConnection();



export default function Home ({ navigation }) {

  const [flatListItems, setFlatListItems] = React.useState([]);
  const [Hours, setHours] = React.useState('');
  const [Minutes, setMinutes] = React.useState('');
  const [FINHours, setFINHours] = React.useState('');
  const [FINMinutes, setFINMinutes] = React.useState('');
  const [Week, setWeek] = React.useState();
  const [dayoftheWeek, setDayoftheWeek] = React.useState('');
  const [currentDate, setCurrentDate] = React.useState('');
  const [formatDay, setformatDay] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [ columns, setColumns ] = React.useState([
    
    "Project",
    "Site",
    "Start/End",
    "Hours"
  ])
  const [ direction, setDirection ] = React.useState(null)
  const [ selectedColumn, setSelectedColumn ] = React.useState(null)


    const pressHandler = () => 
    {
      navigation.navigate('Hour')
    }

    const deleteHandler = () => 
    {
      navigation.navigate('ViewEntry')
    }

    const showDialog = () => {
      setVisible(true);
    };
  
    const handleCancel = () => {
      setVisible(false);
    };

    const handleDelete = () => {
      // The user has pressed the "Delete" button, so here you can do your own logic.
      // ...Your logic
      setVisible(false);
    };


  let SearchEntry = () => {
      db.transaction((tx) => {
     tx.executeSql(
       'SELECT * FROM Timesheet WHERE date = ?',
       [currentDate],
       (tx, results) => {
         //var temp = [];
         //for (let i = 0; i < results.rows.length; ++i)
           //temp.push(results.rows.item(i));
         //setFlatListItems(temp);
         var temp = [];
         var len = results.rows.length;
         console.log('len', len);
         if(len >= 0 ) {
          
           for (let i = 0; i < results.rows.length; ++i)
          
           temp.push(results.rows.item(i));
           setFlatListItems(temp);

         } else {
           alert('Cannot Search Entry!');
         }
                       }
     );
                     });
                         };

                         

    const saveDayofWeek = (itemValue, itemIndex) => {
      setDayoftheWeek(itemValue);
      //SearchEntry()
      //var next = getNextDay(itemValue);
      var next = moment(Week).day(itemValue).format('L') 
      //console.log(next.getTime());
      console.log(moment(next).format('L'));
      setCurrentDate(moment(next).format('L'));
      setformatDay(moment(next).format('L'));
    }
    const getNextDay = (dayName) => {
      var todayDate = new Date(Week);
      var now = todayDate.getDay();
      console.log('now:' + now)
      // Days of the week
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
    // The index for the day you want
    var day = days.indexOf(dayName.toLowerCase());
  
    // Find the difference between the current day and the one you want
    // If it's the same day as today (or a negative number), jump to the next week
    var diff = day - now;
    console.log('diff:' + diff);
    diff = diff < 0 ? 7 + diff  : diff;
    console.log('new dff:' + diff)
    // Get the timestamp for the desired day
    var nextDayTimestamp = todayDate.getTime() + (1000 * 60 * 60 * 24 * diff);
  
    // Get the next day
    return new Date(nextDayTimestamp);
  
    }

    
 

    const saveWEEK = (value) => {
      moment.locale('en');
      console.log("saveStartingWeek - value:", moment(value).format('L'));
        setWeek(moment(value).format('L'));
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
      });
    });
    
    const formatTime = (item) => {
      var SHours = moment(item.arrivalHours, 'HH');
      var SMinutes = moment(item.arrivalMinutes, 'mm');

      setHours(SHours.format('HH'));
      setMinutes(SMinutes.format('mm'));

      var FHours = moment(item.departHours, 'HH');
      var FMinutes = moment(item.departMinutes, 'mm');

      setFINHours(FHours.format('HH'));
      setFINMinutes(FMinutes.format('mm'));
    }

    const sortTable  = (column) => {
      const newDirection = direction === "desc" ? "asc" : "desc" 
      const sortedData = _.orderBy(flatListItems, [column],[newDirection]);
      setSelectedColumn(column);
      setDirection(newDirection);
      setFlatListItems(sortedData);
    }

    const tableHeader = () => (
      <View style={styles.tableHeader}>
        {
          columns.map((column, index) => {
            {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.columnHeader}
                  onPress={() => sortTable(column)}>
                  <Text style={styles.columnHeaderTxt}>
                    {column + " "}
                    { selectedColumn === column && <MaterialCommunityIcons 
                      name={direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"} 
                    />
                    }
                  </Text>

                </TouchableOpacity>
              )
            }
          })
        }
      </View>
    )
    
// const callBoth = () => 
//   {
//     saveDayofWeek()
//     SearchEntry()
//   } 

   const listItemView = (item) => {
      return (
        <View
          key={item.user_id}
          style={{ marginTop: 20, padding: 30, borderRadius: 10, width: 450, marginLeft: -50 }}>
            
            <View style={{marginBottom: -30}}>
              <Collapse>
      <CollapseHeader style={{marginBottom: -10}}>
        <Separator>
          <Text style={{fontWeight: 'bold'}}>{item.dayoftheweek}  ({item.totalHrs}  Hours) {item.date}</Text>
        </Separator>
      </CollapseHeader>
      <CollapseBody >
        <ListItem >
          <DataTable.Cell>{item.projNum}{'\n'}{item.siteID}</DataTable.Cell>
          <DataTable.Cell style={{marginLeft: -60}}>{Hours}:{Minutes}-{FINHours}:{FINMinutes}</DataTable.Cell>
          
          <DataTable.Cell style={{marginLeft: -80}}>{item.comment}</DataTable.Cell>
        </ListItem>        
      </CollapseBody>
    </Collapse>
            </View>
          </View>
      );
    };    
  
   
   
      return (
        <SafeAreaView style={{ flex: 1}}>
          <View style={styles.container}>
          <View style={{marginLeft: -200, marginTop: -880}}>
          <WeekSelector
            whitelistRange={[new Date(2018, 7, 13), new Date()]}
            weekStartsOn={6}
            onWeekChanged={saveWEEK}
          />
            </View>

            
          <View style={{borderWidth: 3,  borderColor: 'black', borderRadius: 4, marginRight: -200, marginBottom: 170, marginTop: -765}}>
            <Picker style={{width: 150, height: 44, backgroundColor: '#FFF0E0', borderColor: 'black', borderWidth: 1, }}
                    selectedValue={dayoftheWeek}
                    itemStyle={styles.onePickerItems}
                    onValueChange=
                    {
                        saveDayofWeek
                    }>
                            <Picker.Item label={'Sunday' + ' ' +  moment(Week).day("Sunday").format('MMM Do')} value="Sunday" />
                            <Picker.Item label={'Monday' + ' ' +  moment(Week).day("Monday").format('MMM Do')} value="Monday" />
                            <Picker.Item label={'Tuesday' + ' ' +  moment(Week).day("Tuesday").format('MMM Do')} value="Tuesday" />
                            <Picker.Item label={'Wednesday' + ' ' +  moment(Week).day("Wednesday").format('MMM Do')} value="Wednesday" />
                            <Picker.Item label={'Thursday' + ' ' +  moment(Week).day("Thursday").format('MMM Do')} value="Thursday" />
                            <Picker.Item label={'Friday' + ' ' +  moment(Week).day("Friday").format('MMM Do')} value="Friday" />
                            <Picker.Item label={'Saturday' + ' ' +  moment(Week).day("Saturday").format('MMM Do')} value="Saturday" />                           
                            </Picker>
          </View>
          <View style={{flex: 0, marginTop: -100, alignContent: 'center', marginLeft: 130, width: 500, marginBottom: -400}}>
            <FlatList
            data={flatListItems}
            style={{width:"90%", marginLeft: 10}}
            ListHeaderComponent={tableHeader}
            stickyHeaderIndices={[0]}
            keyExtractor={(item, index) => index+""}
            renderItem={({ item, index }) => {
              return (
               
                <View style={{...styles.tableRow, backgroundColor: index % 2 == 1 ? "#F0FBFC" : "white"}}>
                  <TouchableHighlight onPress={showDialog}>
              <Text style={{...styles.columnRowTxt, fontWeight:"bold", width: 80}}>{item.projNum}</Text>
              </TouchableHighlight>
              <Text style={styles.columnRowTxt}>{item.siteID}</Text>
              <Text style={styles.columnRowTxt}>{item.arrivalHours}:{item.arrivalMinutes}/{item.departHours}:{item.departMinutes}</Text>
              <Text style={styles.columnRowTxt}>{item.totalHrs}</Text>
              <Dialog.Container visible={visible}>
              <Dialog.Title>{item.projNum} {" "} {item.siteID}</Dialog.Title>
              <Dialog.Description>
                Day : {item.dayoftheweek} 
              </Dialog.Description>
              <Dialog.Description>
                Project Number : {item.projNum}
                </Dialog.Description>
              <Dialog.Description>
                Site ID : {item.siteID}
                </Dialog.Description>
              <Dialog.Description>
                Start Hours : {item.arrivalHours}:{item.arrivalMinutes}
                {" "} End Hours : {item.departHours}:{item.departMinutes}
                </Dialog.Description>
              <Dialog.Description>
                Total Hrs : {item.totalHrs}
                </Dialog.Description>
              <Dialog.Description>
                Description: {item.comment}
              </Dialog.Description>
              <Dialog.Button label="Edit" onPress={handleCancel} />
              <Dialog.Button label="Delete" onPress={handleDelete} />
            </Dialog.Container>
            </View>
              )
            }} 
          />
          <StatusBar style="auto" />
          </View>
            <View style={{marginTop: 590}}>
<Button icon="plus" onPress={pressHandler}>
                Add Entry
           </Button>


           <Button icon="magnify" onPress={SearchEntry}>
           </Button>

           <Button style icon="delete" onPress={deleteHandler}>
                Delete
           </Button>
            </View>
           
           
           </View>
            
        </SafeAreaView>
   );
   }
    /*
    <View style={{marginLeft: -200, marginTop: -550}}>
              
          
            </View>
           
    */
   
   const styles = StyleSheet.create({
       container:{
         backgroundColor: '#fff',
         alignItems: 'center',
           justifyContent: 'center',
           flex: 1,
           paddingTop: 80
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
            },
            onePickerItems: {
              height: 44,
              color: 'blue',
              fontWeight: 'bold'
            },
            tableHeader: {
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: "#09253a",
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
              height: 50,
              width: 350
            },
            tableRow: {
              flexDirection: "row",
              height: 40,
              alignItems:"center",
            },
            columnHeader: {
              width: "20%",
              justifyContent: "center",
              alignItems:"center"
            },
            columnHeaderTxt: {
              color: "white",
              fontWeight: "bold",
            },
            columnRowTxt: {
              width:"25%",
              textAlign:"center",
              
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