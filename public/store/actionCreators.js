const login = (name) => {
	return {
		type:"LOGIN",
		logged:true,
		name,
		profilePic:""
	}
}
const logout = (name) => {
	return {
		type:"LOGOUT",
		logged:false,
		name:"",
		profilePic:""
	}
}