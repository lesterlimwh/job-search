import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

const PUSH_ENDPOINT = 'http://rallycoding.herokuapp.com/api/tokens';

export default async () => {
	// check if we have a token in AsyncStorage
	let previousToken = await AsyncStorage.getItem('pushtoken');
	console.log(previousToken);
	if (previousToken) {
		// user already gave us permission
		return;
	}
	
	// prompt user for permission
	let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
	if (status !== 'granted') {
		// user does not give permission for push notifications
		return;
	}

	// generate push token for a particular user's device
	let token = await Notifications.getExponentPushTokenAsync();

	// send token to our backend server
	await axios.post(PUSH_ENDPOINT, { token: { token } });

	// save token to AsyncStorage as well
	AsyncStorage.setItem('pushtoken', token);
};
