import React from 'react';

import Breadcrumb from './Breadcrumb';
import ContainerProperties from './ContainerProperties';
import ContainerChildren from './ContainerChildren';
import Loading from '../Loading';
import AddButton from '../AddButton';
import {gQL} from '../../utils';

class ManageCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      objects: [],
      breadcrumb: [],
      loading: true
    };

    this.fetchData = this.fetchData.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.match.params.id);
  }

  fetchData(_id) {
    const id = _id || this.props.match.params.id;
    if (id === id.toString()) {
      this.setState(() => ({
        loading: true
      }));
      const gqlParams = id !== '-1' ? `(parentId: "${id}")` : '';
      const query = `
        {
          ContainerChildren${gqlParams} {
            _id
            name
            description
          }          
          ContainerBreadcrumb(id: "${id}") {
            _id
            name
          }
          Container(id: "${id}") {
            _id
            name
            description
            visible
            created_at
            parent_id
          }
        }`;
      const success = (res) => {
        this.setState((prevState) => ({
          categories: res.data.ContainerChildren,
          loading: false,
          breadcrumb: res.data.ContainerBreadcrumb,
          currentContainer: res.data.Container
        }));
      };
      const error = (res) => {
        console.log(res);
      };

      gQL(query, success, error);
    }
  }

  addContainer() {
    this.setState(() => ({
      loading: true
    }));
    const query = `
        mutation {
          NewContainer(parentId: "${this.props.match.params.id}", name: "New Container")
        }`;
    const success = (res) => {
      this.fetchData();
    };
    const error = (res) => {
      console.log(res);
    };

    gQL(query, success, error);
  }

  render() {
    return <div>
      <Breadcrumb fetchData={this.fetchData} breadcrumb={this.state.breadcrumb} home={{_id: '-1', name: 'Containers'}}/>
      {this.state.loading ? <Loading/> : (
        <div>
          {this.props.match.params.id != '-1' && (
            <ContainerProperties history={this.props.history}
                                 currentContainer={this.state.currentContainer}
                                 fetchData={this.fetchData}/>
          )}
          <ContainerChildren fetchData={this.fetchData}
                             categories={this.state.categories}
                             objects={this.state.objects}/>
          <AddButton action={this.addContainer} />
        </div>
      )}
    </div>;
  }
}

export default ManageCategoryList;