import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import GradiantScreen from './../GradiantScreen';
import Input from './../../components/Input';
import Button from './../../components/Button';
import { NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import Service from './../../services/http';
import mapper from './../../images/imageMapper';

function Login(props) {
	const [credential, setCredential] = useState({});
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);

	function handleChange(key, value) {
		setCredential({ ...credential, [key]: value });
	}

	function handleCreateAccount() {
		const { navigation } = props;
		navigation.reset([NavigationActions.navigate({ routeName: 'Registration' })], 0);
	}

	function handleForgotPassword() {
		const { navigation } = props;
		navigation.reset([NavigationActions.navigate({ routeName: 'ForgotPassword' })], 0);
	}

	async function setLoginDetails(data) {
		try {
			const user = { ...data };
			await AsyncStorage.setItem('user', JSON.stringify(user));
			if(remember) {
				await AsyncStorage.setItem('isLoggedIn', 'true');
				await AsyncStorage.setItem('remember', `${remember}`);
			}
		} catch(e) {
			console.log('save err', e);
		}
	}

	function handleLogin() {
		const { navigation } = props;
		const service = new Service();
		setLoading(true);
		service.post('DeliveryBoyLoginAPI', credential).then(async res => {
			setLoading(false);
			if(res.Status == 0) {
				Alert.alert("Error", res.Body);
			} else {
				console.log('login', res.Body);
				await setLoginDetails(res.Body);
				navigation.reset([NavigationActions.navigate({ routeName: 'MapView' })], 0);
			}
		});
	}

	function handleRemember() {
		setRemember(!remember);
	}

	return (
		<GradiantScreen>
			{
				loading &&
				<View style={styles.loaderWrapper}>
					<ActivityIndicator style={styles.loader} size="large" />
				</View>
			}
			<View style={styles.container}>
				<View style={styles.pageTitleWrapper}>
					<Text style={styles.pageTitle}>Login</Text>
				</View>
				<View style={styles.fieldContainer}>
					<Input 
						value={credential.email || ''}
						onChange={(val) => handleChange('email', val)}
						placeholder={"email"}
						iconImageName="profile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input 
						value={credential.password || ''}
						onChange={(val) => handleChange('password', val)}
						placeholder={"Password"}
						secureTextEntry={true}
						iconImageName="lock"
					/>
				</View>
				<View style={[styles.fieldContainer, styles.loginOptionals]}>
					<TouchableOpacity style={styles.rememberContainer} onPress={handleRemember} activeOpacity={1}>
						{
							remember ?
							<Image source={mapper.checkbox.source} style={styles.rememberIcon} />
							:
							<Image source={mapper.uncheckbox.source} style={styles.rememberIcon} />
						}
						<Text style={styles.textColor}>Remember me</Text>
					</TouchableOpacity>
					<View>
						<TouchableOpacity onPress={handleForgotPassword}>
							<Text style={styles.textColor}>Forgot password?</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[styles.fieldContainer, styles.loginButton]}>
					<Button label="Login" onClick={handleLogin} />
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
		position: 'relative',
	},
	fieldContainer: {
		paddingBottom: 15,
	},
	textColor: {
		color: '#fff',
	},
	loginOptionals: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 5,
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
		marginTop: 25,
		zIndex: 1,
	},
	loaderWrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		bottom: 0,
		backgroundColor: '#fff',
		opacity: 0.4,
		zIndex: 999,
	},
	loader: {
		marginTop: '80%',
	},
	rememberContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	rememberIcon: {
		width: 15,
		height: 15,
		marginRight: 10,
		marginTop: 2,
		tintColor: '#545454'
	}
}

export default Login;
