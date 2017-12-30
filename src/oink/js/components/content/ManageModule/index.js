import React from 'react';
import {Link} from 'react-router-dom';

import {gQL} from '../../../utils';
import Loading from '../../Loading';
import Breadcrumb from '../Breadcrumb';
import ModuleList from './ModuleList';
import ModuleProperties from './ModuleProperties';

function isEmpty(a) {
  if (typeof a === 'string') {
    a = a.replace(/s+/, '');
  }
  const nopes = [undefined, null, '', {}, []];
  return nopes.indexOf(a) !== -1;
}

class ManageModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      modules: [],
      breadcrumb: []
    };
    this.fetchData = this.fetchData.bind(this);
    this.updateBreadcrumb = this.updateBreadcrumb.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.match.params.id);
  }

  updateBreadcrumb(curr = []) {
    this.setState(() => ({
      breadcrumb: curr
    }));
  }

  fetchData() {
    this.setState(() => ({
      loading: true
    }));
    const query = `
        {
          Modules {
            _id
            name
            description
          }
        }`;
    const success = (res) => {
      this.setState((prevState) => ({
        loading: false,
        modules: res.data.Modules
      }));
      this.updateBreadcrumb([]);
    };
    const error = (res) => {
      console.error(res);
    };

    gQL(query, success, error);
  }

  render() {
    return <div>
      {this.state.loading ? <Loading/> : (
        <div>
          <Breadcrumb home={{_id: '/manage/modules/', name: 'Modules'}} breadcrumb={this.state.breadcrumb} fetchData={this.fetchData}/>
          {!isEmpty(this.props.match.params.id) ?
            <ModuleProperties moduleId={this.props.match.params.id}
                              updateBreadcrumb={this.updateBreadcrumb}
                              returnPath={'/manage/modules/'}
                              history={this.props.history}/> :
            <ModuleList modules={this.state.modules} fetchData={this.fetchData} updateBreadcrumb={this.updateBreadcrumb}/>
          }
        </div>
      )}
    </div>;
  }
}

export {
  ManageModule as default
};
