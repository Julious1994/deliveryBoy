import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import GradiantScreen from './../GradiantScreen';
import Input from './../../components/Input';
import Button from './../../components/Button';
import Service from './../../services/http';

const service = new Service();

function Login(props) {
	const [email, setEmail] = useState('');

	function handleEmailChange(value) {
		setEmail(value);
	}

	function handleLogin() {
		const { navigation } = props;
		navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0);
	}
	function handleSubmit() {
		service.post('CustomerForgotPassword', { email }).then(res => {
			console.log('res', res);
			if (res.Status === '1') {
				Alert.alert("Success", res.Body, [{
					text: 'OK', onPress: () => {
						handleLogin();
					}
				}]);
			} else {
				Alert.alert("Success", res.Body);
			}
		})
	}

	return (
		<GradiantScreen>
			<View style={styles.container}>
				<View style={styles.pageTitleWrapper}>
					<Text style={styles.pageTitle}>Forgot Password</Text>
				</View>
				<View style={[styles.fieldContainer, styles.registerLinkWrapper]}>
					<Text style={styles.registerTitleText}>I know my password!</Text>
					<TouchableOpacity onPress={handleLogin}>
						<Text style={styles.registerLinkText}>Login</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.reserMessageView}>
					<Text style={styles.resetMessage}>Please enter your email we will sent you reset password link</Text>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={email || ''}
						onChange={handleEmailChange}
						placeholder={"Enter email"}
						iconImageName="envelope"
					/>
				</View>
				<View style={[styles.fieldContainer, styles.loginButton]}>
					<Button label="SUBMIT" onClick={handleSubmit} />
				</View>
			</View>
		</GradiantScreen>
	)
}

Login.navigationOptions = {
	header: null,
}

const styles = {
	container: {
		marginLeft: 30,
		marginRight: 30,
	},
	fieldContainer: {
		paddingBottom: 15,
	},
	reserMessageView: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 25,
		marginBottom: 25
	},
	resetMessage: {
		color: '#fff',
	},
	pageTitle: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#fff',
	},
	pageTitleWrapper: {
		marginTop: 100
	},
	registerLinkWrapper: {
		display: 'flex',
		flexDirection: 'row',
	},
	registerTitleText: {
		padding: 5,
	},
	registerLinkText: {
		color: 'red',
		padding: 5,
	},
	loginButton: {
		marginTop: 50,
	}
}

export default Login;
