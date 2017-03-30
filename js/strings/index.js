const deviceInfo = require('react-native-device-info')

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

function mergeDeep(target, source, modifyTarget = false) {
    let output = modifyTarget ? Object.assign({}, target) : target;
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, {[key]: source[key]});
                else
                    output[key] = mergeDeep(output[key], source[key], true);
            } else {
                Object.assign(output, {[key]: source[key]});
            }
        });
    }
    return output;
}
function getStrings() {
	const locale = deviceInfo.getDeviceLocale()
    const fallback = require('./strings.en')

    if (locale.startsWith('tr')) {
        return mergeDeep(fallback, require('./strings.tr'))
	}
    return fallback
}
export default getStrings()