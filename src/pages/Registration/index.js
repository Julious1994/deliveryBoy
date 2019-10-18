import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Picker, Alert } from 'react-native';
import GradiantScreen from './../GradiantScreen';
import Input from './../../components/Input';
import Button from './../../components/Button';
import mapper from './../../images/imageMapper';
import { NavigationActions } from 'react-navigation';

import Service from './../../services/http';

function Registration(props) {
	const { navigation } = props;
	const service = new Service();
	const [registerData, setRegisterData] = useState({});
	const [screen, setScreen] = useState(1);
	const [plan, setPlan] = useState();

	const [areaList, setAreaList] = useState([]);
	const [area, setArea] = useState({});

	useEffect(() => {
		service.get('AreaList').then(res => {
			console.log('res area', res);
			if(res.Status == 1) {
				setAreaList(res.Body);
			}
		});
	}, []);

	function changeScreen(number) {
		setScreen(number);
	}

	function handleChange(key, value) {
		setRegisterData({ ...registerData, [key]: value });
	}

	function handleClick() {
		if(screen === 1) {
			changeScreen(2);
		} else {
			const planId = plan.planId;
			const object = {...registerData, planId};
			service.post('CreateCustomer', object).then(res => {
				if(res.Status === '1') {
					handleLogin();
				} else {
					Alert.alert("Sign up", "Something going wrong. Please try again later.");
				}
			});
		}
	}

	function handlePlanChange(plan) {
		console.log('reg plan', plan)
		setPlan(plan);
	}

	function handleChoosePlan() {
		navigation.navigate(
			'Plan', 
			{
				handlePlanChange, 
				isNew: true,
				plan,
			},
		);
	}

	function renderScreen2() {
		return (
			<React.Fragment>
				<TouchableOpacity style={styles.planContainer} onPress={handleChoosePlan} activeOpacity={0.8}>
					<GradiantScreen style={styles.planWrapper} colors={["#fbc97f", "#fdc873","#fec568"]}>
						<Text style={styles.planText}>{plan && plan.name ? plan.name : 'Choose Plan'}</Text>
						<Image style={styles.planIcon} source={mapper.down.source} />
					</GradiantScreen>
				</TouchableOpacity>
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
						placeholder={"Address for Dinner"}
						iconImageName="placeholder"

					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.breakFastaddress || ''}
						onChange={(val) => handleChange('breakFastaddress', val)}
						placeholder={"Address for Breakfast"}
						iconImageName="placeholder"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.teaAddress || ''}
						onChange={(val) => handleChange('teaAddress', val)}
						placeholder={"Address for Tea"}
						iconImageName="placeholder"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.firstNomineename || ''}
						onChange={(val) => handleChange('firstNomineename', val)}
						placeholder={"Nominee collecting tiffin"}
						iconImageName="profile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.firstNomineemobile || ''}
						onChange={(val) => handleChange('firstNomineemobile', val)}
						placeholder={"Nominee Mobile"}
						iconImageName="mobile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.secondNomineename || ''}
						onChange={(val) => handleChange('secondNomineename', val)}
						placeholder={"Nominee collecting tiffin"}
						iconImageName="profile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.secondNomineemobile || ''}
						onChange={(val) => handleChange('secondNomineemobile', val)}
						placeholder={"Nominee Mobile"}
						iconImageName="mobile"
					/>
				</View>
				<View style={styles.pickerContainer}>
					<Picker
						style={{ color: '#fff', height: 30, padding: 0, }}
						selectedValue={registerData.areaId || ''}
						onValueChange={(e) => handleChange('areaId', e)}
					>
						<Picker.Item label="Choose Area" value={''} />
						{
							areaList.map((a, index) => (
								<Picker.Item key={index} label={a.areaName} value={a.areaId} />
							))
						}
					</Picker>
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
						placeholder={"Customer Name"}
						iconImageName="profile"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={registerData.email || ''}
						onChange={(val) => handleChange('email', val)}
						placeholder={"Email"}
						iconImageName="envelope"

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

	function handleLogin() {
		navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0);
	}

	return (
		<GradiantScreen>
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.pageTitleWrapper}>
						<Text style={styles.pageTitle}>Sign Up</Text>
					</View>
					<View style={[styles.fieldContainer, styles.registerLinkWrapper]}>
						<Text style={styles.registerTitleText}>Don you have an account?</Text>
						<TouchableOpacity onPress={handleLogin}>
							<Text style={styles.registerLinkText}>Login</Text>
						</TouchableOpacity>
					</View>
					{screen === 1 ? renderScreen1() : renderScreen2()}
					<View style={[styles.fieldContainer, styles.loginButton]}>
						<Button label="SIGN UP" onClick={handleClick} />
					</View>
				</View>
			</ScrollView>
		</GradiantScreen>
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
	planWrapper: {
		borderBottomColor: '#f4ac8c',
		borderTopColor: '#f4ac8c',
		borderLeftColor: '#f4ac8c',
		borderRightColor: '#f4ac8c',
		borderBottomWidth: 2,
		borderTopWidth: 2,
		borderRightWidth: 2,
		borderLeftWidth: 2,
		height: 'auto',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	planText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	planIcon: {
		width: 18,
		height: 18,
	},
	planContainer: {
		width: '100%',
		marginBottom: 15,
	},
	pickerContainer: {
		marginBottom: 15,
		borderBottomColor: '#fff',
		borderBottomWidth: 1, 
	},
}

Registration.navigationOptions = {
	header: null,
};

export default Registration;
