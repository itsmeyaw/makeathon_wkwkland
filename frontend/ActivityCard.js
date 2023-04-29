import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';

const ActivityCard = ({ activity }) => {
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
                    activity.file &&
                    <Card.Image source={{uri:activity.file}}></Card.Image>
                }
            </Card>
        </>
    );
};

export default ActivityCard;