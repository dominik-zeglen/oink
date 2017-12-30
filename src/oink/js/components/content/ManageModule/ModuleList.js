import React from 'react';
import {Link} from 'react-router-dom';

import {gQL} from '../../../utils';
import AddButton from '../../AddButton';

class ModuleList extends React.Component {
  constructor(props) {
    super(props);
    this.addModule = this.addModule.bind(this);
  }

  addModule() {
    this.setState(() => ({
      loading: true
    }));
    const query = `
        mutation {
          NewModule(name: "New Module", fields: [])
        }`;
    const success = (res) => {
      this.setState((prevState) => ({
        loading: false,
      }));
      this.props.fetchData();
    };
    const error = (res) => {
      console.log(res);
    };

    gQL(query, success, error);
  }

  render() {
    return <div className={'row'}>
      <div className={'col s12 m6 l5'}>
        <div className={'collection'}>
          {(this.props.modules && this.props.modules.length > 0) ? (this.props.modules.map((c, i) => {
            return <div key={i} className={'collection-item'}>
              <Link to={c._id}>
                <div className={'collection-item-name'}>{c.name || ''}</div>
                <div className={'collection-item-desc'}>{c.description || ''}</div>
              </Link>
            </div>;
          })) : 'Looks like it\'s empty.'}
        </div>
        <AddButton action={this.addModule}/>
      </div>
    </div>;
  }
}

export {
  ModuleList as default,
};
