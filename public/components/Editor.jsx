class Editor extends React.Component {
	constructor() {
		super();
		this.state = {
			message:"",
			code:"",
			fileID: null,
			serverID: null
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentWillUnmount = this.componentWillUnmount.bind(this);

		this.CodeMirror = null;
		this.Socket = null;

		store.subscribe(() => {
			const {ID, content} = store.getState().file;
			this.setState({
				fileID: ID
			});
			this.CodeMirror.setValue(content);
		});
	}
	componentDidMount() {
		this.Socket = new WebSocket('ws://127.0.0.1:1337');
		const myTextArea = document.getElementById('editor');

		this.CodeMirror = CodeMirror.fromTextArea(myTextArea, {
			value: myTextArea.value,
			lineNumbers:true,
    		matchBrackets: true,
    		mode:"javascript",
    		theme:"darcula"
		});

		this.CodeMirror.on("change", e => this.Socket.send(
			JSON.stringify({
				ID: this.state.fileID,
				content: e.getValue()
			})
		));
		window.WebSocket = window.WebSocket || window.MozWebSocket;

		if (!window.WebSocket)
			this.setState({
				message: <p>Sorry, but your browser doesn't support WebSocket</p>
			});

		this.Socket.onopen = (a) => {console.log(a)}

		this.Socket.onerror = () => this.setState({
			message: <p>Sorry, but there's some problem with your connection or the server is down.</p>
		});

		this.Socket.onmessage = message => {
			try {
				if (message.data.startsWith("{")) {
					const {ID, content} = JSON.parse(message.data);
					if (ID === this.state.fileID && content !== this.CodeMirror.getValue())
						this.CodeMirror.setValue(content);
				}
				else {
					store.dispatch(setUserID(message.data));
					this.setState({
						serverID: message.data
					});
				}
			} catch(err) {
				console.log(err);
				this.setState({
					message: <p>Error to fetch data from server</p>
				})
			}
		};
		this.Socket.onclose = () => this.setState({
			message: <p>You are disconnected from the server</p>
		});
		this.interval = setInterval(this.handleTimeout, 3000);
	}
	handleTimeout(){
		if (this.Socket.readyState !== 1) {
			this.setState({
				message: <p>Unable to communicate with the WebSocket server.</p>
			});
		}
	}
	async createFile() {
		let res = await fetch(`/createfile/${this.p}`);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	render(){
		return(
			<div>
				<Files projectID={this.props.projectID}/>
				<div>{this.state.message}</div>
				<textarea id="editor"></textarea>
			</div>
		)
	}
}