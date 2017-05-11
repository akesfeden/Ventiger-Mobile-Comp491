class StoreAccess {
	static instance = null
	constructor() {
		this.store = null
	}
}

export default () => {
	if (StoreAccess.instance == null) {
		StoreAccess.instance = new StoreAccess()
	}
	return StoreAccess.instance
}