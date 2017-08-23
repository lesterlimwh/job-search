import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import {
	LIKE_JOB,
	CLEAR_LIKED_JOBS
} from '../actions/types';

export default function (state = [], action) {
	switch (action.type) {
		case REHYDRATE:
			// watch for autoRehydrate to persist data
			return action.payload.likedJobs || [];
		case LIKE_JOB:
			// only like it if it is not already in the list of jobs
			return _.uniqBy([
				action.payload, ...state
			], 'jobkey');
		case CLEAR_LIKED_JOBS:
			// overwrite state with an empty array
			// which effectively blows away all liked jobs
			return [];
		default:
			return state;
	}
}
