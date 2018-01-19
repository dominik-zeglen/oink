import React from 'react';

import Breadcrumb from './Breadcrumb';
import ContainerProperties from './ContainerProperties';
import ContainerChildren from './ContainerChildren';
import Loading from '../Loading';
import AddButton from '../AddButton';
import { gQL, jsonStringify } from '../../utils';

class ManageCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      objects: [],
      modules: [],
      breadcrumb: [],
      loading: true,
    };

    this.fetchData = this.fetchData.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.addObject = this.addObject.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.match.params.id);
  }

  componentDidUpdate() {
    $('select').material_select();
    $('.modal').modal();
  }

  fetchData(_id) {
    const id = _id || this.props.match.params.id;
    if (id === id.toString()) {
      this.setState(() => ({
        loading: true,
      }));
      // language=GraphQL
      let query = `
        {
          ContainerChildren(parentId: "${id}") {
            _id
            name
            description
          }
          ContainerBreadcrumb(id: "${id}") {
            _id
            name
          }
          Objects(id: "${id}") {
            _id
            name
            visible
          }
          Modules {
            _id
            name
            fields {
              name
            }
          }`;
      if (id !== '-1') {
        query += `
          Container(id: "${id}") {
            _id
            name
            description
            visible
            createdAt
            parentId
          }
        }`;
      } else {
        query += `
        }`;
      }
      const success = (res) => {
        this.setState(prevState => ({
          categories: res.data.ContainerChildren,
          objects: res.data.Objects,
          modules: res.data.Modules,
          loading: false,
          breadcrumb: res.data.ContainerBreadcrumb,
          currentContainer: res.data.Container,
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
      loading: true,
    }));
    // language=GraphQL
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

  addObject(e) {
    e.preventDefault();
    const option = e.target.getElementsByTagName('select')[0].value;
    const module = option.split('::')[0];

    this.setState(() => ({
      loading: true,
    }));
    // language=GraphQL
    const query = `
        mutation {
          NewObject(parentId: "${this.props.match.params.id}",
                    name: "New Object",
                    module: "${module}") {
                    _id
                    }
        }`;
    const success = (res) => {
      this.fetchData();
    };
    const error = (res) => {
      console.log(res);
    };

    gQL(query, success, error);
  }

  addObjectModal() {
    $('#add-object-modal').modal('open');
  }

  render() {
    const actions = [
      { icon: 'create_new_folder', action: this.addContainer },
      { icon: 'receipt', action: this.addObjectModal },
    ];
    return (
      <div>
        <Breadcrumb fetchData={this.fetchData} breadcrumb={this.state.breadcrumb} home={{ _id: '-1', name: 'Containers' }} />
        {this.state.loading ? <Loading /> : (
          <div>
            {this.props.match.params.id != '-1' && (
            <ContainerProperties
              history={this.props.history}
              currentContainer={this.state.currentContainer}
              fetchData={this.fetchData}
            />
          )}
            <ContainerChildren
              fetchData={this.fetchData}
              categories={this.state.categories}
              objects={this.state.objects}
            />
            <AddButton action={actions} />
          </div>
      )}
        <div className="modal" id="add-object-modal">
          <form onSubmit={this.addObject}>
            <div className="modal-content">
              <select name="module">
                {this.state.modules.map((t, j) => (<option value={`${t._id}::${JSON.stringify(t.fields)}`} key={j}>{t.name}</option>))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary modal-action">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ManageCategoryList;
