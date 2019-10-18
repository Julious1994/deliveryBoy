import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import Page from './../Page';
import Dialog from './Dialog';
import mapper from './../../images/imageMapper';
import Button from './../../components/Button';
import useUser from './../../userStore';
import Service from './../../services/http';
import {addressMap} from './../../mealMapper';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';


const service = new Service();

function Delivery(props) {
	const [user] = useUser();
	const [loading, setLoading] = useState(true);
	const [tifinList, setTifinList] = useState([]);
	const [paymentModal, setPaymentModal] = useState(false);
	const { navigation } = props;

	useEffect(() => {
		props.navigation.setParams({ logout });
	}, []);

	useEffect(() => {
		service.get(`DeliveryBoyTiffinList?deliveryBoyid=${user.deliveryBoyid}`).then(res => {
			setTimeout(() => {
				setLoading(false);
			}, 500);
			if(res.Status === '1') {
				setTifinList(res.Body);
			}
		});
	}, [user])

	function gotoMapView(item) {
		navigation.push('MapView', { tifin: item });
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

	function renderItem(item) {
		return (
			<TouchableOpacity style={styles.tifinItem} onPress={() => gotoMapView(item)}>
				<Text style={styles.titleText}>{item.customerName}</Text>
				<Text style={styles.typeText}>{item.mealType}</Text>
				<Text style={styles.addressText}>{item[addressMap[item.mealType]]}</Text>
			</TouchableOpacity>
		)
	}

	return (
		<Page {...props}>
			{
				loading ?
					<View style={styles.loaderWrapper}>
						<ActivityIndicator style={styles.loader} size="large" />
					</View>
					:
					<FlatList 
						data={tifinList}
						renderItem={({ item }) => renderItem(item)}
						keyExtractor={(item, index) => `${index}`}
						ListEmptyComponent={(
							!loading && <Text style={styles.notFoundText}>No tifin found</Text>
						)}
					/>
			}
		</Page>
	)
}

const styles = StyleSheet.create({
	tifinItem: {
		backgroundColor: '#fff',
		padding: 10,
		margin: 15,
	},
	titleText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 1,
	},
	typeText: {
		fontWeight: 'bold',
		marginBottom: 2,
	},
	addressText: {
		color: '#545454',
	},
	notFoundText: {
		color: '#fff',
		fontWeight: 'bold',
		alignSelf: 'center',
		marginTop: 10,
	},
	loaderWrapper: {
		height: 200,
	},
	loader: {
		marginTop: '10%',
	},
	rightLink: {
		fontWeight: 'bold',
		marginRight: 10,
		color: 'red',
	},
});

Delivery.navigationOptions = ({ navigation }) => {
	const logout = navigation.getParam('logout');
	return {
		headerTitle: 'Delivery List',
		headerRight: (
			<TouchableOpacity onPress={() => logout && logout()}>
				<Text style={styles.rightLink}>Logout</Text>
			</TouchableOpacity>
		),
	}
}

export default Delivery;
