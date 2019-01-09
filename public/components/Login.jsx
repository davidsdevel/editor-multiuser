class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			username:"",
			password:""
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.login = this.login.bind(this);

	}
	handleInputChange({target}) {
		let {type, name} = target;
		let value = type === "checkbox" ? target.checked : target.value;
		this.setState({
			[name]:value
		});
	}
	login() {
		if(this.state.username === "David" && this.state.password === "1234") {
			store.dispatch(login(this.state.name));
		} else {
			alert("Usuario No Valido");
		}
	}
	render(){
		return (
			<div>
				<input onChange={this.handleInputChange} placeholder="Username" name="username" type="text" />
				<input onChange={this.handleInputChange} placeholder="Password" name="password" type="password" />
				<button onClick={this.login}>Sign In</button>
			</div>
		)
	}
}
