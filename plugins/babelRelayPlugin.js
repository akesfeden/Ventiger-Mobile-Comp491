const getBabelRelayPlugin = require('babel-relay-plugin')
const schema = require('../schema.json')
module.exports = { plugins: [getBabelRelayPlugin(schema.data, { abortOnError: true })] }