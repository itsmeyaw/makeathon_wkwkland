import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Styles, StyleSheet, TextInput, Pressable, Alert, LayoutAnimation, UIManager } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { Button } from '@react-native-material/core';
import ActivityCard from "./ActivityCard";
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import uuid from 'react-native-uuid';
import { APIroot } from './Global';

const ChronologyCard = ({ chronology, reportId }) => {

    const [expanded, setExpanded] = useState(false);

    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState(null);

    const [audio, setAudio] = useState(null);
    const [audioName, setAudioName] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    const [newActivityName, setNewActivityName] = useState('');

    const [documents, setDocuments] = useState()
    const [docsLoaded, setDocsLoaded] = useState(false)

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
                image: result.uri,
            };
            const newActivities = [...chronology.activities, newActivity];
            chronology.activities = newActivities;
            console.log(newActivities);
            setImage(result.uri);
            setImageName(result.name);
        }
    };

    const pickAudio = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'audio/*',
            copyToCacheDirectory: false,
        });
        if (!result.cancelled) {
            const newActivity = {
                order_number: 2023,
                name: result.name,
                UUID: uuid.v4(),
                audio: result.uri,
            };
            const newActivities = [...chronology.activities, newActivity];
            chronology.activities = newActivities;
            console.log(newActivities);
            setAudio(result.uri);
            setAudioName(result.name);
        }
    };

    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

    useEffect(() => {
        if (chronology != null && expanded == true) {
            const fetchData = (endpointStr) => {
                fetch(APIroot + endpointStr)
                    .then(response => response.json())
                    .then(data => {
                        setDocuments(data);
                        console.log("::ENDPOINT::" + endpointStr)
                        console.log(data);
                        setDocsLoaded(true)
                    })
            };

            fetchData('/reports/' + reportId + '/activities/' + chronology.id + '/documents');
        }
    }, [chronology, expanded])

    return (
        <>
            <Card>
                {/* <Card.Image source={require('./assets/favicon.png')} /> */}
                <Text style={{ fontSize: 22 }}>{chronology.activity_name}</Text>
                <Text style={{ fontSize: 10 }}>{chronology.date}</Text>
                <Text style={{ fontSize: 10 }}>{chronology.language}</Text>
                <Text style={{ marginBottom: 10 }}>
                    {chronology.id}
                </Text>
                {expanded && (
                    <View>
                        {
                            docsLoaded && 
                            documents.result.map((u,i)=>{<ActivityCard key={i} activity={u}></ActivityCard>})

                            // (docsLoaded == true) && (documents) ?
                            //     documents.map((doc, i) => {
                            //         <ActivityCard activity={doc} key={i}></ActivityCard>
                            //     }) : null
                            // chronology.activities.map((activity, i) => (
                            //     <ActivityCard activity={activity} key={i}></ActivityCard>
                            // // ))
                            // documents &&
                            // documents.map((doc, i)=>{
                            //     <ActivityCard activity={doc} key={i}></ActivityCard>
                            // })
                        }
                        <Card wrapperStyle={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <Button style={{ margin: 10 }}
                                title={'Text!'} onPress={() => { setModalVisible(true) }} />
                            <Button style={{ margin: 10 }}
                                title={'Voice'} onPress={pickAudio} />
                            <Button style={{ margin: 10 }}
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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>New Activity</Text>
                            <Text>Activity Name</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(i) => { console.log("name input:" + i); setNewActivityName(i); }}
                                placeholder={'e.g. "Get some pizza" '}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    const activityToAdd =
                                        { "name": newActivityName, "UUID": uuid.v4() }
                                    console.log(activityToAdd)

                                    /*
                                    Currently only adds to Report 0
                                    */
                                    chronology.activities.push(activityToAdd)

                                    Alert.alert("Activity added"); setModalVisible(!modalVisible);
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

            </Card>
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

export default ChronologyCard;