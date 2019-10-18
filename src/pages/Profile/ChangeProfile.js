import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import Page from './../Page';
import Input from './../../components/Input';
import Button from './../../components/Button';
import Service from './../../services/http';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';


function ChangeProfile(props) {
	const [registerData, setRegisterData] = useState({});
	const [screen, setScreen] = useState(1);

	useEffect(() => {
		try {
			AsyncStorage.getItem('user').then((data) => {
				console.log(data);
				const record = JSON.parse(data);
				if(record) {
					setRegisterData(record);
				}
			});
		} catch(err) {
			console.log('err', err);
		}
	}, []);

	function changeScreen(number) {
		setScreen(number);
	}

	function handleChange(key, value) {
		setRegisterData({ ...registerData, [key]: value });
	}

	function gotoNominee() {
		changeScreen(2);
	}

	function gotoProfile() {
		changeScreen(1);
	}

	function logout() {
		Alert.alert('Logout', 'Are you sure? Want to logout?', [
			{text: 'Yes', onPress: () => doLogout()},
			{text: 'No'}
		])
	}
	
	function doLogout() {
		const { navigation } = props;
		navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0);
		AsyncStorage.removeItem('isLoggedIn');
	}

	function handleClick() {
		const service = new Service();
		service.post('CustomerEditProfile', registerData).then((res) => {
			console.log('res', res);
			if(res.Status === '1') {
				Alert.alert("Profile Update", res.Body);
				AsyncStorage.setItem('user', JSON.stringify(registerData));
			} else {
				Alert.alert('Error', 'Something going wrong, Please try again later');
				console.log('err', res);
			}
		});
	}

	function renderScreen2() {
		return (
			<React.Fragment>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.lunchAddress || ''}
						onChange={(val) => handleChange('lunchAddress', val)}
						placeholder={"Address for Lunch"}
						iconImageName="placeholder"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.dinnerAddress || ''}
						onChange={(val) => handleChange('dinnerAddress', val)}
						placeholder={"Email"}
						iconImageName="placeholder"

					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.breakfastAddress || ''}
						onChange={(val) => handleChange('breakFastaddress', val)}
						placeholder={"Password"}
						iconImageName="placeholder"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.teaAddress || ''}
						onChange={(val) => handleChange('teaAddress', val)}
						placeholder={"Password"}
						iconImageName="placeholder"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.firstNomineename || ''}
						onChange={(val) => handleChange('firstNomineename', val)}
						placeholder={"Password"}
						iconImageName="profile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.firstNomineemobile || ''}
						onChange={(val) => handleChange('firstNomineemobile', val)}
						placeholder={"Mobile No."}
						iconImageName="mobile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.secondNomineename || ''}
						onChange={(val) => handleChange('secondNomineename', val)}
						placeholder={"Password"}
						iconImageName="profile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.secondNomineemobile || ''}
						onChange={(val) => handleChange('secondNomineemobile', val)}
						placeholder={"Mobile No."}
						iconImageName="mobile"
					/>
				</View>
			</React.Fragment>
		)
	}


	function renderScreen1() {
		return (
			<React.Fragment>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.customerName || ''}
						onChange={(val) => handleChange('customerName', val)}
						placeholder={"User"}
						iconImageName="profile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.password || ''}
						onChange={(val) => handleChange('password', val)}
						placeholder={"Password"}
						iconImageName="lock"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.mobile || ''}
						onChange={(val) => handleChange('mobile', val)}
						placeholder={"Mobile No."}
						iconImageName="mobile"
					/>
				</View>
			</React.Fragment>
		)
	}

	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.container}>
					<TouchableOpacity onPress={logout} style={styles.logoutButton}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
					<View style={styles.pageTitleWrapper}>
						<Text style={styles.pageTitle}>Edit Profile</Text>
					</View>
					{
						screen === 1 &&
							<View style={styles.nomineeLinkWrapper}>
								<Text style={styles.nomineeTitleText}>Want to change address/nominee?</Text>
								<TouchableOpacity onPress={gotoNominee}>
									<Text style={styles.nomineeLinkText}>Change</Text>
								</TouchableOpacity>
							</View>
					}
					{
						screen === 2 &&
							<View style={styles.nomineeLinkWrapper}>
								<Text style={styles.nomineeTitleText}>Want to change contact details?</Text>
								<TouchableOpacity onPress={gotoProfile}>
									<Text style={styles.nomineeLinkText}>Change</Text>
								</TouchableOpacity>
							</View>
					}
					{screen === 1 ? renderScreen1() : renderScreen2()}
					<View style={[styles.fieldContainer, styles.loginButton]}>
						<Button label="SUBMIT" onClick={handleClick} />
					</View>
				</View>
			</ScrollView>
		</Page>
	)
}

const styles = {
	container: {
		marginLeft: 30,
		marginRight: 30,
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
	},
	nomineeLinkWrapper: {
		display: 'flex',
		flexDirection: 'row',
	},
	nomineeTitleText: {
		padding: 5,
	},
	nomineeLinkText: {
		color: 'red',
		padding: 5,
	},
	logoutButton: {
		alignSelf: 'flex-end',
		marginTop: 10,
	},
	logoutText: {
		fontWeight: 'bold',
		fontSize: 15,
		color: 'red',
	}
}

ChangeProfile.navigationOptions = {
	header: null,
};

export default ChangeProfile;
