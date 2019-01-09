class Dashboard extends React.Component {
	constructor() {
		super();
		this.state = {
			name:store.getState().account.name,
			pic:store.getState().account.profilePic,
			editing:false,
			data:[],
			folders:{}
		};
		this.selectProject = this.selectProject.bind(this);
		this.createProject = this.createProject.bind(this);
	}
	selectProject(id) {
		fetch("/projects/"+id)
			.then(res=>res.json())
			.then(data=>{
				console.log(data);
				this.setState({
					editing:true,
					folders:data
				})
			})
	}
	createProject() {
		fetch("/create?name=test")
		.then(res=>res.json())
		.then(data=> {
			this.setState({
				data:this.state.data.concat(data);
			})
		})
	}
	componentDidMount() {
		fetch("/projects/all")
		.then(res=>res.json())
		.then(data=>this.setState({
			data
		}))
		.catch(err=>{
			alert("Error al obtener Loa Projectos");
		})
	}
	render() {
		let projects = this.state.data.map(({name, id}, i) => (
			<li key={"li_"+id}>
				<span key={"Project_"+id} onClick={()=>this.selectProject(id)}>{name}</span>
				{data.length -1 > i && <hr key={"hr_"+id}/>}
			</li>
		))
		return (
			<div>
				<div>
					<button onClick={this.createProject}>Create Project</button>
					<span>ImageAcc</span>
				</div>
				{this.state.editing ?
					<Editor folders={this.state.folders}/>
					:
					<div>
						<ul>
						{projects}
						</ul>
					</div>
				}
			</div>
		)
	}
}