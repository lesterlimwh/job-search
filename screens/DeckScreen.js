import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { MapView } from 'expo';
import { Card, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Swipe from '../components/Swipe';
import * as actions from '../actions';

class DeckScreen extends Component {
	// when this Navigator is being rendered, react-navigation will look
	// for navigationOptions and apply these class-level properties
	// note: class-level properties cannot refer to this.props.navigation
	// which is why we have to destructure navigation as a param
	static navigationOptions = () => ({
		title: 'Jobs',
		tabBarIcon: ({ tintColor }) => {
			return <Icon name='description' size={30} color={tintColor} />;
		}
	})

	renderCard(job) {
		const initialRegion = {
			longitude: job.longitude,
			latitude: job.latitude,
			longitudeDelta: 0.02,
			latitudeDelta: 0.045,
		};

		return (
			<Card title={job.jobtitle}>
				<View style={{ height: 200 }}>
					<MapView
						scrollEnabled={false}
						style={{ flex: 1 }}
						cacheEnabled={Platform.OS === 'android'}
						initialRegion={initialRegion}
					/>
				</View>

				<View style={styles.detailWrapper}>
					<Text>{job.company}</Text>
					<Text>{job.formattedRelativeTime}</Text>
				</View>

				<Text>
					{job.snippet.replace(/<\/*b>/g, '')}
				</Text>
			</Card>
		);
	}

	renderNoMoreCards = () => {
		return (
			<Card title='No More Jobs'>
				<Button
					large
					title='Back To Map'
					icon={{ name: 'my-location' }}
					backgroundColor='#03A9F4'
					onPress={() => this.props.navigation.navigate('map')}
				/>
			</Card>
		);
	}

	render() {
		return (
			<View>
				<Swipe
					keyProp='jobkey'
					data={this.props.jobs}
					renderCard={this.renderCard}
					renderNoMoreCards={this.renderNoMoreCards}
					onSwipeRight={job => this.props.likeJob(job)}
				/>
			</View>
		);
	}
}

const styles = {
	detailWrapper: {
		marginBottom: 10,
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
};

function mapStateToProps({ jobs }) {
	return { jobs: jobs.results };
}

export default connect(mapStateToProps, actions)(DeckScreen);
