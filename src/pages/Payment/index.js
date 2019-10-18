import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Page from './../Page';
import Button from './../../components/Button';
import mapper from './../../images/imageMapper';
import Service from './../../services/http';


const methods = [
	{ id: 1, title: 'CREDIT CARD', type: 'Online', image: mapper.creditCardIcon},
	{ id: 2, title: 'PAYPAL', type: 'Online', image: mapper.paypalIcon},
	{ id: 3, title: 'CASH', type: 'Cash', image: mapper.paypalIcon},
];

function Payment(props) {
	const {navigation} = props;
	const changePlan = navigation.getParam('changePlan');
	const [paymentMethod, setPaymentMethod] = useState({...methods[0]});


	function onPaymentMethodChange(method) {
		setPaymentMethod(method);
	}

	function renderMethod(method, index) {
		return (
			<TouchableOpacity key={index} style={[styles.paymentMethodLine, styles.firstMethod]} onPress={() => onPaymentMethodChange(method)}>
				<View style={[styles.methodRadio, { ...(paymentMethod.id === method.id && styles.selectedMethod) }]}></View>
				<Image style={styles.methodImage} source={method.image.source} />
				<Text style={styles.paymentMethodTitle}>{method.title}</Text>
			</TouchableOpacity>
		)
	}

	function handlePaymentSubmit() {
		if(paymentMethod.id === 3) {
			changePlan && changePlan({ ...paymentMethod});
			navigation.pop();
		}
	}

	return (
		<Page {...props}>
			<View style={styles.container}>
				<Text style={styles.paymentMethodText}>Select Payment Method</Text>
				<View style={styles.paymentMethodList}>
					{
						methods.map((method, i) => (
							renderMethod(method, i)
						))
					}
				</View>
				<Text style={styles.paymentFormTitle}>
					{paymentMethod.id === 1 && 'Select Card'}
					{paymentMethod.id === 2 && 'Select Paypal'}
				</Text>
				<View></View>
				<View style={styles.nextButton}>
					<Button label='Next' onClick={handlePaymentSubmit} />
				</View>
			</View>
		</Page>
	)
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 30,
		marginRight: 30,
	},
	paymentMethodText: {
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 15,
	},
	paymentMethodList: {
		backgroundColor: '#fff',
		borderRadius: 5,
	},
	paymentMethodLine: {
		display: 'flex',
		flexDirection: 'row',
		padding: 10,
	},
	methodImage: {
		width: 45,
		height: 32,
		marginRight: 10,
	},
	methodRadio: {
		height: 15,
		width: 15,
		borderRadius: 100,
		marginTop: 10,
		marginRight: 10,
		borderColor: '#afafaf',
		borderWidth: 1,
	},
	selectedMethod: {
		backgroundColor: 'green',
	},
	firstMethod: {
		borderBottomWidth: 1,
		borderColor: '#ddd',
	},
	paymentMethodTitle: {
		marginTop: 5,
	},
	paymentFormTitle: {
		fontWeight: 'bold',
		color: '#fff',
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 20,
	},
	nextButton: {
		alignItems: 'center',
	},
});

Payment.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Payment',
	}
}

export default Payment;
