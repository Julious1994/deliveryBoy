import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity,Alert } from 'react-native';
import Page from './../Page';
import Button from './../../components/Button';
import Input from './../../components/Input';
import useUser from '../../userStore';
import mapper from './../../images/imageMapper';
import GradiantScreen from './../GradiantScreen';
import Service from './../../services/http';

const service = new Service();
function Plan(props) {
	const { navigation } = props;
	const isNew = navigation.getParam('isNew', false);
	const [plans, setPlans] = useState([]);
	const [plan, setPlan] = useState(navigation.getParam('plan'));
	const [loading, setLoading] = useState(true);
	const [user] = useUser();

	function handleChange(value) {
		setPlan(value);
	}

	useEffect(() => {
		const service = new Service();
		service.get('PlanList').then(res => {
			console.log('res', res);
			if (res.Status == '1') {
				setPlans(res.Body);
			}
			setLoading(false);
		}, () => {
			setLoading(false);
		});
	}, []);

	function changePlan(payment) {
		const {type} = payment;
		console.log('user', user);
		const object = {
			paymentType: type,
			planId: plan.planId,
			customerId: user.customerId,
		}
		service.post('ChangePlan', object).then(res => {
			console.log('res', res);
			if(res.Status === '1') {
				Alert.alert('Change Plan', res.Body, [
					{text: 'OK', onPress: () => navigation.pop()}
				])
			}
		})
	}

	function handleClick() {
		if(isNew) {
			const handlePlanChange = navigation.getParam('handlePlanChange');
			handlePlanChange && handlePlanChange(plan);
			navigation.pop();
		} else {
			props.navigation.push('Payment', {plan, changePlan});
		}
	}
	return (
		<Page {...props} showTabs={!isNew}>
			{
				loading ?
					<ActivityIndicator style={styles.loadingIndicator} size={"large"} />
					:
					<View style={styles.container}>
						<ScrollView horizontal={true}>
							<View style={styles.planContainer}>
								{
									plans.map((p, index) => (
										<TouchableOpacity key={index} style={styles.planItemWrapper} onPress={() => handleChange(p)} activeOpacity={1}>
											<View style={styles.planImageWrapper}>
												<Image source={mapper.meal1.source} style={styles.planImageWrapper} />
												{
													plan && p.planId === plan.planId ?
														<View style={styles.selectedPlan}>
															<Image source={mapper.check.source} style={styles.selectedImage} />
														</View>
														:
														<Image source={mapper.plusCircle.source} style={styles.plusSelector} />
												}
											</View>
											<View style={styles.planDetailsWrapper}>
												<Text style={styles.planNameText}>{p.name} {p.amount}/{p.days} days</Text>
												<Text style={styles.planDescription}>Yeah, so before you start writing your own custom hooks there is a VERY high possibility that someone has already written it and put it on npm.</Text>
											</View>
										</TouchableOpacity>
									))
								}
							</View>
						</ScrollView>
						<View style={styles.submitImageContainer}>
							<TouchableOpacity style={styles.submitWrapper} onPress={handleClick}>
								<GradiantScreen style={styles.submitGradiant}>
									<Image source={mapper.check.source} style={styles.submitIcon} />
								</GradiantScreen>
							</TouchableOpacity>
						</View>
					</View>
			}
		</Page>
	)
}

Plan.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Select Plan',
	}
}

const styles = StyleSheet.create({
	container: {
		// marginLeft: 10,
		// marginRight: 10,
		marginTop: '5%',
	},
	planContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	buttonView: {
		marginTop: '40%',
	},
	fieldContainer: {
		paddingBottom: 15,
	},
	planItemWrapper: {
		width: 250,
		marginLeft: 10,
		marginRight: 10,
	},
	planImageWrapper: {
		width: '100%',
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		position: 'relative',
	},
	planDetailsWrapper: {
		backgroundColor: '#fff',
		padding: 20,
		borderBottomRightRadius: 5,
		borderBottomLeftRadius: 5,
	},
	planNameText: {
		fontSize: 20,
		paddingTop: 5,
		paddingBottom: 5,
	},
	planDescription: {
		color: '#AFAFAF',
	},
	submitImageContainer: {
		alignSelf: 'center',
		marginTop: 25,
		borderRadius: 100,
		width: 75,
		height: 75
	},
	submitGradiant: {
		borderRadius: 100,
		width: "100%"
	},
	submitIcon: {
		marginTop: 8,
		width: '75%',
		height: '75%',
		alignSelf: 'center',
	},
	submitWrapper: {
		width: '100%',
		height: '100%',
	},
	selectedPlan: {
		position: 'absolute',
		borderRadius: 100,
		height: 25,
		width: 25,
		backgroundColor: '#fff',
		right: 10,
		top: 10,
		backgroundColor: '#ed3851',
	},
	plusSelector: {
		position: 'absolute',
		borderRadius: 100,
		height: 35,
		width: 35,
		right: 8,
		top: 8,
	},
	selectedImage: {
		tintColor: '#fff',
		height: 15,
		width: 15,
		marginTop: 5,
		alignSelf: 'center',
	},
	loadingIndicator: {
		marginTop: 100,
	}
});

export default Plan;
