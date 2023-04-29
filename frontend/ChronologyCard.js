import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { Button} from '@react-native-material/core';
import ActivityCard from "./ActivityCard";

const ChronologyCard = ({ chronology }) => {

    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card>
                <Card.Title>{chronology.name}</Card.Title>
                <Text>{chronology.date}</Text>
                <Card.Divider />
                <Card.Image source={require('./assets/favicon.png')} />
                <Text style={{ marginBottom: 10 }}>
                    This is a brief description of a chrono.
                </Text>
                {expanded && (
                    <View>
                        {chronology.activities.map((activity, i) => (
                            <ActivityCard activity={activity} key={i}></ActivityCard>
                        ))}
                        <>
                        <Card wrapperStyle={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Button buttonStyle={{ borderRadius: 0, marginLeft: 5, marginRight: 5, marginBottom: 0 }}
                            title={'Text'}/>
                            <Button buttonStyle={{ borderRadius: 0, marginLeft: 5, marginRight: 5, marginBottom: 0 }}
                            title={'Voice'}/>
                            <Button buttonStyle={{ borderRadius: 0, marginLeft: 5, marginRight: 5, marginBottom: 0  }}
                            title={'Image'}/>
                        </Card>
                        </>
                    </View>
                )}
                    <Button
                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                        title={expanded ? 'HIDE DETAILS' : 'VIEW DETAILS'}
                        onPress={toggleExpanded}
                    />
            </Card>
        </>
    );
}

export default ChronologyCard;