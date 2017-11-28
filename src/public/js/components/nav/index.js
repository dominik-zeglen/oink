import React from 'react';
import {Link} from 'react-router-dom';

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <header>
      <nav className={'top-nav'} id={'top-nav'}>
        <div className={'nav-wrapper'}>
          <ul className={'left'}>
            <li>
              <Link to={'#'}
                 data-activates="side-nav"
                 className={'button-collapse hide-on-large-only'}
                 id={'toggle-menu'}>
                <i className={'fa fa-bars'}> </i>
              </Link>
            </li>
            <li>
              <Link to={'/'}>Oink!</Link>
            </li>
          </ul>
          {this.props.user && <ul className={'side-nav fixed'} id={'side-nav'}>
            <li className={'nav-home'}>
              <Link to={this.props.rootPath}>Home</Link>
            </li>
            {this.props.favourites ?
              <li className={'side-nav-section'}>
                <p>Favourites</p>
                <ul>
                  {this.props.favourites.map((f, i) => {
                    return <li key={i}>
                      <Link to={this.props.rootPath + f.link}>{f.label}</Link>
                    </li>;
                  })}
                </ul>
              </li> : null}
            <li className={'side-nav-section'}>
              <p>Manage</p>
              <ul>
                <li>
                  <Link to={this.props.rootPath + '/list/-1'}>List</Link>
                </li>
                <li>
                  <Link to={this.props.rootPath + '/modules/'}>Modules</Link>
                </li>
              </ul>
            </li>
            <li className={'side-nav-section'}>
              <p>Settings</p>
              <ul>
                <li>
                  <Link to={this.props.rootPath + '/site/'}>Site</Link>
                </li>
                <li>
                  <Link to={this.props.rootPath + '/seo/'}>SEO</Link>
                </li>
              </ul>
            </li>
          </ul>}
        </div>
      </nav>
    </header>;
  }
}

export default Nav;