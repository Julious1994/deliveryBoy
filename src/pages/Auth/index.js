import React, {useEffect} from 'react';
import { ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
import mapper from './../../images/imageMapper';
import GradiantScreen from './../GradiantScreen';

function Auth(props) {
	const { navigation } = props;
	useEffect(() => {
		try {
			AsyncStorage.getItem('isLoggedIn').then(res => {
				if(res === 'true') {
					navigation.reset([NavigationActions.navigate({ routeName: 'MapView' })], 0);
				} else {
					navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0);
				}
			})
		} catch(err) {
			console.log('ERR', err);
		}
	}, []);

	return (
		<ImageBackground style={{ height: '100%', width: '100%'}} source={mapper.splash.source}>
			<ActivityIndicator style={styles.loading} size="large" />
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	loading: {
		alignSelf: 'center',
		marginTop: '80%',
	},
});

Auth.navigationOptions = {
	header: null,
}

export default Auth;
