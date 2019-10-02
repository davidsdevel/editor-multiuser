class Files extends React.Component {
	constructor() {
		super();
		this.state = {
			files: [],
			userID: null
		};
		store.subscribe(() => {
			const {userID} = store.getState().user;
			this.setState({
				userID
			});
		})
	}
	async componentDidMount() {
		try {
			const res = await fetch(`/file/${this.props.projectID}/all/0`);
			const files = await res.json();
			this.setState({
				files
			});
		} catch(err) {
			alert("Unable To Get Project Data");
		}
	}
	async selectFile(fileID, name) {
		try {
			const res = await fetch(`/file/${this.props.projectID}/${fileID}/${this.state.userID}`);
			const data = await res.text();
			store.dispatch(setFile(fileID, name, data));
		} catch(err) {
			alert("Unable To Get File");
		}
	}
	mapFiles() {
		const files = this.state.files.sort((a, b) => {
			const matchA = a.path.match(/\//g).lenght;
			const matchB = b.path.match(/\//g).lenght;

			if (matchA > matchB)
				return matchA + 1;

			return matchA - 1;
		});

		const map = id => files.map(({type, path, filename, ID}) => {

			if (path === id) {

				if (type === "folder") {
					const folderName = path.match(/\w*\/$/)[0];
					
					return <li>
						<span class="folder">{folderName.replace("/", "")}</span>
						<ul id={path}>{map(path)}</ul>
					</li>;
				}
				else
					return <li onClick={() => this.selectFile(ID, filename)}>{filename}</li>;
			}
		});

		return <ul id="/">{map("/")}</ul>;
	}
	render() {
		const files = this.mapFiles();
		return (
			<div id="folders">
				<span>Project Folders</span>
				<button onClick={this.createFile}>Create File</button>
				<button onClick={this.createFolder}>Create Folder</button>
				{files}
			</div>
		)
	}
}