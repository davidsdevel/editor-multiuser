class CreateModal extends React.Component {
	constructor() {
		super();
		this.state = {
			name: ""
		}
		this.handleInput = this.handleInput.bind(this);
		this.createProject = this.createProject.bind(this);
	}
	handleInput({target}) {
		const {name, type} = target;
		const value = type === "checkbox" ? target.checked : target.value;

		this.setState({
			[name]: value
		});
	}
	async createProject() {
		try {
			const name = this.state.name;
			const res = await fetch(`/create/${name}`);
			await res.json();
			alert("Created");
			this.props.close();
			this.props.update();
		} catch(err) {
			alert("Cannot Create Project");
		}
	}
	render() {
		return (
			<div>
				<label htmlFor="name">Project Name*</label>
				<input type="text" name="name" placeholder="Project name" onChange={this.handleInput}/>
				<button onClick={this.props.close}>Cancel</button>
				<button onClick={this.createProject}>Create Project</button>
			</div>
		)
	}
}