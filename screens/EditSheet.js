
import React, {useEffect, useState,useRef} from 'react';
import { StyleSheet, Text, Image, View, SafeAreaView, TextInput, Alert, StatusBar, Animated, TouchableOpacity, TouchableHighlight} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import { Button } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import WeekSelector from 'react-native-week-selector';
import "intl";
import "intl/locale-data/jsonp/en";
import { DatabaseConnection } from '../components/database-connection';
import moment from 'moment';
import profile from '../assets/profile.png';
// Tab ICons...
import home from '../assets/home.png';
import search from '../assets/clock.png';
import notifications from '../assets/calendar.png';
import settings from '../assets/settings.png';
import logout from '../assets/logout.png'
// Menu
import menu from '../assets/menu.png';
import close from '../assets/close.png';

// Photo
import photo from '../assets/photo.jpg';

const db = DatabaseConnection.getConnection();

const EditSheet = ({ navigation }) => {

  const selectDate = new Date();
  const [currentDate, setCurrentDate] = React.useState(navigation.getParam('date'));
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false)

  const [modalVisible, setModalVisible] = React.useState(false);
  const [dayoftheWeek, setDayoftheWeek] = React.useState(navigation.getParam('dayoftheweek'));
  const [projNum, setprojNum] = React.useState(navigation.getParam('projNum'));
  const [siteID, setsiteID] = React.useState(navigation.getParam('siteID'))
  const [Thrs, setThrs] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [finishvisible, setfinishVisible] = React.useState(false);
  const [Lvisible, setLVisible] = React.useState(false);
  const [Lfinishvisible, setLfinishVisible] = React.useState(false);

  const [IDtimesheet, setIDtimesheet] = React.useState(navigation.getParam('id_timesheet'));
  const [Hours, setHours] = React.useState('');
  const [Minutes, setMinutes] = React.useState('');
  const [finishHours, setfinishHours] = React.useState(selectDate.getHours());
  const [finishMinutes, setfinishMinutes] = React.useState(selectDate.getMinutes());
  const [LunchHours, setLunchHours] = React.useState(selectDate.getHours());
  const [LunchMinutes, setLunchMinutes] = React.useState(selectDate.getMinutes());
  const [finishLunchHours, setfinishLunchHours] = React.useState(selectDate.getHours());
  const [finishLunchMinutes, setfinishLunchMinutes] = React.useState(selectDate.getMinutes());
  
  const [frTimes, setfrTimes] = React.useState(navigation.getParam('arrival'));
  const [frFinTimes, setfrFinTimes] = React.useState(navigation.getParam('depart'));
  const [selectedWeek, setselectedWeek] = React.useState(navigation.getParam('eow'));
  const [description, setDescription] = React.useState(navigation.getParam('comment'));
  const [currentTab, setCurrentTab] = useState("");
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);

  // Animated Properties...

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

   // For multiple Buttons...
const TabButton = (currentTab, setCurrentTab, title, image) => {
  return (

    <TouchableOpacity onPress={() => {
      if (title == "LogOut") {
        navigation.navigate("Login")
      } if (title == "Hour") {
        navigation.navigate("Hour")
      }  if (title == "TS Review") { //TS Review
        navigation.navigate("Test")
      }  if (title == "Home") { 
        navigation.navigate("Home")
      } 
      else {
        setCurrentTab(title)
      }
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: currentTab == title ? 'white' : 'transparent',
        paddingLeft: 13,
        paddingRight: 35,
        borderRadius: 8,
        marginTop: 15
      }}>

        <Image source={image} style={{
          width: 25, height: 25,
          tintColor: currentTab == title ? "#5359D1" : "white"
        }}></Image>

        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          paddingLeft: 15,
          color: currentTab == title ? "#5359D1" : "white"
        }}>{title}</Text>

      </View>
    </TouchableOpacity>
  );
}


const onDismiss = React.useCallback(() => {
  setVisible(false)
}, [setVisible])

const onFinishDismiss = React.useCallback(() => {
  setfinishVisible(false)
}, [setfinishVisible])

