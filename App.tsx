import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, Button, View } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { urlRootNode } from './src/services/api';

export default function App() {

  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  const [message, setMessage] = useState({
    to: token,
    title: "OSNET",
    body: "Uma nova OS chegou para você",
    data: {}
  });

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      messaging().getToken().then(token => {
        setToken(token);
        console.log(token)
      })
    }
  }

  const registryToken = async () => {
    let reqs = await fetch(urlRootNode + 'createToken', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        token: token,
      })
    });
    let ress = await reqs.json();
    console.log(ress);
  }

  const sendMessage = async () => {
    let reqs = await fetch(urlRootNode + "send", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notification: message,
        token: token,
      })
    });
    let ress = await reqs.json();
    console.log(ress);
  }

  useEffect(() => {
    requestUserPermission();

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Teste de notificação</Text>
      <Text>Diga o seu nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder='Insira seu nome' />
      <TextInput
        value={token}
        onChangeText={setToken}
        style={styles.input}
        placeholder='Insira seu token' />
      <Button title='Enviar' onPress={registryToken} />
      <Button title='Enviar Mensagem' onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  input: {
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
    marginVertical: 10,
  },
});
