import React, { useState } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';
import Page from './../Page';
import Button from './../../components/Button';
import Input from './../../components/Input';

function OrderExtraTifin(props) {
	const [order, setOrder] = useState({});

	function handleChange(key, value) {
		setOrder({ ...order, [key]: value });
	}

	function handleClick() {
		console.log('click');
	}

	return (
		<Page {...props}>
			<View style={styles.container}>
				<View style={styles.fieldContainer}>
					<Input
						value={order.quantity}
						keyboardType={'numeric'}
						onChange={(val) => handleChange('quantity', val)}
						placeholder="Quantity"
						placeholderTextColor="#545454"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Picker
						selectedValue={order.paymentType || ''}
						onValueChange={(e) => handleChange('paymentType', e)}
					>
						<Picker.Item label="Payment Type" value={''} />
						<Picker.Item label="Cash" value="CASH" />
						<Picker.Item label="Online" value="ONLINE" />
					</Picker>
				</View>
				<View style={styles.buttonView}>
					<Button label="SUBMIT" onClick={handleClick} />
				</View>
			</View>
		</Page>
	)
}

OrderExtraTifin.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Order extra tifin',
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 25,
		marginRight: 25,
		marginTop: '10%',
	},
	buttonView: {
		marginTop: '40%',
	},
	fieldContainer: {
		paddingBottom: 15,
	}
});

export default OrderExtraTifin;