const onLDismiss = React.useCallback(() => {
  setLVisible(false)
}, [setLVisible])

const onLFinishDismiss = React.useCallback(() => {
  setLfinishVisible(false)
}, [setLfinishVisible])


const onConfirm = React.useCallback(
  ({ hours, minutes }) => {
    setVisible(false);
    console.log({ hours, minutes });
    var FrHours = moment(hours, 'HH');
    var FrMinutes = moment(minutes, 'mm');
    //setTime('{$hours}:${minutes}')
    hours = setHours(FrHours.format('HH'));
    minutes = setMinutes(FrMinutes.format('mm'));
    //setHours(hours.toString());
    //setMinutes(minutes.toString());
    var times = FrHours.format('HH') + ':' + FrMinutes.format('mm');
    console.log('time: ' + times);
    setfrTimes(times);
  },
  [setVisible]
);

const onFinishConfirm = React.useCallback(
  ({ hours, minutes }) => {
    setfinishVisible(false);
    console.log({ hours, minutes });
    var FinHrs = moment(hours, 'HH');
    var FinMnts = moment(minutes, 'mm');
    hours = setfinishHours(FinHrs.format('HH'));
    minutes = setfinishMinutes(FinMnts.format('mm'));
    var Fintimes = FinHrs.format('HH') + ':' + FinMnts.format('mm');
    console.log('Finish Times: ' + Fintimes);
    setfrFinTimes(Fintimes);
    calcTotalHrs()
  },
  [setfinishVisible]
);

const onLConfirm = React.useCallback(
  ({ hours, minutes }) => {
    setLVisible(false);
    console.log({ hours, minutes });
    //setTime('{$hours}:${minutes}')
    hours = setLunchHours(hours);
    minutes = setLunchMinutes(minutes);
  },
  [setLVisible]
);

const onLFinishConfirm = React.useCallback(
  ({ hours, minutes }) => {
    setLfinishVisible(false);
    console.log({ hours, minutes });
    //setTime('{$hours}:${minutes}')
    hours = setfinishLunchHours(hours);
    minutes = setfinishLunchMinutes(minutes);
  },
  [setLfinishVisible]
);



// const save = async () => {
//   try{
//     await AsyncStorage.setItem("MyWeekEnding", selectedWeek)
//     await AsyncStorage.setItem("MyWeek", currentDate)
//     //await AsyncStorage.setItem("MyDays", dayoftheWeek)
//     await AsyncStorage.setItem("MyProjNum", projNum)
//   }
//   catch (err)
//   {
//     alert(err)
//   }
// };

// const load = async () => {
//   try{
//    let selectedWeek = await AsyncStorage.getItem("MyWeekEnding")
//    let currentDate = await AsyncStorage.getItem("MyWeek")
//    //let dayoftheWeek = await AsyncStorage.getItem("MyDays")
//    let projNum = await AsyncStorage.getItem("MyProjNum")

//    if(selectedWeek !== null)
//    {
//     setselectedWeek(selectedWeek)
//    }
   
//    if(currentDate !== null)
//    {
//     setCurrentDate(currentDate)
//    }

//   //  if(dayoftheWeek !== null)
//   //  {
//   //   setDayoftheWeek(dayoftheWeek)
//   //  }

//    if(projNum !== null)
//     {
//       setprojNum(projNum)
//     }

//   }
//   catch (err){
//     alert(err)
//   }
// };

// React.useEffect(() => {
//   load();
// },[])



