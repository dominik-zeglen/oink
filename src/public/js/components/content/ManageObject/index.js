import React from 'react';
import {Link} from 'react-router-dom';

import {gQL} from '../../../utils';
import Loading from '../../Loading';
import Breadcrumb from '../Breadcrumb';
import ObjectProperties from './ObjectProperties';

function isEmpty(a) {
  if (typeof a === 'string') {
    a = a.replace(/s+/, '');
  }
  const nopes = [undefined, null, '', {}, []];
  return nopes.indexOf(a) !== -1;
}

class ManageObject extends React.Component {
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

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.match.params.id);
  }

  componentDidMount() {
    this.fetchData();
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
      this.setState({
        loading: false,
        modules: res.data.Modules
      });
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
          <Breadcrumb home={{_id: '/manage/list/-1', name: 'Containers'}}
                      breadcrumb={this.state.breadcrumb}
                      fetchData={this.fetchData}
                      returnPath={'/manage/list/'}/>
          <ObjectProperties objectId={this.props.match.params.id}
                            updateBreadcrumb={this.updateBreadcrumb}
                            returnPath={'/manage/list/-1'}
                            history={this.props.history}/>
        </div>
      )}
    </div>;
  }
}

export {
  ManageObject as default
};
