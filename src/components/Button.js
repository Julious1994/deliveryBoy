import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GradiantScreen from '../pages/GradiantScreen';

function Button(props) {
	const { label, onClick, ...inputProps } = props;
	return (
		<GradiantScreen
				colors={['#efd4f5', '#edd4f5', '#ecd4f5']}
				style={styles.borderWrapper}
		>
		<TouchableOpacity style={{ width: '100%'}} onPress={onClick} activeOpacity={0.8}>
			{/* <View style={styles.buttonWrapper}> */}
				<GradiantScreen style={styles.buttonWrapper} colors={["#f29782", "#f2847e","#f2777c"]}>
					<Text style={styles.buttonText}>{label}</Text>
				</GradiantScreen>
			{/* </View> */}
		</TouchableOpacity>
		</GradiantScreen>
	)
}

const styles = StyleSheet.create({
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	borderWrapper: {
		borderRadius: 25, 
		height: 'auto', 
		padding: 2, 
		width: 150, 
		alignItems: 'center', 
		justifyContent: 'center',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 3,
		alignSelf: 'center',
	},
	buttonWrapper: {
		width: '100%',
		borderRadius: 25,
		position: 'relative',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
		alignItems: 'center',
		alignSelf: 'center',
		height: 'auto',
	},
	iconView: {
		position: 'absolute',
	}
})

export default Button;
