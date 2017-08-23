import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

const store = createStore(
	reducers,
	{},
	compose(
		// thunk gives Action Creators access to dispatch
		applyMiddleware(thunk),
		// autoRehydrate is a store enhancer NOT a middleware
		// pulls our data out of AsyncStorage and sends it to all reducers
		autoRehydrate()
	)
);

// watches for any change in data in store, and saves it into AsyncStorage
// whitelist contains the application-level state that we want to save
// in reducers/index.js we have a likedJobs state
persistStore(store, { storage: AsyncStorage, whitelist: ['likedJobs'] });
//persistStore(store, { storage: AsyncStorage, whitelist: ['likedJobs'] }).purge();

export default store;
