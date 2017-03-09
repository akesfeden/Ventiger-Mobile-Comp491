import VStyleSheet from '../VStyleSheet'

const styles = VStyleSheet({
	container: {
		android: {
			flex: 0.7,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},//'#F5FCFF',
		ios: {
			backgroundColor: '#F5FCFF',
			flex: 1,
			flexDirection: 'column',
			alignItems: 'center'
		}
		//height: '40%',
	},
	textInput: {
		marginTop: 10,
		marginBottom: 10,
		ios: {
			height: 40,
			borderColor: 'gray',
			borderWidth: 1,
			marginLeft: 15,
			marginRight: 15,
			backgroundColor: 'white',
			padding: 4
		},
		android: {
			width: '70%',
		}
	},
	containerStyle: {
		padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: 'black',
		margin: 15, width: 250, margin: 15,
		marginTop: 30, width: 250, marginTop: 30
	},

	containerStyleDisabled: {
		padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: 'grey',
		margin: 15, width: 250, margin: 15,
		marginTop: 30, width: 250, marginTop: 30
	},

	style: {fontSize: 20, color: 'green'},

	styleDisabled: {fontSize: 20, color: 'green'},
});

export default styles