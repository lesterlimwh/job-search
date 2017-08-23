import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

class AuthScreen extends Component {
	componentDidMount() {
		this.props.facebookLogin();
		this.onAuthComplete(this.props);
	}

	componentWillReceiveProps(nextProps) {
		// called when a component is about to be re-rendered
		// nextProps are the props that are changed that caused the re-render
		// call onAuthComplete here to catch a successful user login
		this.onAuthComplete(nextProps); 
	}

	onAuthComplete(props) {
		if (props.token) {
			// Since WelcomeScreen is rendered directly by react-navigation
			// by default it has a prop method called navigation
			this.props.navigation.navigate('map');
		}
	}

	render() {
		return (
			<View />
		);
	}
}

const mapStateToProps = ({ auth }) => {
	return { token: auth.token };
};

export default connect(mapStateToProps, actions)(AuthScreen);
