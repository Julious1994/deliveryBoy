import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Page from './../Page';
import Dialog from './Dialog';
import mapper from './../../images/imageMapper';
import Button from './../../components/Button';

function Request(props) {
	const list = []
	const [cancelConfirm, setCancelConfirm] = useState(false);
	const [success, setSuccess] = useState(false);
	const [multiple, setMultiple] = useState(false);

	function handleRequestClick(routeName, params = {}) {
		const { navigation } = props;
		navigation.navigate(routeName, params);
	}

	function handleCancelConfirm() {
		handleRequestClick('CancelTifin', {multiple, handleSuccess: (flag) => setSuccess(flag)});
		setMultiple(false);
		setCancelConfirm(false);
	}

	function renderSuccessDialog() {
		return (
			<Dialog 
				visible={success}
				closeDialog={() => setSuccess(false)}
			>
				<View>
					<Image style={{ height: 200, width: '100%'}} source={mapper.tifinBanner.source} />
				</View>
				<Text style={styles.successTitle}>Success!</Text>
				<Text style={styles.successText}>Your tifin has been cancelled Successfully!</Text>
				<View style={[styles.dialogButton]}>
					<Button label="OK" onClick={() => setSuccess(false)} />
				</View>
			</Dialog>
		)
	}

	return (
		<Page {...props}>
			<View style={styles.requestContainer}>
				<Text style={styles.requestPanelTitle}>CancelTifin</Text>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => setCancelConfirm(true)}>
						<Text style={styles.requestItemTextColor}>Cancel Tifin for a day</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
						<TouchableOpacity 
							onPress={() => {
								setCancelConfirm(true)
								setMultiple(true);
							}}
						>
						<Text style={styles.requestItemTextColor}>Cancel Tifin for multiple days</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('BillingCycle')}>
						<Text style={styles.requestItemTextColor}>Billing Cycle</Text>
					</TouchableOpacity>
				</View>

				<Text style={styles.requestPanelTitle}>Other Options</Text>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('Support')}>
						<Text style={styles.requestItemTextColor}>Support request & complaint</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('Ticket')}>
						<Text style={styles.requestItemTextColor}>Add Ticket</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('Plan')}>
						<Text style={styles.requestItemTextColor}>Change Plan</Text>
					</TouchableOpacity>
				</View>	
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('')}>
						<Text style={styles.requestItemTextColor}>Terms & conditions</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Dialog 
				visible={cancelConfirm}
				closeDialog={() => {
					setCancelConfirm(false);
					setMultiple(false);
				}}
			>
				<View>
					<Image style={{ height: 200, width: '100%'}} source={mapper.tifinBanner.source} />
				</View>
				<Text style={styles.cancelDialogTifinText}>CANCEL TIFIN FOR A {multiple && 'MULTIPLE'} DAY</Text>
				<View style={[styles.dialogButton]}>
					<Button label="YES" onClick={handleCancelConfirm} />
				</View>
			</Dialog>
			{renderSuccessDialog()}
		</Page>
	)
}

Request.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Request',
	}
}

const styles = StyleSheet.create({
	requestContainer: {
		marginLeft: '10%',
		marginRight: '10%',
		paddingTop: 30,
	},
	requestRow: {
		backgroundColor: '#fff',
		padding: 12,
		borderBottomColor: '#545454',
		borderBottomWidth: 0.2,
	},
	requestItemTextColor: {
		color: '#a73965',
	},
	requestPanelTitle: {
		marginTop: 25,
		marginBottom: 5,
		marginLeft: 10,
		color: '#fff'
	},
	cancelDialogTifinText: {
		color: '#ed3851',
		fontSize: 18,
		alignSelf: 'center',
		textAlign: 'center',
	},
	dialogButton: {
		marginTop: 25,
		paddingBottom: 15,
	},
	successTitle: {
		color: 'green',
		fontSize: 22,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	successText: {
		fontSize: 15,
		alignSelf: 'center',
		fontWeight: 'bold',
		color: 'green',
		textAlign: 'center',
		marginTop: 15,
	},
})

export default Request;
