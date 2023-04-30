import React from 'react';
import { useState, useEffect } from 'react';
import { Text, ScrollView, StatusBar, Modal, Alert, View, StyleSheet, Pressable } from 'react-native';
import { AppBar, IconButton, TextInput } from "@react-native-material/core";
import { Card } from 'react-native-elements'
import Report from "./Report.js"
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FAB } from 'react-native-paper';
import uuid from 'react-native-uuid';
import MainReport from './MainReport';
import {APIroot} from './Global.js'

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

  const [tmpData, setTmpData] = useState();
  const [reportIds, setReportIds] = useState([]);

  useEffect(() => {
    const fetchData = (endpointStr) => {
      fetch(APIroot+endpointStr)
        .then(response => response.json())
        .then(data => {
          setTmpData(data);
          console.log(endpointStr+':'+data);
        });
    };

    fetchData('/reports');
  }, []);

  useEffect(() => {
    console.log(tmpData)
    if (tmpData) {
      const ids = tmpData.result.map((u, i) => u.id);
      console.log("Ids detected:"+ids)
      setReportIds(ids);
    }
  }, [tmpData]);

  return(
    <MainReport reports={reportIds}>
    </MainReport> 
  )
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