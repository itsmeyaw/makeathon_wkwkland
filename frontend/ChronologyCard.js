import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { Button } from '@react-native-material/core';
import ActivityCard from "./ActivityCard";
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import uuid from 'react-native-uuid';

const ChronologyCard = ({ chronology }) => {

    const [expanded, setExpanded] = useState(false);

    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState(null);

    const pickImage = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
            copyToCacheDirectory: false,
        });
        if (!result.cancelled) {
            const newActivity = {
                order_number: 2023,
                name: result.name,
                UUID: uuid.v4(),
                file: result.uri,
            };
            const newActivities = [...chronology.activities, newActivity];
            chronology.activities = newActivities;
            console.log(newActivities);
            setImage(result.uri);
            setImageName(result.name);
        }
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card>
                <Card.Image source={require('./assets/favicon.png')} />
                <Text style={{ fontSize: 22 }}>{chronology.name}</Text>
                <Text style={{ fontSize: 10 }}>{chronology.time}</Text>
                <Text style={{ marginBottom: 10 }}>
                    {chronology.UUID}
                </Text>
                {expanded && (
                    <View>
                        {
                            chronology.activities.map((activity, i) => (
                                <ActivityCard activity={activity} key={i}></ActivityCard>
                            ))
                        }
                        <Card wrapperStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Button buttonStyle={{ borderRadius: 0, marginLeft: 5, marginRight: 5, marginBottom: 0 }}
                                title={'Text'} onPress={() => { }} />
                            <Button buttonStyle={{ borderRadius: 0, marginLeft: 5, marginRight: 5, marginBottom: 0 }}
                                title={'Voice'} onPress={() => { }} />
                            <Button buttonStyle={{ borderRadius: 0, marginLeft: 5, marginRight: 5, marginBottom: 0 }}
                                title={'Image'} onPress={pickImage} />
                        </Card>
                        <Button
                            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                            title={'DELETE!'}
                            titleStyle={{ color: 'white' }}
                            color="red"
                            style={{ margin: 10, marginBottom: 5 }}
                            onPress={() => { }} />
                    </View>
                )}
                <Button
                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title={expanded ? 'HIDE!' : 'VIEW!'}
                    onPress={toggleExpanded}
                    style={{ margin: 10, marginTop: 5 }}
                />
            </Card>
        </>
    );
}

export default ChronologyCard;