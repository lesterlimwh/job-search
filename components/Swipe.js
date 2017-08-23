import React, { Component } from 'react';
import { 
	View, 
	Animated, 
	PanResponder,
	Dimensions,
	LayoutAnimation,
	UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;


// Swipe expects the following props to be passed in when called
// keyProp, data, renderCard(), renderNoMoreCards(), onSwipeLeft(), onSwipeRight()
class Swipe extends Component {
	static defaultProps = {
		// if user did not pass in onSwipeRight or onSwipeLeft via props
		// do not show error message
		onSwipeRight: () => {},
		onSwipeLeft: () => {},
		keyProp: 'id'
	}

	constructor(props) {
		super(props);

		// position is an object with structure { x: 0, y: 0 }
		const position = new Animated.ValueXY();

		// onStartShouldSetPanResponder is executed anytime a user taps on screen
		// returns true means this instance of PanResponder will be responsible
		// for handling the gesture
		// onPanResponderMove is a callback that calls anytime the user drags finger
		// over the screen and will be called many times as long as user drags finger
		// onPanResponderRelease is a callback that calls when user stops dragging finger
		const panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gesture) => {
				// update the position based on position of user's finger
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			onPanResponderRelease: (event, gesture) => {
				if (gesture.dx > SWIPE_THRESHOLD) {
					// force card off screen to the right
					this.forceSwipe('right');
				} else if (gesture.dx < -SWIPE_THRESHOLD) {
					// force card off screen to the left
					this.forceSwipe('left');
				} else {
					this.resetPosition();
				}
			}
		});

		// we should be using this.panResponder = panResponder;
		// but official documentations use this.state so we follow conventions
		// index is the current item to be swiped
		this.state = { panResponder, position, index: 0 };
	}

	componentWillReceiveProps(nextProps) {
		// called when component re-rendered with new set of props
		if (nextProps.data !== this.props.data) {
			// reset index if new set of data is passed in
			this.setState({ index: 0 });
		}
	}

	componentWillUpdate() {
		// Android compatibility 
		UIManager.setLayoutAnimationEnabledExperimental 
		&& UIManager.setLayoutAnimationEnabledExperimental(true);
		// every time components get re-rendered, animate any change in positioning
		LayoutAnimation.spring();
	}

	getCardStyle() {
		const { position } = this.state;
		// set relationship between how much the card moved in the x direction and rotation
		const rotate = position.x.interpolate({
			inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
			outputRange: ['-120deg', '0deg', '120deg']
		});

		// getLayout returns an object that specifies how the card should
		// be positioned in the XY direction
		return {
			...position.getLayout(),
			transform: [{ rotate }]
		};
	}

	// call this when user lets go of the card without swiping
	// to reset the card back to its original position
	resetPosition() {
		Animated.spring(this.state.position, {
			toValue: { x: 0, y: 0 }
		}).start();
	}

	// call this when user drags card far enough to the left/right
	// to force the card off and consider it swiped
	forceSwipe(direction) {
		const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
		Animated.timing(this.state.position, {
			toValue: { x, y: 0 },
			duration: SWIPE_OUT_DURATION
		}).start(() => {
			// callback function after SWIPE_OUT_DURATION
			this.onSwipeComplete(direction);
		});
	}

	// call onSwipeLeft or onSwipeRight provided by props
	// with the current card depending on the swiped direction
	onSwipeComplete(direction) {
		const { onSwipeLeft, onSwipeRight, data } = this.props;
		const item = data[this.state.index];

		direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
		// reset the position otherwise the next incoming card will be off screen
		this.state.position.setValue({ x: 0, y: 0 });
		// increment the value of index to point at the next card
		this.setState({ index: this.state.index + 1 });
	}

	// for each item in the data array, return some JSX for each of them
	renderCards() {
		// check if there are no more cards left
		if (this.state.index >= this.props.data.length) {
			return this.props.renderNoMoreCards();
		}

		return this.props.data.map((item, i) => {
			if (i < this.state.index) {
				// this card has already been swiped, ignore
				return null;
			}

			if (i === this.state.index) {
				return (
					<Animated.View
						key={item[this.props.keyProp]}
						style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]} 
						{...this.state.panResponder.panHandlers}
					>
						{this.props.renderCard(item)}
					</Animated.View>
				);
			}

			// i > this.state.index
			// this card needs to be shown in the future, create it but
			// don't give it panhandlers
			return (
				<Animated.View 
					key={item[this.props.keyProp]}
					style={[styles.cardStyle, { top: 10 * (i - this.state.index) }, { zIndex: 5 }]}
				>
					{this.props.renderCard(item)}
				</Animated.View>
			);
		// call .reverse so the first item is on the top of the stack
		// this is a fix for absolute position placing the last card on top
		}).reverse();
	}

	render() {
		return (
			<View>
				{this.renderCards()}
			</View>
		);
	}
}

const styles = {
	cardStyle: {
		position: 'absolute',
		width: SCREEN_WIDTH
	}
};

export default Swipe;
