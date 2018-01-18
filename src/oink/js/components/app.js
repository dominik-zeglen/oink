import React from 'react';

import Content from './content';
import Nav from './nav';

function renderApp(props) {
  return (
    <div>
      <Nav favourites={[props.favourites]} rootPath={props.rootPath} />
      <Content rootPath={props.rootPath} />;
    </div>
  );
}
export default renderApp;
