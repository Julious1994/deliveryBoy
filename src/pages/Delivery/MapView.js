import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, TextInput, Image, Alert, Linking } from 'react-native';
import Dialog from './Dialog';
import mapper from './../../images/imageMapper';
import Button from './../../components/Button';
import useUser from './../../userStore';
import Service from './../../services/http';
import { addressMap } from './../../mealMapper';
import MapViewComponent, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import geolocation from '@react-native-community/geolocation';
import geoCoder from 'react-native-geocoding';
import GradiantScreen from './../GradiantScreen';
import TextInputMask from 'react-native-text-input-mask';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
const GOOGLE_API_KEY = 'AIzaSyDpBaQgF2n3jManrTXt8pZ5I5RUX4uTRec';

const service = new Service();


const markers = [];
const initialRegion = {
	latitude: 51.5074,
	longitude: 0.1278,
	latitudeDelta: 0.05,
	longitudeDelta: 0.05,
};

function MapView(props) {
	const { navigation } = props;
	const [deliverDialog, setDeliverDialog] = useState(false);
	const [cashDialog, setCashDialog] = useState(false);
	const [pinDialog, setPinDialog] = useState(false);
	const [collectBy, setCollectBy] = useState(0);
	const [deliverPersonName, setDeliverPersonName] = useState('self');
	const [amount, setAmount] = useState();
	const [user] = useUser();
	const [pin, setPin] = useState();
	const [loading, setLoading] = useState(true);
	const [successDialog, setSuccessDialog] = useState(false);
	const [billId, setBillId] = useState();
	const [tifin, setTifin] = useState();
	const [tifinList, setTifinList] = useState([]);

	const mapViewRef = useRef();
	const maskInputRef = useRef();

	const [currentPosition, setCurrentPosition] = useState();
	const [addressCoords, setAddressCoords] = useState();

	function handleDeliverTo(index) {
		if (index === 0) {
			setDeliverPersonName('self');
		} else {
			setDeliverPersonName(null);
		}
		setCollectBy(index)
	}

	function onDelivered() {
		if (deliverPersonName) {
			service.post(`TiffinDeliver?id=${tifin.id}&deliverPersonName=${deliverPersonName}`).then(res => {
				setDeliverDialog(false);
				Alert.alert('Delivery', res.Body, [
					{ text: 'OK', onPress: () => fetchTifin()}
				]);
			});
		}
	}

	function verifyPin() {
		if (billId) {
			const object = {
				billId,
				customerPin: pin,
				customerId: tifin.customerId,
			}
			service.post('PinVerification', object).then(res => {
				if (res.Status === '1') {
					setPinDialog(false);
					setSuccessDialog(true);
				}
			});
		}
	}

	function onCashPayment() {
		const object = {
			customerId: tifin.customerId,
			amount
		};
		service.post('CashPayment', object).then(res => {
			if (res.Status === '1') {
				setCashDialog(false);
				setBillId(res.Body.billId);
				setPinDialog(true);
			} else {
				Alert.alert("Cash Payment", res.Body);
			}
		})
	}

	function confirmCollect(record) {
		Alert.alert("Collect Tiffin", "Did you collected tiffin", [
			{ text: "Yes", onPress: () => onTifinCollect(record) },
			{ text: "No" }
		])
	}

	function onTifinCollect(record) {
		service.post(`TiffinCollected?id=${record.id}`).then(res => {
			Alert.alert("Tifin Collected", res.Body, [
				{ text: 'OK', onPress: () => fetchTifin()}
			]);
			fetchTifin();
		});
	}

	const fetchTifin = React.useCallback(() => {
		console.log('called');
		setLoading(true);
		service.get(`DeliveryBoyTiffinList?deliveryBoyid=${user.deliveryBoyid}`).then(res => {
		
			setTimeout(() => {
				setLoading(false);
			}, 500);
			if (res.Status === '1') {
				setTifinList(res.Body);
			}
		});
	}, [user]);

	useEffect(() => {
		fetchTifin();
	}, [fetchTifin])

	useEffect(() => {
		props.navigation.setParams({ logout });
		geolocation.getCurrentPosition(
			(position) => {
				setCurrentPosition(position.coords);
			},
			(error) => console.log(error),
			{ enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
		);
	}, [])

	useEffect(() => {
		if (tifin) {
			setLoading(true);
			geoCoder.init(GOOGLE_API_KEY);
			geoCoder.from(tifin[addressMap[tifin.mealType]])
				.then(json => {
					console.log('json', json);
					var location = json.results[0].geometry.location;
					setAddressCoords({ latitude: location.lat, longitude: location.lng });
				})
				.catch(error => console.warn(error));
		}
	}, [tifin])

	function logout() {
		Alert.alert('Logout', 'Are you sure? Want to logout?', [
			{ text: 'Yes', onPress: () => doLogout() },
			{ text: 'No' }
		])
	}

	function doLogout() {
		const { navigation } = props;
		navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0);
		AsyncStorage.removeItem('isLoggedIn');
	}

	function renderDeliveredDialog() {
		return (
			<Dialog
				visible={deliverDialog}
				closeDialog={() => setDeliverDialog(false)}
			>
				<View style={styles.dialogContainer}>
					<Text style={styles.cashDialogText}>DELIVERED TO</Text>
					<View style={styles.radioContainer}>
						<TouchableOpacity style={styles.radioButton} onPress={() => handleDeliverTo(0)}>
							<View style={styles.dotView}>
								<View style={[styles.dot, collectBy === 0 && styles.selectedDot]} />
							</View>
							<Text>Customer</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.radioButton} onPress={() => handleDeliverTo(1)}>
							<View style={styles.dotView}>
								<View style={[styles.dot, collectBy === 1 && styles.selectedDot]} />
							</View>
							<Text>Nominee</Text>
						</TouchableOpacity>
					</View>
					{
						collectBy === 1 &&
						<View style={styles.collectionWrapper}>
							<TouchableOpacity style={styles.nomineeContainer} activeOpacity={1} onPress={() => setDeliverPersonName(tifin.firstNomineename)}>
								<View>
									<Text style={{ fontWeight: 'bold' }}>{tifin.firstNomineename}</Text>
									<Text>{tifin.firstNomineemobile}</Text>
								</View>
								{
									deliverPersonName === tifin.firstNomineename &&
									<View style={styles.plusView}>
										<Image source={mapper.check.source} style={styles.plusSelector} />
									</View>
								}
							</TouchableOpacity>
							<TouchableOpacity style={styles.nomineeContainer} activeOpacity={1} onPress={() => setDeliverPersonName(tifin.secondNomineename)}>
								<View>
									<Text style={{ fontWeight: 'bold' }}>{tifin.secondNomineename}</Text>
									<Text>{tifin.secondNomineemobile}</Text>
								</View>
								{
									deliverPersonName === tifin.secondNomineename &&
									<View style={styles.plusView}>
										<Image source={mapper.check.source} style={styles.plusSelector} />
									</View>
								}
							</TouchableOpacity>
						</View>
					}
					<Button label="Delivered" onClick={onDelivered} />
				</View>
			</Dialog>
		)
	}

	function renderSuccessDialog() {
		return (
			<Dialog
				visible={successDialog}
				closeDialog={() => setSuccessDialog(false)}
			>
				<View style={styles.dialogContainer}>
					<View style={styles.successView}>
						<Image source={mapper.check.source} style={styles.successImage} />
					</View>
					<Text style={styles.successText}>Payment accepted succesfully received</Text>
					<Button label="OK" onClick={() => setSuccessDialog(false)} />
				</View>
			</Dialog>
		)
	}

	function renderCashDialog() {
		return (
			<Dialog
				visible={cashDialog}
				closeDialog={() => setCashDialog(false)}
			>
				<View style={styles.dialogContainer}>
					<Text style={styles.cashDialogText}>CASH RECEIVED</Text>
					<Text style={styles.amountText}>Amount</Text>
					<TextInput
						style={[styles.textInput, {textAlign: 'left'}]}
						onChangeText={amt => setAmount(amt)}
						value={amount}
						keyboardType="numeric"
					/>
					<Button label="Submit" onClick={onCashPayment} />
				</View>
			</Dialog>
		)
	}

	function renderPinDialog() {
		return (
			<Dialog
				visible={pinDialog}
				closeDialog={() => setPinDialog(false)}
			>
				<View style={styles.dialogContainer}>
					<Text style={styles.cashDialogText}>ENTER PIN</Text>
					<Text style={styles.amountText}>PIN</Text>
					<TextInputMask
						style={styles.textInput}
						refInput={ref => { maskInputRef.current = ref }}
						onChangeText={(formatted, extracted) => {
							setPin(extracted)
						}}
						value={pin}
						keyboardType="numeric"
						mask={"[0] - [0] - [0] - [0] - [0] - [0]"}
					/>
					<Button label="Verify" onClick={verifyPin} />
				</View>
			</Dialog>
		)
	}

	function handleCall(mobile) {
		Linking.openURL(`tel:${mobile}`);
	}

	function renderLoading() {
		return (
			<View style={styles.loadingContainer}>
				<View style={styles.loadingContent}>
					<ActivityIndicator size={"large"} />
					<Text style={styles.loadingText}>Loading...</Text>
				</View>
			</View>
		)
	}

	function renderItem(record) {
		return (
			<View style={styles.tiffinContainer}>
				<View style={styles.tiffinContent}>
					<TouchableOpacity style={styles.customerDetail} onPress={() => setTifin(record)}>
						<Text style={styles.nameText}>{record.customerName}</Text>
						<Text style={styles.nameText}>Status: {record.status}</Text>
						<Text style={styles.nameText}>Qty: {record.quantity}</Text>
						<Text style={styles.addressText}>{record[addressMap[record.mealType]]}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.actionView} onPress={() => handleCall(tifin.mobile)}>
						<Image source={mapper.redDial.source} style={styles.actionIcon} />
						<Text style={styles.actionText}>Call</Text>
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.actionView} onPress={() => {
						setTifin(record);
						setDeliverDialog(true);
					}}
					>
						<Image source={mapper.delivery.source} style={styles.actionIcon} />
						<Text style={styles.actionText}>Delivered</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.actionView} onPress={() => confirmCollect(record)}>
						<Image source={mapper.tiffin.source} style={styles.actionIcon} />
						<Text style={styles.actionText}>Collect</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.actionView} onPress={() => {
						setTifin(record);
						setCashDialog(true)
					}}>
						<Image source={mapper.payment.source} style={styles.actionIcon} />
						<Text style={styles.actionText}>Cash</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	return (
		<View>
			<MapViewComponent
				region={initialRegion}
				style={{ width: "100%", height: "50%" }}
				ref={c => mapViewRef.current = c}
			>
				{
					currentPosition &&
					<MapViewComponent.Marker key={`coordinate_1`} coordinate={currentPosition} />
				}
				{
					addressCoords &&
					<MapViewComponent.Marker key={`coordinate_2`} coordinate={addressCoords} />
				}
				{
					currentPosition && tifin &&
					<MapViewDirections
						origin={{ ...currentPosition, accuracy: 0.05 }}
						destination={tifin[addressMap[tifin.mealType]]}
						apikey={GOOGLE_API_KEY}
						strokeWidth={7}
						strokeColor={'red'}
						mode="DRIVING"
						onReady={result => {
							setLoading(false);
							mapViewRef.current.fitToCoordinates(result.coordinates, {});
						}}
					/>
				}
			</MapViewComponent>
			{
				<GradiantScreen style={{ height: '50%', paddingTop: 10 }}>
					<FlatList
						data={tifinList}
						renderItem={({ item }) => renderItem(item)}
						keyExtractor={(item, index) => `${index}`}
					/>
				</GradiantScreen>
			}
			{renderDeliveredDialog()}
			{renderCashDialog()}
			{renderPinDialog()}
			{renderSuccessDialog()}
			{loading && renderLoading()}
		</View>
	)
}

