import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

function useUser(props) {
	const [user, setUser] = useState({});
	useEffect(() => {
			AsyncStorage.getItem('user').then((res) => {
				const userData = JSON.parse(res);
				console.log('user', userData);
				setUser({...userData});
			});
	}, []);
	return [user];
}

export default useUser;
