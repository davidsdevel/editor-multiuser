const setFile = (ID, name, content) => ({
	type:"SET_FILE",
	ID,
	name,
	content
});

const setUserID = userID => ({
	type: "SET_USER_ID",
	userID
})