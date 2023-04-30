import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import ChronologyCard from "./ChronologyCard"

const Report = ({ report, reportId }) => {
    return (
        <>
            {
                report &&
                (
                    <ChronologyCard chronology={report} reportId={reportId}>
                    </ChronologyCard>
                )
            }
        </>
    );
}

export default Report;