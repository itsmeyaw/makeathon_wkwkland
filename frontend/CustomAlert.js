import React from 'react';
import { View, Modal, Image, Text, TouchableOpacity } from 'react-native';

const CustomAlert = ({ visible, onClose, imageSource, message }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 0,
            alignItems: 'center',
          }}>
          <Image
            source={imageSource}
            style={{ width: 300, height: 300, marginBottom: 0 }}
          />
          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                margin: 10,
                color: 'blue',
              }}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;