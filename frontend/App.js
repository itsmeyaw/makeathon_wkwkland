import React from 'react';
import { useState } from 'react';
import { Text, ScrollView, StatusBar, Modal, Alert, View, StyleSheet, Pressable } from 'react-native';
import { AppBar, IconButton, TextInput } from "@react-native-material/core";
import { Card } from 'react-native-elements'
import Report from "./Report.js"
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FAB } from 'react-native-paper';
import uuid from 'react-native-uuid';

const testUsers = [
  {
    id: 1,
    name: 'Eber',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
  },
  {
    id: 2,
    name: 'Dylan',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
  },
  {
    id: 3,
    name: 'Yudhis',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
  },
  {
    id: 4,
    name: 'AI',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
  },
];

const reports = [{
  "name": "TUMAI",
  "UUID": "8927302341934",
  "DateStart": "01.01.2001",
  "DateEnd": "30.30.2030",
  "chronologies": [
    {
      "time": "01.01.2023",
      "UUID": "a1b2c3d4e5f6",
      "name": "New Year's Day",
      "activities": [
        {
          "UUID": "a1b2c3d4e5f6a1",
          "order_number": 1,
          "name": "Trying to keep the New Year's resolutions for at least one day"
        },
        {
          "UUID": "a1b2c3d4e5f6a2",
          "order_number": 2,
          "name": "Eating leftover Christmas cookies for breakfast"
        },
        {
          "UUID": "a1b2c3d4e5f6a3",
          "order_number": 3,
          "name": "Realizing that January 1st is just another day"
        }
      ]
    },
    {
      "time": "14.02.2023",
      "UUID": "g7h8i9j0k1l2",
      "name": "Valentine's Day",
      "activities": [
        {
          "UUID": "g7h8i9j0k1l2a1",
          "order_number": 1,
          "name": "Eating an entire box of chocolates by myself"
        },
        {
          "UUID": "g7h8i9j0k1l2a2",
          "order_number": 2,
          "name": "Watching rom-coms and feeling sorry for myself"
        },
        {
          "UUID": "g7h8i9j0k1l2a3",
          "order_number": 3,
          "name": "Crying into my pillow and wondering why I'm single"
        }
      ]
    },
    {
      "time": "17.03.2023",
      "UUID": "m3n4o5p6q7r8",
      "name": "St. Patrick's Day",
      "activities": [
        {
          "UUID": "m3n4o5p6q7r8a1",
          "order_number": 1,
          "name": "Wearing green and pretending to be Irish"
        },
        {
          "UUID": "m3n4o5p6q7r8a2",
          "order_number": 2,
          "name": "Drinking green beer and regretting it the next day"
        },
        {
          "UUID": "m3n4o5p6q7r8a3",
          "order_number": 3,
          "name": "Trying to catch a leprechaun and steal his pot of gold"
        }
      ]
    }
  ]
}];

/*
WIP - Deleting chronology
*/
const deleteChronology = (id) => {
  const chronologyIndexToDelete = reports[reportIndex].chronologies.findIndex(
    (chronology) => chronology.UUID === uuidToDelete
  );
  if (chronologyIndexToDelete >= 0) {
    reports[reportIndex].chronologies.splice(chronologyIndexToDelete, 1);
    console.log("Chronology deleted successfully.");
  } else {
    console.log("Chronology with UUID " + uuidToDelete + " not found.");
  }
}


const App = () => {

  const [modalVisible, setModalVisible] = useState(false);

  /*
  States to create a new Chronology which changes with the text boxes
  */
  const [newChronologyName, setNewChronologyName] = useState('');
  const [newChronologyDate, setNewChronologyDate] = useState('');

  return (
    <>
      <StatusBar backgroundColor="#2b2b2b"></StatusBar>
      <AppBar leading={props => (<IconButton icon={props => <Icon name="menu" {...props} />} {...props} />)}

      /*
        Temporarily set the name of the current report to Report 0
        TODO: Change to adjust to current actual Report
      */
        trailing={props => (<IconButton icon={props => <Icon name="download" {...props} />} {...props} onPress={()=>{Alert.alert("DOOOOOOWNNN")}}/>)}
        title={reports[0].name}
        color="#2b2b2b" />
      <ScrollView>
        {
          reports.map((u, i) => {
            return (
              <Report key={i} report={u}>
              </Report>
            );
          })
        }
        <Card>
          <Text>
            End of Chronology
          </Text>
        </Card>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New Chronology</Text>
            <Text>Chronology Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(i) => { console.log("name input:" + i); setNewChronologyName(i); }}
              placeholder={'e.g. "TUM.AI Hackathon KickOff" '}
            />
            <Text>Time</Text>
            <TextInput
              style={styles.input}
              onChangeText={(i) => { console.log("time input:" + i); setNewChronologyDate(i); }}
              placeholder={'e.g. "28.04.2023 15:02" '}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {

                const chronologyToAdd =
                  { "time": newChronologyDate, "name": newChronologyName, "UUID": uuid.v4(), "activities": [] }
                console.log(chronologyToAdd)

                /*
                Currently only adds to Report 0
                */
                reports[0].chronologies.push(chronologyToAdd)

                Alert.alert("Chronology added"); setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Add</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { setModalVisible(!modalVisible); }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <AppBar
        variant="bottom"
        style={{ position: "absolute", start: 0, end: 0, bottom: 0 }}
        transparent='false'>
        <FAB
          icon={props => <Icon name="plus" {...props} />}
          style={{ position: "absolute", top: -10, alignSelf: "center" }}
          onPress={() => { setModalVisible(!modalVisible); setNewChronologyDate(""); setNewChronologyName(""); }}
        />
      </AppBar>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center'
  },
  modalView: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;