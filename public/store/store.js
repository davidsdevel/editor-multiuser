function createReduxStore() {
	let {createStore, combineReducers} = Redux;
	let account = {
		logged:false,
		name:"",
		profilePic:""
	}
	let accountReducer = (state = account, action) => {
		switch(action.type) {
			case "LOGIN":
				return {
					logged:true,
					name:action.name
				}
			case "LOGOUT":
				return {
					logged:false,
					name:""
				}
				break;
			default: return state;
		}
	}
	let combinedStores = combineReducers({
		account:accountReducer
	});
	return createStore(combinedStores);
}

var store = createReduxStore();