const renderUserNames = () => {
  if(projNum=='VOD103015'){
    return [<Picker.Item key="uniqueID8" label="CE005 ~ Woodcock Hill" value="CE005 ~ Woodcock Hill" />,
           <Picker.Item key="uniqueID7" label="CE006 ~ Crusheen knocknamucky" value="CE006 ~ Crusheen knocknamucky" />,
          <Picker.Item key="uniqueID6" label="CE007 ~ Lack West" value="CE007 ~ Lack West" />,
          <Picker.Item key="uniqueID5" label="CE008 ~ Dangan Ballyvaughan" value="CE008 ~ Dangan Ballyvaughan" />,
          <Picker.Item key="uniqueID4" label="CE009 ~ Glenagall" value="CE009 ~ Glenagall" />]
   }
 
   else if(projNum=='ABO101597'){
     return [<Picker.Item key="uniqueID3" label="CLS001 ~ Cluster 1 OHL" value="CLS001 ~ Cluster 1 OHL" />
           ]
    }
 
    else if(projNum=='VOD75860'){
      return [<Picker.Item key="uniqueID4" label="DN823 Robinson Transport -  Bolts removed from fenc - DN823 Robinsons Transport" value="DN823 Robinson Transport -  Bolts removed from fenc - DN823 Robinsons Transport" />
            ]
     }

   else{
        return [<Picker.Item key="uniqueID1" label="Client 1" value="Client 1" />,
         <Picker.Item key="uniqueID2" label="Client 2" value="Client 2" />]
     }

}

React.useEffect(() => {
  var tdate = new Date(); //Current Date
  var monday = moment().day((1)+1); //shows Monday
  var friday = moment().day((5)+1); //shows Monday
  var Tday = tdate.getDay(); //Current Day
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds
  /*setCurrentDate(
  
    //date + '/' + month + '/' + year 
    //+ ' ' + hours + ':' + min + ':' + sec
    moment(tdate).format("YYYY-MM-DD")
);*/
}, []);

const testClash = (d1, d2) => {     //calculating the weight of the conflict.
  // d1 and d2 in array format
// [moment from, moment to]
var count = 0;
for (var i = 0, t; t = d1[i]; i++) {
// use isBetween exclusion
if (t.isBetween(d2[0], d2[1], null, '()')) {
  count++;
}
}

for (var i = 0, t; t = d2[i]; i++) {
// use isBetween exclusion
if (t.isBetween(d1[0], d1[1], null, '()')) {
  count++;
}
}

if (count > 1) {
return console.log('completely conflict');
}

if (count > 0) {
return console.log('partial conflict');
}

return console.log('something else');
}

