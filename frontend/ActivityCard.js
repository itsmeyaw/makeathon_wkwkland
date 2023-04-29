import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { Audio } from 'expo-av';

const ActivityCard = ({ activity }) => {

    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    async function PlayAudio() {

        if (currentlyPlaying == null) {
            const sound = new Audio.Sound();
            setCurrentlyPlaying(sound);
            await sound.loadAsync({
                uri: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
            });
            await sound.playAsync();
            await sound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isPlaying) {
                    setCurrentlyPlaying(null);
                }
            });
        } else {
            console.log("Audio currently playing, will not add another audio..");
        }
    }


    return (
        <>
            <Card>
                <Card.Title>
                    {activity.name}
                </Card.Title>
                <Text>
                    {activity.UUID}
                </Text>
                {
                    activity.image &&
                    <Card.Image source={{ uri: activity.image }}></Card.Image>
                }
                {
                    activity.audio &&
                    <Button onPress={PlayAudio}></Button>
                }
                
            </Card>
        </>
    );
};

export default ActivityCard;