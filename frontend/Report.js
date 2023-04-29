import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import ChronologyCard from "./ChronologyCard"

const Report = ({ report }) => {
    return (
        <>
            {
                report.chronologies.map((u, i)=>{
                    return(
                            <ChronologyCard key={i} chronology={u}>
                            </ChronologyCard>
                    );
                })
            }
        </>
    );
}

export default Report;