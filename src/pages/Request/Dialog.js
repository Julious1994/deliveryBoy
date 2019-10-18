import React from 'react';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

function DialogPopup(props) {
	return(
		<Dialog
			visible={props.visible}
			onHardwareBackPress={props.closeDialog}
			onTouchOutside={props.closeDialog}
			dialogStyle={{ width: '80%', position: 'relative'}}
		>
			<DialogContent>
				{props.children}
			</DialogContent>
		</Dialog>
	)
}

export default DialogPopup;
