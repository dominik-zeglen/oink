import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import Content from './content';
import Nav from './nav';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false
    };
    this.changeUser = this.changeUser.bind(this);
  }

  changeUser(user) {
    this.setState({
      user
    });
  }

  render() {
    return <BrowserRouter>
      <div>
        <Nav favourites={this.props.favourites} rootPath={this.props.rootPath} user={this.state.user} />
        <Content rootPath={this.props.rootPath} user={this.state.user} changeUser={this.changeUser} />
      </div>
    </BrowserRouter>;
  }
}

export default App;