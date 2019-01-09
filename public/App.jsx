class App extends React.Component {
	constructor() {
		super();
		this.state = {
			logged:true
		};
		store.subscribe(() => this.setState({
			logged:store.getState().account.logged
		}));
	}
	render() {
		return (
			<div>
				{this.state.logged ?
					<Dashboard/>
					:
					<Login/>
				}
			</div>
		)
	}
}