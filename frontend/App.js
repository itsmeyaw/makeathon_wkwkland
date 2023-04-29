import React from 'react';
import { Text, ScrollView, StatusBar } from 'react-native';
import { AppBar, IconButton } from "@react-native-material/core";
import { Card } from 'react-native-elements'
import Report from "./Report.js"
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FAB } from 'react-native-paper';

const rows = [];
const numrows = 100;
for (let i = 0; i < numrows; i++) {
  rows.push(<Text>{i}</Text>);
}

const users = [
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

const chronology = [
  {
    id: 1,
    name: 'running',
  },
  {
    id: 2,
    name: 'walking',
  },
  {
    id: 3,
    name: 'swimming',
  },
  {
    id: 4,
    name: 'cycling',
  },
  {
    id: 5,
    name: 'hiking',
  },
  {
    id: 6,
    name: 'yoga',
  },
  {
    id: 7,
    name: 'strength training',
  },
  {
    id: 8,
    name: 'dancing',
  },
  {
    id: 9,
    name: 'pilates',
  },
  {
    id: 10,
    name: 'boxing',
  },
];

const reports = [{
  "name": "TUMAI",
  "UUID": "8927302341934",
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

const title = 'Chronology of Report';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor="#2b2b2b"></StatusBar>
      <AppBar leading={props => (
        <IconButton icon={props => <Icon name="menu" {...props} />} {...props} />
      )}
        title={reports[0].name} color="#2b2b2b" />
      <ScrollView>
        <Text style={{textAlign: 'center', padding: 30, fontSize: 20}}>What activities did you have today?</Text>
        {/* <View>
          <Text>Let's do some reporting, meow!</Text>
          <Image
            source={{
              uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
            }}
            style={{ width: 200, height: 200 }}
          />
        </View>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          defaultValue="I don't do much yet"
        /> */}
        {/* <View>
          {rows}
        </View> */}
        {/* {
          users.map((u,i) => {
            return(<>
            <Card>
          <Card.Title>{u.name}</Card.Title>
          <Card.Divider />
          <Card.Image source={require('./assets/favicon.png')} />
          <Text style={{ marginBottom: 10 }}>
            This is a brief description of a chrono.
          </Text>
          <Button
            icon={<Icon name='code' color='#ffffff' />}
            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            title='VIEW NOW' />
        </Card>
            </>);
          })
        } */}
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
            End of chronology
            </Text>
          </Card>
      </ScrollView>
      <AppBar
        variant="bottom"
        style={{ position: "absolute", start: 0, end: 0, bottom: 0 }}
        transparent='false'>
        <FAB
          icon={props => <Icon name="plus" {...props} />}
          style={{ position: "absolute", top: -10, alignSelf: "center" }}
          onPress={()=>{console.log("Add Hack")}}
        />
      </AppBar>
    </>
  );
};

export default App;