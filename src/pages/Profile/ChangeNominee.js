import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Page from './../Page';
import Input from './../../components/Input';
import Button from './../../components/Button';
import { NavigationActions } from 'react-navigation'

function ChangeNominee(props) {
	const [registerData, setRegisterData] = useState({});
	const [screen, setScreen] = useState(1);

	useEffect(() => {
		try {
			AsyncStorage.getItem('user').then((data) => {
				console.log(data);
				setRegisterData(JSON.parse(data));
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

	function handleClick() {
		// if(screen === 1) {
		// 	changeScreen(2);
		// } else {
		// 	console.log('register data', registerData);
		// }
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


	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.pageTitleWrapper}>
						<Text style={styles.pageTitle}>Change Address and Nominee Details</Text>
					</View>
					{renderScreen2()}
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
		marginTop: 100,
		marginBottom: 25
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
	}
}

ChangeNominee.navigationOptions = {
	header: null,
};

export default ChangeNominee;
