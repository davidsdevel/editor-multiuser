function createReduxStore() {
	const {createStore, combineReducers} = Redux;

	const file = {
		ID: null,
		name:"",
		content:""
	}
	const user = {
		userID: null
	}
	const fileReducer = (state = file, action) => {
		switch(action.type) {
			case "SET_FILE":
				return {
					ID: action.ID,
					name: action.name,
					content: action.content,
				}
			default: return state;
		}
	}
	const userReducer = (state = user, action) => {
		switch(action.type) {
			case "SET_USER_ID":
				return {
					userID: action.userID
				}
			default: return state;
		}
	}
	const combinedStores = combineReducers({
		file: fileReducer,
		user: userReducer
	});

	return createStore(combinedStores);
}

var store = createReduxStore();
