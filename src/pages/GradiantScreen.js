import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

function GradiantScreen(props) {
	const { style = {}, colors = ['#febe6c', '#fa9e8e', '#f47fae'] } = props;
	return (
		<LinearGradient
          colors={colors}
          style={{
						height: '100%',
						...style,
          }}
    >
			{props.children}
		</LinearGradient>
	)	
}

export default GradiantScreen;
