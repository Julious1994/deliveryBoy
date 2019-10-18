import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Page from './../Page';
import mapper from './../../images/imageMapper';
import Button from './../../components/Button';
import DateRangePicker from './../../components/DateRangePicker';
import Service from './../../services/http';
import useUser from './../../userStore';
import moment from 'moment';
const service = new Service();

function getDateRange(range) {
	return range ? [range.FromDate, range.ToDate] : range;
}

function CancelTifin(props) {
	const { navigation } = props;
	const multiple = navigation.getParam('multiple');
	const handleSuccess = navigation.getParam('handleSuccess');
	const [user] = useUser();

	const [cancelFor, setCancelFor] = useState({ lunchStatus: false, breakfastStatus: false, dinnerStatus: false, teaStatus: false });
	const [dateRange, setDateRange] = useState(null);
	const [showPicker, setShowPicker] = useState(false);

	function handleCancelFor(name) {
		setCancelFor({ ...cancelFor, [name]: !cancelFor[name] });
	}

	function validate() {
		let flag = false;
		Object.keys(cancelFor).forEach(key => {
			if(cancelFor[key]) {
				flag = true;
			}
		});
		return flag;
	}

	function handleCancel() {
		if(!validate()) {
			Alert.alert('Validation Error', 'Plase select at least one item to cancel');
			return;
		}
		if(multiple && !dateRange) {
			Alert.alert('Validation Error', 'Plase select dates');
			return;
		}
		const object = {
			...cancelFor,
			customerId: user.customerId,
			...(multiple && {...dateRange}),
			...(!multiple && {dateofCancelday: moment().format('YYYY-MM-DD')}),
		}
		const url = multiple ? 'CancelMultipleTiffin' : 'CancelSingledayTiffin';
		service.post(url, object)
			.then(res => {
				console.log('res', res);
				if (res.Status === '1') {
					handleSuccess && handleSuccess(true);
					navigation.pop();
				}
			});
	}

	function handleMultiDate(s, e) {
		console.log(s, e);
		setDateRange({ FromDate: s, ToDate: e });
		setTimeout(() => {
			setShowPicker(false);
		}, 1000);
	}

	function renderRangePicker() {
		return (
			<React.Fragment>
				<TouchableOpacity style={styles.dateRangeWrapper} onPress={() => setShowPicker(true)}>
					<Text style={styles.dateRangeText}>
						{dateRange 
							? `${dateRange.FromDate} To ${dateRange.ToDate}` 
							: 'Select date for multiple days.'
						}
					</Text>
					<Image style={styles.dateIcon} source={mapper.down.source} />
				</TouchableOpacity>
				{
					showPicker &&
						<DateRangePicker
							initialRange={getDateRange(dateRange)}
							onSuccess={(s, e) => handleMultiDate(s, e)}
							theme={{ markColor: '#86d7fb', markTextColor: 'white' }} />
				}
			</React.Fragment>
		);
	}

	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.contentTitle}>Please select what do you want to cancel</Text>
					{multiple && renderRangePicker()}
					<TouchableOpacity activeOpacity={1} style={styles.requestRow} onPress={() => handleCancelFor('breakfastStatus')}>
						<Text style={styles.requestItemTextColor}>Breakfast</Text>
						{
							cancelFor.breakfastStatus &&
							<View style={styles.plusView}>
								<Image source={mapper.check.source} style={styles.plusSelector} />
							</View>
						}
					</TouchableOpacity>

					<TouchableOpacity activeOpacity={1} style={styles.requestRow} onPress={() => handleCancelFor('lunchStatus')}>
						<Text style={styles.requestItemTextColor}>Lunch</Text>
						{
							cancelFor.lunchStatus &&
							<View style={styles.plusView}>
								<Image source={mapper.check.source} style={styles.plusSelector} />
							</View>
						}
					</TouchableOpacity>

					<TouchableOpacity activeOpacity={1} style={styles.requestRow} onPress={() => handleCancelFor('teaStatus')}>
						<Text style={styles.requestItemTextColor}>Tea</Text>
						{
							cancelFor.teaStatus &&
							<View style={styles.plusView}>
								<Image source={mapper.check.source} style={styles.plusSelector} />
							</View>
						}
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1} style={styles.requestRow} onPress={() => handleCancelFor('dinnerStatus')}>
						<Text style={styles.requestItemTextColor}>Dinner</Text>
						{
							cancelFor.dinnerStatus &&
							<View style={styles.plusView}>
								<Image source={mapper.check.source} style={styles.plusSelector} />
							</View>
						}
					</TouchableOpacity>
					<View style={[styles.cancelButton]}>
						<Button label="CANCEL" onClick={handleCancel} />
					</View>
				</View>
			</ScrollView>
		</Page>
	)
}

CancelTifin.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'CancelTifin',
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 30,
		marginRight: 30,
	},
	contentTitle: {
		color: '#fff',
		fontWeight: 'bold',
	},
	requestRow: {
		backgroundColor: '#fff',
	},
	requestItemTextColor: {
		color: 'red',
	},
	requestPanelTitle: {

	},
	requestRow: {
		backgroundColor: '#fff',
		padding: 5,
		paddingLeft: 20,
		paddingRight: 20,
		margin: 10,
		borderBottomColor: '#545454',
		borderBottomWidth: 0.2,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 33,
		borderRadius: 5,
	},
	requestItemTextColor: {
		color: 'black',
	},
	plusView: {
		width: 23,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: 'green',
		padding: 2,
		alignItems: 'center'
	},
	plusSelector: {
		height: 15,
		width: 12,
		tintColor: 'green'
	},
	cancelButton: {
		marginTop: 25,
		paddingBottom: 15,
	},
	contentTitle: {
		margin: 10,
		fontSize: 19,
		color: '#fff',
		marginTop: 40,
		marginBottom: 40,
	},
	dateRangeText: {
		color: '#000',
	},
	dateRangeWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor:'#fff',
		padding: 10,
		margin: 10,
		borderRadius: 5,
	},
	dateIcon: {
		width: 18,
		height: 18,
	}
})

export default CancelTifin;
