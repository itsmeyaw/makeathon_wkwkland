import React from 'react';
import { useState } from 'react';
import { Text, ScrollView, StatusBar, Modal, Alert, View, StyleSheet, Pressable } from 'react-native';
import { AppBar, IconButton, TextInput } from "@react-native-material/core";
import { Card } from 'react-native-elements'
import Report from "./Report.js"
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FAB } from 'react-native-paper';
import uuid from 'react-native-uuid';

const MainReport = ({ reports }) => {

  const [modalVisible, setModalVisible] = useState(false);

  /*
  States to create a new Chronology which changes with the text boxes
  */
  const [newChronologyName, setNewChronologyName] = useState('');
  const [newChronologyDate, setNewChronologyDate] = useState('');

  return (
    <>
    {
      reports != null ?
    <>
      <StatusBar backgroundColor="#2b2b2b"></StatusBar>
      <AppBar leading={props => (<IconButton icon={props => <Icon name="menu" {...props} />} {...props} />)}

        /*
          Temporarily set the name of the current report to Report 0
          TODO: Change to adjust to current actual Report
        */
        trailing={props => (<IconButton icon={props => <Icon name="download" {...props} />} {...props} onPress={() => { Alert.alert("Download Report") }} />)}
        // title={reports[0].name}
        color="#2b2b2b" />
      <ScrollView>
        {
          // reports.map((u, i) => {
          //   return (
          //     <Report key={i} report={u}>
          //     </Report>
          //   );
          // })

          reports.result.map((v, i) => {return(<Text>{v.created_at}</Text>)})
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
    </> : <Text>No reports</Text>
            }
            </>
  );
}

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
export default MainReport;