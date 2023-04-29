import React from 'react';
import { View, Modal, Image, Text, TouchableOpacity } from 'react-native';

const CustomAlert = ({ visible, onClose, imageSource, message }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}>
          <Image
            source={imageSource}
            style={{ width: 300, height: 200, marginBottom: 0 }}
          />
          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 16,
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