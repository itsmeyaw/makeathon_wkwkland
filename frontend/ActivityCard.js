import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
            </Card>
        </>
    );
};

export default ActivityCard;