const styles = StyleSheet.create({
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	radioContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 20,
	},
	dotView: {
		width: 20,
		height: 20,
		borderColor: '#afafaf',
		borderRadius: 100,
		borderWidth: 0.5,
		marginRight: 5,
		alignItems: 'center'
	},
	dot: {
		marginTop: 3,
		width: 13,
		height: 13,
		backgroundColor: '#fff',
		borderRadius: 100,
	},
	selectedDot: {
		backgroundColor: '#f47fae',
	},
	radioButton: {
		display: 'flex',
		flexDirection: 'row',
	},
	nomineeContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 5,
		marginBottom: 5,
		borderBottomColor: '#afafaf',
		borderBottomWidth: 1,
		padding: 3,
	},
	plusView: {
		width: 23,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: 'green',
		padding: 2,
		alignItems: 'center',
		height: 23,
		marginTop: 5,
		marginRight: 5,
	},
	plusSelector: {
		height: 15,
		width: 12,
		tintColor: 'green'
	},
	tiffinContainer: {
		margin: 10,
		// position: 'absolute',
		width: '95%',
		bottom: 10,
		backgroundColor: '#fff',
	},
	tiffinContent: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 5,
	},
	customerDetail: {
		width: '45%',
		backgroundColor: '#fff',
	},
	actionView: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#fff',
		marginTop: 10,
	},
	actionText: {
		fontSize: 9,
		fontWeight: 'bold',
	},
	actionIcon: {
		width: 20,
		height: 20,
		marginTop: 10,
		marginBottom: 10,
		alignSelf: 'center',
	},
	nameText: {
		fontWeight: 'bold',
	},
	addressText: {
		fontSize: 12,
	},
	dialogContainer: {
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 5,
	},
	collectionWrapper: {
		marginBottom: 20,
	},
	amountText: {
		fontWeight: 'bold',
	},
	cashDialogText: {
		fontWeight: 'bold',
		fontSize: 15,
		alignSelf: 'center',
		marginBottom: 25,
	},
	deliveryDialogText: {
		fontWeight: 'bold',
		fontSize: 15,
		alignSelf: 'center',
		marginTop: 10,
	},
	textInput: {
		borderBottomWidth: 1,
		borderBottomColor: '#000',
		height: 30,
		padding: 0,
		marginBottom: 20,
		textAlign: 'center',
	},
	successView: {
		width: 50,
		borderRadius: 100,
		borderWidth: 3,
		borderColor: 'green',
		padding: 2,
		alignItems: 'center',
		height: 50,
		alignSelf: 'center',
		lineHeight: 50,
		marginTop: 20,
		marginBottom: 20,
	},
	successImage: {
		height: 30,
		width: 30,
		tintColor: 'green',
		marginTop: 5
	},
	successText: {
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		marginTop: 15,
		marginBottom: 20,
	},
	loadingContainer: {
		position: 'absolute',
		top: '40%',
		alignSelf: 'center',
		width: '50%',
		height: 100,
		borderRadius: 10,
		backgroundColor: '#fff',
		// marginTop
	},
	loadingContent: {
		paddingTop: '15%',
		borderRadius: 10,
		backgroundColor: '#fff',
		height: '100%',
	},
	loadingText: {
		alignSelf: 'center',
		fontWeight: 'bold',
		marginTop: 5,
	},
	rightLink: {
		fontWeight: 'bold',
		marginRight: 10,
		color: 'red',
	},
});

MapView.navigationOptions = ({ navigation }) => {
	const logout = navigation.getParam('logout');
	return {
		headerTitle: 'DELIVERY',
		headerRight: (
			<TouchableOpacity onPress={() => logout && logout()}>
				<Text style={styles.rightLink}>Logout</Text>
			</TouchableOpacity>
		),
	}
}

export default MapView;