var t1 = [moment(frTimes).format('HH:mm'), moment(frTimes).format('HH:mm')]


  let updateAllStates = (name, contact, address) => {
    setUserName(name);
    setUserContact(contact);
    setUserAddress(address);
  };

  let searchUser = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_user where id_timesheet = ?',
        [navigation.getParam("id_timesheet")],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            updateAllStates(
              res.user_name,
              res.user_contact,
              res.user_address
            );
          } else {
            alert('Usu??rio n??o encontrado!');
            updateAllStates('', '', '');
          }
        }
      );
    });
  };
  let updateUser = () => {
    console.log( selectedWeek, currentDate, projNum, description, frTimes, frFinTimes, Thrs, siteID, dayoftheWeek);

    if (!frTimes) {
      alert('Add Hours for the entry');
      return;
    }
    
    if (!frFinTimes) {
      alert('Add End Hours for the entry');
      return;
    }  
    
    if (!dayoftheWeek) {
      alert('Please select a day of the week');
      return;
    }
    if (!projNum) {
      alert('Please select a Project ');
      return;
    }

    if (!siteID) {
      alert("Don't forget to add a site");
      return;
    }


    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Timesheet set arrival = ?, depart = ? , dayoftheweek = ?, projNum = ?, siteID = ?, comment = ?  where id_timesheet=?',
        [frTimes, frFinTimes, dayoftheWeek, projNum, siteID, description,  IDtimesheet],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Sucess',
              'Entry edited Succesfully!!!',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                  navigation.navigate('Home'), 
                },
              ],
              { cancelable: false }
            );
          } else alert('Error editing the entry!');
        }
      );
    });
  };
  

  let options  = renderUserNames();

  const saveDayofWeek = (itemValue, itemIndex) => {
    setDayoftheWeek(itemValue);
    var next = getNextDay(dayoftheWeek);
    //console.log(next.getTime());
    moment.locale('en');
    console.log(moment(next.getTime()).format("L"));
    setCurrentDate(moment(next.getTime()).format("L"));
    

  }

  const getNextDay = (dayName) => {
    var todayDate = new Date(selectedWeek);
    var now = todayDate.getDay();

    // Days of the week
	var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	// The index for the day you want
	var day = days.indexOf(dayName.toLowerCase());

  // Find the difference between the current day and the one you want
	// If it's the same day as today (or a negative number), jump to the next week
	var diff = day - now;
	diff = diff < 1 ? diff : diff;

	// Get the timestamp for the desired day
	var nextDayTimestamp = todayDate.getTime() + (1000 * 60 * 60 * 24 * diff);

	// Get the next day
	return new Date(nextDayTimestamp);

  }

  const saveStartingWeek = () => {
    moment.locale('en')
        console.log("saveStartingWeek - value:", moment(value).add(5, "days").format("L"));
        setselectedWeek(moment(value).add(5, "days").format("L"));
        //setselectedWeek(navigation.getParam('eow'));
        //setselectedWeek(new Date(value).toString());

  }

  const getTimefromMins = (mins) => {
    if (mins >= 24 * 60 || mins < 0) {
      Alert.alert("Any Given Entry Should be less than 12 Hours");
    }
    var h = mins / 60 | 0;
    var m = mins % 60 | 0;

    return moment.utc().hours(h).minutes(m).format("HH:mm");
  }

  // const splitTime = (time) => {  //function to split time in hours and minutes seperatly
  //   var today = new Date();
  //   var _t = time.split(";");
  //   today.setHours(_t[0], _t[1], 0, 0);
  //   return today;
  // }

  // const validate = (sTime, eTime) => {
  //   if(+splitTime(sTime) < +splitTime(eTime)) {
  //     var len = timeList.length;
  //     return len>0?(+splitTime(timeList[len - 1].e))
  //   }
  // }

   const calcTotalHrs = () => {
    //setfinishVisible(true)
     var StrtTime = moment(frTimes, "HH:mm");
     var endTime = moment(frFinTimes, "HH:mm");

     var duration = moment.duration(StrtTime.diff(endTime));
     var DHrs = parseInt(duration.asHours());
    var Dmins = parseInt(duration.asMinutes())-DHrs* 60;
     var Tot  = endTime.diff(StrtTime, 'minutes');
     var timetomins = getTimefromMins(Tot);
     //setThrs(Tot);
     
  //   //Alert.alert(DHrs + 'Hrs');
     setThrs(timetomins);
     db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Timesheet set totalHrs = ?  where id_timesheet=?',
        [timetomins,  IDtimesheet],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) 
          {
           console.log("Sucess " + timetomins)
          } 
          else 
          alert('Erro ao atualizar o usu??rio');
        }
      );
    });
 }

 const finishTime = () => {
  setfinishVisible(true)
 }

 const both  = () => 
 {
   calcTotalHrs();
   updateUser(Thrs);

 }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'flex-start', padding: 15 }}>
        <Image source={profile} style={{
          width: 60,
          height: 60,
          borderRadius: 10,
          marginTop: 12
        }}></Image>

        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 20
        }}>Jenna Ezarik</Text>

        <TouchableOpacity>
          <Text style={{
            marginTop: 6,
            color: 'white'
          }}>View Profile</Text>
        </TouchableOpacity>

        <View style={{ flexGrow: 1, marginTop: 50 }}>
          {
            // Tab Bar Buttons....
          }

          {TabButton(currentTab, setCurrentTab, "Home", home)}
          {TabButton(currentTab, setCurrentTab, "Hour", search)}
          {TabButton(currentTab, setCurrentTab, "TS Review", notifications)}
          {TabButton(currentTab, setCurrentTab, "Settings", settings)}

        </View>

        <View>
          {TabButton(currentTab, setCurrentTab, "LogOut", logout)}
        </View>

      </View>
      {
        // Over lay View...
      }
      <Animated.View style={{
        flexGrow: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: showMenu ? 15 : 0,
        // Transforming View...
        transform: [
          { scale: scaleValue },
          { translateX: offsetValue }
        ]
      }}>

        {
          // Menu Button...
        }

        <Animated.View style={{
          transform: [{
            translateY: closeButtonOffset
          }]
        }}>
          <TouchableHighlight onPress={() => {
            // Do Actions Here....
            // Scaling the view...
            Animated.timing(scaleValue, {
              toValue: showMenu ? 1 : 0.88,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(offsetValue, {
              // YOur Random Value...
              toValue: showMenu ? 0 : 230,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(closeButtonOffset, {
              // YOur Random Value...
              toValue: !showMenu ? -30 : 0,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            setShowMenu(!showMenu);
          }}>
 
 
 <View >
             <View style={styles.head}>
           <Image source={showMenu ? close : menu} style={{
              width: 20,
              height: 20,
              tintColor: 'white',
              marginTop: 20,
              marginLeft: -135

            }}></Image>
        <View>
                <Text style={styles.headText}>                   Edit Entry</Text>
        

        </View>

 </View>
        </View>

            

          </TouchableHighlight>





    <View style={{marginTop: 110}}>
      <View style={styles.Weekarrow}>
        <Text style={{fontWeight: 'bold',  color: '#091629', marginLeft: 10, marginTop: 5, fontSize: 16}}>Week Ending: {selectedWeek} </Text>
        <Text style={{fontWeight: 'bold',  color: '#091629', marginLeft: 10, fontSize: 16}}>Week day: {moment(currentDate).format('dddd MMM Do')}</Text>
      </View>
  
      <View style={styles.section}>
        <TimePickerModal style={styles.section}
    visible={visible}
    onDismiss={onDismiss}
    onConfirm={onConfirm}
    hours={12} // default: current hours
    minutes={14} // default: current minutes
    label="Select time" // optional, default 'Select time'
    cancelLabel="Cancel" // optional, default: 'Cancel'
    confirmLabel="Ok" // optional, default: 'Ok'
    animationType="fade" // optional, default is 'none'
    locale={'en'} // optional, default is automically detected by your system
  
  
  />
  <Button color="#09253a" style={styles.startTime} icon="walk" onPress={()=> setVisible(true)}>
    Start: {frTimes}
  </Button>
  
  <TimePickerModal
    visible={finishvisible}
    onDismiss={onFinishDismiss}
    onConfirm={onFinishConfirm}
    hours={12} // default: current hours
    minutes={14} // default: current minutes
    label="Select time" // optional, default 'Select time'
    cancelLabel="Cancel" // optional, default: 'Cancel'
    confirmLabel="Ok" // optional, default: 'Ok'
    animationType="fade" // optional, default is 'none'
    locale={'en'} // optional, default is automically detected by your system
  
  />
  <Button color="#09253a" style={styles.endTime} icon="run" onPress={() => setfinishVisible(true)}>
    Finish: {frFinTimes}
  </Button>
  
  </View>
  
      <View style={styles.btn}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.titleStyle}>Project No </Text>
          <View style={styles.pickerStyle}>
              {<Picker
                  mode='dropdown'
                  selectedValue={projNum}
                  onValueChange={(itemValue, itemIndex) =>
                      //this.setState({ projNum: itemValue })
                      setprojNum(itemValue)
                  }>
                  <Picker.Item key="uniqueID9" label="Please Select" value="" />
                  <Picker.Item key="uniqueID10" label="VOD103015 ~ Assure Provide engsupport Oct 1st to Oct 31st 2019" value="VOD103015" />
                  <Picker.Item key="uniqueID11" label="ABO101597 ~ Over head Line works Cluster 1 ~ CLS001 ~ Cluster1 OHL" value="ABO101597" />
                  <Picker.Item key="uniqueID12" label="VOD75860 ~ DN823 Robinsons Transport" value="VOD75860" />
                  <Picker.Item key="uniqueID13" label="Client" value="Client" />
              </Picker>}
          </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text style={styles.titleStyle}>Site ID</Text>
          <View style={styles.pickerStyle2}>
              {<Picker
                  mode='dropdown'
                  selectedValue={siteID}
                  onValueChange={(itemValue, itemIndex) =>
                      //this.setState({ siteID: itemValue })
                      setsiteID(itemValue)
                  }>
                  <Picker.Item label="Please Select" value="" />
                       {options}
  
              </Picker>}
          </View>
      </View>
     </View>
  
  
     
  
  
  <TextInput 
  placeholder="  Description"
  onChangeText={description => setDescription(description)} 
  defaultValue={description}
  style={styles.input}
  
  />
  
        <Button onPress={both} style={{marginTop: 40}}>
          Update
  </Button>
  

          
  
      </View>
      </Animated.View>
      </Animated.View>
  </SafeAreaView>
     );
     }
     
     
     const styles = StyleSheet.create({
         container:{
          flex: 1,
            backgroundColor: '#091629',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
           
             },
             date: {
               flex: 1,
               fontWeight: 'bold',
               justifyContent: 'center',
             },
             text: {
               paddingLeft: 15,
               fontSize: 50,
               fontWeight: 'bold',
             },
             Weekarrow:{
              height: 70,
              width:370,
              marginTop:-70,
              marginBottom: 30,
              backgroundColor: '#87CEEB',
              borderRadius: 20,
              fontWeight: 'bold'
             },
  
             startTime:{
              marginLeft: -200,
              width: 140
             },
  
             endTime:{
              marginLeft: 200,
              marginTop: -38,
              width: 140
             },
  
             startLunch:{
              marginLeft: -200,
              width: 140
             },
  
             endLunch:{
              marginLeft: 200,
              marginTop: -38,
             },
             
           text:{
             alignItems: 'center',
             marginTop:20,
             justifyContent: 'center'
             },
             title: {
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              padding: 20,
            },
     
         icons:{
             alignItems: 'center',
             color:'white',
             marginBottom:200,
             justifyContent: 'center'
             },
     
             text1:{
               alignItems: 'center',
               marginTop: -50,
               marginBottom: 75,
               justifyContent: 'center'
               },
               section: {
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 5,
                marginBottom: 25
                
               },
               
               input: {
                margin: 15,
                height: 50,
                width: 340,
                borderColor: "#09253a",
                borderWidth: 2,
                borderRadius: 10,
                marginTop: 50
             },
             titleStyle: {
              marginLeft:20,
              marginTop:10,
              padding:-10,
              fontWeight:'bold',
              color: '#091629'
              },
          
            pickerStyle: {
              width:325,
              marginLeft:-50,
              padding: -15,
              marginTop:35,
              marginRight: -40,
              color: '#091629'
              },
          
              pickerStyle2: {
                width:325,
                marginLeft:-20,
                padding: -15,
                marginTop:35,
                marginRight: -40,
                },
          
                
                modalView: {
                  margin: 20,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 35,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                },
                button: {
                  backgroundColor: '#091629',
                  borderRadius: 20,
                  padding: 10,
                  elevation: 2
                  
                },
                buttonOpen: {
                  backgroundColor: "#091629",
                },
                buttonClose: {
                  backgroundColor: "#2196F3",
                },
                sameWeek: {
                  marginTop: -25,
                  marginLeft: 20,
                  marginBottom: 20,
                  color: 'black'
                },
          
                check: {
                  marginLeft: -150,
                   marginTop: 15,
                  color: 'black'
                },
          
                textStyle: {
                  backgroundColor: '#091629',
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center"
                },
                modalText: {
                  marginBottom: 15,
                  textAlign: "center"
                },
                head: {
                 padding:0,
                 marginLeft:-15.5,
                 marginTop: -20,
                 width: 400,
                 height: 70,
                 flexDirection: 'row',
                 alignItems: 'center',
                 justifyContent: 'center',
                 backgroundColor: '#091629',
                 borderTopLeftRadius: 10
                 },
                 
                 headText: {
                 fontWeight: 'bold',
                 fontSize: 20,
                 color: 'whitesmoke',
                 letterSpacing: 1,
                 marginBottom:-18
                 },
              });
       
export default EditSheet;