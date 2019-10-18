import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import GradiantScreen from './GradiantScreen';
import mapper from './../images/imageMapper';
import { NavigationActions } from 'react-navigation';
import { useTabs } from './../userStore';

const tabs = [
	// { 
	// 	icon: 'home',
	// 	name: 'MenuList',
	// },
	{
		icon: 'notification',
	},
	{
		icon: 'vehicle',
		name: 'Delivery',
	},
	{
		icon: 'settings',
		name: 'Settings',
	},
	// {
	// 	icon: 'avatar',
	// 	name: 'ChangeProfile',
	// },
];

function Page(props) {
	const { showTabs = true } = props;
	const { navigation } = props;

	function handleTabClick(name, index) {
		name && navigation.reset([NavigationActions.navigate({ routeName: name })], 0);
	}

	function renderTabs() {
		const route = navigation.state.routeName;
		return (
			<View style={styles.tabsContainer}>
				{
					tabs.map((tab, i) => (
						<TouchableOpacity key={i} onPress={() => handleTabClick(tab.name, i)}>
							<View>
								<Image style={[styles.tabMenuImage, tab.name === route && styles.activeTabIcon]} source={mapper[tab.icon].source} />
							</View>
						</TouchableOpacity>
					))
				}
			</View>
		)
	}

	return (
		<GradiantScreen
          colors={['#febe6c', '#fa9e8e', '#f47fae']}
          style={{
            height: '100%',
          }}
    >
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				{props.children}
			</View>
			{/* {showTabs && renderTabs()} */}
		</View>
		</GradiantScreen>
	)	
}

const styles = StyleSheet.create({
	container: {
		position: 'relative', 
		height: '100%',
	},
	tabsContainer: {
		position: 'absolute', 
		bottom: 0,
		backgroundColor: '#fff',
		width: '100%',
		padding: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	tabMenuImage: {
		width: 25,
		height: 25,
	},
	contentContainer: {
		paddingBottom: 45,
	},
	activeTabIcon: {
		tintColor: '#f47fae',
	}
});

export default Page;
