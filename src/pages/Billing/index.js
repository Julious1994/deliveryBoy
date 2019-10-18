import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Page from './../Page';

function BilingHistory(props) {
	const list = [
		{id: 1, name: 'Paid on monday'},
		{id: 2, name: 'Paid on month ago'},
		{id: 3, name: 'Paid'}
	]
	const [tabIndex, setTabIndex] = React.useState(0);
	
	function handleRequestClick(routeName) {
		const { navigation } = props;
		navigation.navigate(routeName);
	}

	function changeTab(index) {
		setTabIndex(index);
	}

	function renderItem(item) {
		return(
			<View style={styles.itemWrapper}>
				<Text style={styles.itemTitleText}>{item.name}</Text>
				<Text style={{ fontSize: 11}}>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. </Text>
			</View>
		)
	}

	return (
		<Page {...props}>
			<View style={styles.container}>
				<View style={styles.tabViewWrapper}>
					<TouchableOpacity onPress={() => changeTab(0)}>
						<View style={[styles.tabItemWrapper, {...(tabIndex === 0 && styles.activeTabWrapper)}]}>
							<Text style={[styles.tabText, {...(tabIndex === 0 && styles.activeTabText)}]}>PAYMENT</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => changeTab(1)}>
						<View style={[styles.tabItemWrapper, {...(tabIndex === 1 && styles.activeTabWrapper)}]}>
							<Text style={[styles.tabText, {...(tabIndex === 1 && styles.activeTabText)}]}>PENDING</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => changeTab(2)}>
						<View style={[styles.tabItemWrapper, {...(tabIndex === 2 && styles.activeTabWrapper)}]}>
							<Text style={[styles.tabText, {...(tabIndex === 2 && styles.activeTabText)}]}>COMPLETE</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ marginTop: 10}}>
					<FlatList 
						data={list}
						renderItem={({ item }) => renderItem(item)}
						keyExtractor={(item, index) => `${index}`}
					/>
				</View>
			</View>
		</Page>
	)
}

BilingHistory.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Biling History',
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: '10%',
		marginRight: '10%',
		marginTop: 10,
	},
	tabViewWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tabItemWrapper: {
		padding: 10,
	},
	tabText: {
		fontWeight: 'bold',
	},
	activeTabText: {
		color: '#fff',
	},
	activeTabWrapper: {
		borderBottomColor: '#a73965',
		borderBottomWidth: 2,
	},
	itemWrapper: {
		backgroundColor: '#fff',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 7,
		paddingBottom: 10,
		marginBottom: 15,
	},
	itemTitleText: {
		fontSize: 18,
	},
})

export default BilingHistory;
