import * as React from 'react';
import { StatusBar, FlatList, Image, Animated, Text, View, Dimensions, StyleSheet, TouchableHighlight, Easing, SafeAreaViewBase, SafeAreaView, } from 'react-native';
const { width, height } = Dimensions.get('screen');
import WeekSelector from 'react-native-week-selector';
import { DatabaseConnection } from '../components/database-connection';
import moment from 'moment';
import { IconButton } from 'react-native-paper';
import Dialog from "react-native-dialog";

const db = DatabaseConnection.getConnection();

const BG_IMG = 'https://www.solidbackgrounds.com/images/1280x720/1280x720-dark-midnight-blue-solid-color-background.jpg';

const SPACING = 20;
const AVATAR_SIZE = 50;
const ITEM_SIZE = AVATAR_SIZE + SPACING *3;

export default function ListView({ navigation }) {
    const [flatListItems, setFlatListItems] = React.useState([]);
    const [selectedWeek, setselectedWeek] = React.useState();
    const [Hours, setHours] = React.useState('');
    const [Minutes, setMinutes] = React.useState('');
    const [FINHours, setFINHours] = React.useState('');
    const [FINMinutes, setFINMinutes] = React.useState('');
    const [dayoftheWeek, setDayoftheWeek] = React.useState('');
    const [Week, setWeek] = React.useState();
    const [currentDate, setCurrentDate] = React.useState('');
    const [formatDay, setformatDay] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [ direction, setDirection ] = React.useState(null);
    const [ selectedColumn, setSelectedColumn ] = React.useState(null);
    const [totalHrsforday, settotalHrsforday] = React.useState([]);
    const [totalHrsforWeek, settotalHrsforWeek] = React.useState([]);

    const pressHandler = () => 
    {
    navigation.navigate('Home')
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
  
    const saveStartingWeek = (value) => {
    moment.locale('en');
    console.log("saveStartingWeek - value:", moment(value).format('L'));
    setselectedWeek(moment(value).format('L'));
    }

    const scrollY = React.useRef(new Animated.Value(0)).current;         


    const filterTimeFormat = (time) => {
        var decimal_places = 2;
  
        // Maximum number of hours before we should assume minutes were intended. Set to 0 to remove the maximum.
        var maximum_hours = 15;
      
        // 3
        var int_format = time.match(/^\d+$/);
        
        // 1:15
        var time_format = time.match(/([\d]*):([\d]+)/);
        console.log('time_format: ' + time_format);
        // 10m
        var minute_string_format = time.toLowerCase().match(/([\d]+)m/);
      
        // 2h
        var hour_string_format = time.toLowerCase().match(/([\d]+)h/);
      
        // if (minutes >= 60) {
        //     minutes = minutes - 60;
        //     hours = hours + 1;
        //     console.log('min: ' + minutes)
        //   }
          
        if (time_format != null) {
          var hours = parseInt(time_format[1]);
          var minutes = parseFloat(time_format[2]/60);
           if (minutes >= 0) {
             console.log('greater!!!!');
           }
            var time = hours + minutes;
          
          
        } else if (minute_string_format != null || hour_string_format != null) {
          if (hour_string_format != null) {
            hours = parseInt(hour_string_format[1]);
          } else {
            hours = 0;
          }
          if (minute_string_format != null) {
            minutes = parseFloat(minute_string_format[1]/60);
            
          } else {
            minutes = 0;
          }
          time = hours + minutes;
        } else if (int_format != null) {
          // Entries over 15 hours are likely intended to be minutes.
          time = parseInt(time);
          if (maximum_hours > 0 && time > maximum_hours) {
            time = (time/60).toFixed(decimal_places);
          }
        }
      
        // make sure what ever we return is a 2 digit float
        time = parseFloat(time).toFixed(decimal_places);
      
        return time;  
      }

      let SearchEntry = () => {
        db.transaction((tx) => {
       tx.executeSql(
        'SELECT * FROM Timesheet WHERE eow = ?',
        [selectedWeek],
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
   console.log(temp)
           } else {
             alert('Cannot Search Entry!');
           }
                         }
       );
                       });

        db.transaction((tx) => {
        tx.executeSql(
        'SELECT totalHrs FROM Timesheet WHERE eow = ?',
        [selectedWeek],
        (tx, results) => {
        //var temp = [];
        //for (let i = 0; i < results.rows.length; ++i)
        //temp.push(results.rows.item(i));
        //setFlatListItems(temp);
        var temp = [];
        let sum = 0.0 ;
        var tot = [];
        var len = results.rows.length;
        
        console.log('len', len);
        if(len >= 0 ) {
        
        for (let i = 0; i < results.rows.length; ++i)
        
        temp.push(results.rows.item(i));
        temp.forEach((item) => {
            //sum += parseFloat(item.totalHrs);
            tot.push(filterTimeFormat(item.totalHrs));
        })
        tot.forEach(function (i) {
            sum = sum + parseFloat(i);
        } )
        settotalHrsforWeek(sum);
        console.log('sum: ' + sum)
        } else {
        alert('Cannot Search Entry!');
        }
            }
        );
                        });
                    }


    return ( 
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 30}}>
        <Image 
        source={{uri: BG_IMG}}
        style={StyleSheet.absoluteFillObject}
        blurRadius={100}
        />
        <IconButton icon="magnify" size={45} style={{marginLeft: 320, marginTop: 50, position: 'absolute', backgroundColor: '#e6c877',  backgroundColor: '#e6c877', borderWidth: 3, borderColor: 'white'}} onPress={SearchEntry} />
        <View style={{
            marginTop: 10,
            height: 100,
            width:300,
            marginLeft: 10,
            borderWidth: 3,
            borderColor: 'white',
            backgroundColor: '#FFF0E0',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 5, 
        }}>
            <Text style={{fontWeight: '700', fontSize: 20, marginBottom: 12, color: 'black'}}>  Week Ending: {moment(selectedWeek).format('MMM Do')}</Text>
        <WeekSelector
            whitelistRange={[new Date(2021, 1, 9), new Date()]}
            weekStartsOn={6}
            onWeekChanged={saveStartingWeek}
          />
          </View>


          <Text style={{backgroundColor: "#42f599", borderColor: 'black', paddingHorizontal: 25, paddingTop: 5, borderRadius: 10, height: 40, fontSize: 20, fontWeight: 'bold', width: 275, marginTop: 15, marginLeft: 60, borderWidth: 3}}>Day Total Hours: {totalHrsforWeek}</Text>

        <Animated.FlatList 
        data={flatListItems}
        onScroll={
            Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                [{ useNativeDriver: true}]
            )
        }
        keyExtractor={item => item.key}
        contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight
        }}
        renderItem={({item, index}) => {
            const inputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 2)
            ]
            const opacityInputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 1)
            ]

            const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0]
            })

            const opacity = scrollY.interpolate({
                inputRange: opacityInputRange,
                outputRange: [1, 1, 1, 0]
            })


            return <Animated.View style={{flexDirection: 'row', padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 10
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                opacity,
                transform: [{scale}]
            }}>
                <Image 
                    source={{uri: 'https://cdn5.f-cdn.com/contestentries/1503819/34508403/5ce0587fe3d17_thumb900.jpg'}}
                    style={{width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE}}
                />
                <View>
                <TouchableHighlight onPress={showDialog}>
                    <Text style={{fontWeight: '700', fontSize: 22, color: 'black'}}>  {item.arrival} - {item.depart}     [{item.totalHrs}]</Text>
                </TouchableHighlight>
                
              <Dialog.Container visible={visible}>
              <Dialog.Title>{item.projNum + " " + !item.siteID}</Dialog.Title>
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
                Start Hours : {item.arrival}
                {" "} End Hours : {item.depart}
                </Dialog.Description>
              <Dialog.Description>
                Total Hrs : {item.totalHrs} 
                {" "} {totalHrsforday} {" "} {totalHrsforWeek}
                </Dialog.Description>
              <Dialog.Description>
                Description: {item.comment}
              </Dialog.Description>
              <Dialog.Button label="Edit" onPress={handleCancel} />
              <Dialog.Button label="Delete" onPress={handleDelete} />
            </Dialog.Container>
                    <Text style={{opacity: .7, fontSize: 15}}>  {item.projNum} {item.siteID}</Text>
                    <Text style={{fontWeight: 'bold', opacity: .8, fontSize: 14, color: '#000000'}}> {moment(item.date).format('MMM Do')} {item.comment}</Text> 
                    <Text style={{opacity: .7, fontSize: 15}}> {item.comment} </Text> 
                </View>
            </Animated.View>   
        }}
        />
        </View>
    );
} 