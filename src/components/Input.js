import React from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import mapper from './../images/imageMapper';

function Input(props) {
	const { value, onChange, icon, placeholder, iconImageName, ...inputProps } = props;
	return (
		<View style={styles.inputWrapper}>
			<TextInput
				value={value}
				onChangeText={onChange}
				placeholder={placeholder}
				placeholderTextColor="#fff"	
				style={[styles.textInput, { height: props.multiline && 'auto'}]}
				{...inputProps}
			/>
			{
				iconImageName && mapper[iconImageName] &&
				<View style={styles.iconView}>
					<Image style={styles.iconImage} source={mapper[iconImageName].source} />
				</View>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	textInput: {
		height: 40,
		paddingBottom: 2,
		color: '#fff',
		width: '93%'
	},
	inputWrapper: {
		borderBottomColor: 'white',
		borderBottomWidth: 1,
		position: 'relative'
	},
	iconView: {
		position: 'absolute',
		top: 10,
		right: 0,
	},
	iconImage: {
		width: 20,
		height: 20,
		tintColor: '#fff',
	},
})

export default Input;
