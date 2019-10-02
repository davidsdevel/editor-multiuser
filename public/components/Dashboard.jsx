class Dashboard extends React.Component {
	constructor() {
		super();
		this.state = {
			fetching: null,
			haveProjects: null,
			editing: false,
			showCreateModal: false,
			data: [],
			projectID: null
		};
		this.selectProject = this.selectProject.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.fetchProjects = this.fetchProjects.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	async selectProject(id) {
		try {
			const res = await fetch("/projects/"+id);
			const data = await res.text();
			this.setState({
				editing:true,
				projectID: id
			});
		} catch(err) {
			console.log(err);
			alert("Unable To Get Project Data");
		}
	}
	componentDidMount() {
		this.fetchProjects();
	}
	async fetchProjects() {
		this.setState({
			fetching: true
		});
		try {
			const res = await fetch("/projects/all");
			const data = await res.json();
			if (data.length === 0) {
				this.setState({
					haveProjects: false
				});
			}
			else {
				this.setState({
					data
				});
				this.setState({
					haveProjects: true
				});
			}
			this.setState({
				fetching: false
			});
		} catch(err) {
			alert("Error al obtener Los Proyectos");
		}
	}
	toggleModal() {
		this.setState({
			showCreateModal: !this.state.showCreateModal
		});
	}
	render() {
		const projects = this.state.data.map(({name, ID}, i) => (
			<li key={"li_"+ID}>
				<span key={"Project_"+ID} onClick={() => this.selectProject(ID)}>{name}</span>
				{this.state.data.length -1 > i && <hr key={"hr_"+ID}/>}
			</li>
		));

		var layout;
		if (this.state.fetching) {
			layout = <div>
				<span>Getting Projects...</span>
			</div>
		} else {
			if (this.state.editing) {
				layout = <Editor projectID={this.state.projectID}/>;
			} else {
				if (this.state.haveProjects) {
					layout = <div>
						<ul>
						{projects}
						</ul>
					</div>;
				} else {
					layout = <div>
						<span>Don't Have Projects</span>
						<button onClick={this.toggleModal}>Create Project</button>
					</div>
				}
			}
		}
		var modal;
		if (this.state.showCreateModal) {
			modal = <CreateModal close={this.toggleModal} update={this.fetchProjects}/>;
		}
		return (
			<div>
				<div>
					<button onClick={this.toggleModal}>+</button>
				</div>
				{layout}
				{modal}
			</div>
		)
	}
}