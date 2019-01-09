class Editor extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			message:"",
			code:"",
			jsCodeMirror:"",
			connection:undefined
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentDidUpdate = this.componentDidUpdate.bind(this);
		this.componentWillUnmount = this.componentWillUnmount.bind(this);
	}
	componentDidMount(){
		let socket = new WebSocket('ws://127.0.0.1:1337');
		let myTextArea = document.getElementById('editor');
		var jsCodeMirror = CodeMirror.fromTextArea(myTextArea,{
			value: myTextArea.value,
			lineNumbers:true,
    		matchBrackets: true,
    		mode:"javascript",
    		theme:"darcula"
		})
		jsCodeMirror.on("change", e => {
			socket.send(JSON.stringify({
				type:"code",
				value:e.getValue()
			}));
		})
		window.WebSocket = window.WebSocket || window.MozWebSocket;
		if (!window.WebSocket) {
			this.state.message = <p>Sorry, but your browser doesn't support WebSocket.</p>
		}
		socket.onopen=()=>{}
		socket.onerror = error => {
			// just in there were some problems with connection...
			this.setState({
				message :<p>Sorry, but there's some problem with your connection or the server is down.</p>
			})
		};
		socket.onmessage = message => {
			try {
				if (message.data !== jsCodeMirror.getValue()) {
					jsCodeMirror.setValue(message.data)
				}
			} catch(err) {
				this.setState({
					message: <p>Error to fetch data from server</p>
				})
			}
		};
		socket.onclose=()=>{
			this.setState({
				message:<p>You are disconnected from the server</p>
			})
		}
		this.interval = setInterval(()=>this.handleTimeout(socket), 3000);
	}
	componentDidUpdate(data){
		console.log(this.jsCodeMirror)
		if (data !== this.state.code){
			console.log(data);
		}
	}
	handleTimeout(socket){
		if (socket.readyState !== 1) {
			this.setState({
				message: <p>Unable to communicate with the WebSocket server.</p>
			});
		}
	}
	componentWillUnmount(){
		removeInterval(this.interval);
	}
	render(){
		return(
			<div>
				<div>{this.state.message}</div>
				<textarea id="editor"></textarea>
			</div>
		)
	}
}