import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from './../../services/http';

function MenuList(props) {
	const [list, setList] = useState([]);
	// const list = [
	// 	{title: 'Dumplings', description: 'the text field will blur when submitted. The default value is true for single-line fields and false for multiline fields. Note that for multiline fields, setting.'},
	// 	{title: 'Burger', description: 'the text field will blur when submitted. The default value is true for single-line fields and false for multiline fields. Note that for multiline fields, setting.'},
	// 	{title: 'Panner Masala', description: 'the text field will blur when submitted. The default value is true for single-line fields and false for multiline fields. Note that for multiline fields, setting.'},
	// 	{title: 'Green tea', description: 'the text field will blur when submitted. The default value is true for single-line fields and false for multiline fields. Note that for multiline fields, setting.'},
	// ]
	useEffect(() => {
		const service = new Service();
		service.get('MenuList').then(res => {
			console.log('res', res);
			if(res.Status === '1') {
				setList(res.Body);
			}
		})
	}, []);

	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.menuList}>
					{
						!list.length &&
						<Text style={styles.emptyList}>No menu found</Text>
					}
					{
						list.map((item, i) => (
							<View key={i} style={styles.menuListItemContainer}>
								<View style={styles.itemSection}>
									<Text style={styles.menuTitle}>{item.title}</Text>
								</View>
								<View style={styles.itemSection}>
									<Text style={styles.menuDescriptionText}>{item.description}</Text>
								</View>
								<View style={styles.actionView}>
									<TouchableOpacity>
										<GradiantScreen>
											<Image style={styles.eyeIcon} source={imageMapper.eye.source} />
										</GradiantScreen>
									</TouchableOpacity>
								</View>
							</View>
						))
					}
				</View>
			</ScrollView>
		</Page>
	)
}

MenuList.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'MenuList',
	}
}

const styles = StyleSheet.create({
	menuListItemContainer: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#fff',
		padding: 10,
		marginBottom: 15,
	},
	menuTitle: {
		fontWeight: 'bold',
		fontSize: 14
	},
	menuDescriptionText: {
		fontSize: 11,
	},
	actionView: {
		width: 30, 
		height: 30,
		alignSelf: 'flex-end',
	},
	eyeIcon: {
		tintColor: "#fff",
		width: 15,
		height: 15,
		alignSelf: 'center',
		marginTop: 8,
	},
	menuList: {
		marginLeft: 25,
		marginRight: 25,
		marginTop: 15,
	},
	itemSection: {
		marginBottom: 10
	},
	emptyList: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#fff',
	}
})

export default MenuList;
