const deviceInfo = require('react-native-device-info')

function getStrings() {
	const locale = deviceInfo.getDeviceLocale()
	if(locale.startsWith('tr')) {
		return require('./strings.tr')
	}
	return require('./strings.en')
}
export default getStrings()