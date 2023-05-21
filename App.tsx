import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Button, ActivityIndicator, StatusBar, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';

import OneSignal from 'react-native-onesignal';

// OneSignal Initialization
OneSignal.setAppId('1ab33eb7-d6a4-49f6-ad9e-44f65aead8fd');

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("notification: ", notification);
  const data = notification.additionalData
  console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
});

const Loading = () => <ActivityIndicator
	style={[styles.container, styles.loading]}
	color="green"
	size="large"
/>

const Stack = createStackNavigator();

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const delay = 3000;

    const timeout = setTimeout(() => {
      navigation.replace('Home');
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./splash.png')} style={styles.image} />
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const webviewref = useRef(null);
	const [canGoBack, setCanGoBack] = useState(false);
	const [currentUrl, setCurrentUrl] = useState('https://bradabagus.com/');

	const backAction = () => {
		if(canGoBack){
			webviewref.current.goBack();
			console.log("kembali");
		}else {
			// navigation.navigate('Home')
			// navigation.goBack();
			console.log("gabisa kembali");
		}
		
		return true;
	}
	
	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backAction);
		
		() => BackHandler.removeEventListener("hardwareBackPress", backAction);
	}, [canGoBack])
  	
	return (
    <View style={{ flex: 1 }}>
      		<StatusBar barStyle='dark-content' backgroundColor={'#FFFFFF'}/>
			<WebView 
				ref={webviewref}
				source={{ uri: currentUrl }} 
				startInLoadingState
				renderLoading={Loading}
				onNavigationStateChange={navState => {
					setCanGoBack(navState.canGoBack);
					setCurrentUrl(navState.url);
				}}
			/>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loading : {
	position: 'absolute',
	width: '100%',
	height: '100%'
}
});

export default App;
