// AsyncStorage is like browser local storage KVP
// AsyncStorage.setItem('fb_token', token);
// AsyncStorage.getItem('fb_token');
import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';
import {
	FACEBOOK_LOGIN_SUCCESS,
	FACEBOOK_LOGIN_FAIL,
} from './types';
import { FACEBOOK_TOKEN } from './tokens';

export const facebookLogin = () => async dispatch => {
	let token = await AsyncStorage.getItem('fb_token');
	if (token) {
		// Dispatch an action saying FB Login is done
		dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
	} else {
		// Start up FB Login process
		doFacebookLogin(dispatch);
	}
};

// helper function to handle FB Login process logic
const doFacebookLogin = async dispatch => {
	let { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_TOKEN, {
		permissions: ['public_profile']
	});
	
	if (type === 'cancel') {
		return dispatch({ type: FACEBOOK_LOGIN_FAIL });
	}

	await AsyncStorage.setItem('fb_token', token);
	dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
};
