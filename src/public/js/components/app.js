import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import Content from './content';
import Nav from './nav';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <BrowserRouter>
      <div>
        <Nav favourites={this.props.favourites} rootPath={this.props.rootPath} />
        <Content rootPath={this.props.rootPath} />
      </div>
    </BrowserRouter>;
  }
}

export default App;