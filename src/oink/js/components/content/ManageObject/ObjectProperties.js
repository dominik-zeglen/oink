import React from 'react';

import { gQL, jsonStringify } from '../../../utils';
import FieldInput from '../ManageModule/FieldInput';
import { FIELD_TYPES } from '../../../misc';


class ObjectProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objectName: null,
      objectFields: [],
      currentObject: {},
      currentModule: {},
    };
    this.removeObject = this.removeObject.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeFieldInput = this.onChangeFieldInput.bind(this);
    this.objectDataUpdate = this.objectDataUpdate.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.objectId);
  }

  fetchData(id) {
    this.setState(() => ({
      loading: true,
    }));
    const query = `{
      Object(id: "${id}") {
        _id
        name
        createdAt
        parentId
        module
        fields {
          name
          value
        }
      }
    }`;
    const success = (res) => {
      const afterQuery = `{
        ContainerBreadcrumb(id: "${res.data.Object.parentId}") {
          _id
          name
        }
        Module(id: "${res.data.Object.module}") {
          _id
          name
          fields {
            displayName
            name
            type
          }
        }
      }`;
      const success_breadcrumb = (res_b) => {
        const breadcrumb = res_b.data.ContainerBreadcrumb;
        breadcrumb.push(res.data.Object);
        this.props.updateBreadcrumb(breadcrumb);
        this.setState({
          loading: false,
          objectName: res.data.Object.name,
          objectFields: res.data.Object.fields.map(f => f.value),
          currentObject: res.data.Object,
          currentModule: res_b.data.Module,
        });
      };
      gQL(afterQuery, success_breadcrumb, error);
    };
    const error = (res) => {
      console.log(res);
    };
    gQL(query, success, error);
  }

  removeObject(e) {
    e.preventDefault();
    const query = `
      mutation {
        RemoveObject(id: "${this.state.currentObject._id}")
      }
    `;
    const success = () => {
      this.props.history.push(`/manage/list/${this.state.currentObject.parentId}`);
    };
    const error = (e) => {
      console.log(e);
    };
    gQL(query, success, error);
  }

  objectDataUpdate(e) {
    e.preventDefault();
    const fields = this.state.objectFields;
    const fields_query = fields.map((f, i) => ({ value: f, name: this.state.currentModule.fields[i].name }));
    // language=GraphQL
    const query = `
      mutation {
        UpdateObject(id: "${this.state.currentObject._id}", name: "${this.state.objectName}")
        UpdateObjectFields(id: "${this.state.currentObject._id}", fields: [${fields_query.map(f => jsonStringify(f))}])
      }
    `;
    const success = () => {
      this.props.history.push(`/manage/list/${this.state.currentObject.parentId}`);
    };
    const error = () => {
    };
    gQL(query, success, error);
  }

  onChange(e) {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onChangeFieldInput(e) {
    const state = this.state;
    const slug = e.target.name.split(':');
    state.objectFields[parseInt(slug[1])] = e.target.value;
    this.setState(state);
  }

  render() {
    return (<form className="object-properties" id="object-update" onSubmit={this.objectDataUpdate}>
      <div className="row">
        <div className="col s12 l7">
          <div className="card row">
            <div className="card-content">
              <div className="input-field">
                <input
                  value={this.state.objectName}
                  id="object-name"
                  type="text"
                  name="objectName"
                  onChange={this.onChange}
                />
                <label htmlFor="object-name" className="active">Object name</label>
              </div>
              {this.state.objectFields && this.state.objectFields.map((f, i) => (<div key={i}>
                <div className="input-field">
                  <label htmlFor={`field:${i}`} className="active">
                    {this.state.currentModule.fields[i].displayName}
                  </label>
                  {this.state.currentModule.fields[i].type === 'long' ?
                    <textarea
                      value={f}
                      name={`field:${i}`}
                      id={`field:${i}`}
                      onChange={this.onChangeFieldInput}
                      className="materialize-textarea"
                    />
                    : <input
                      value={f}
                      type="text"
                      name={`field:${i}`}
                      id={`field:${i}`}
                      onChange={this.onChangeFieldInput}
                    />
                  }
                </div>
              </div>))}
            </div>
          </div>
        </div>
        <div className="col s12 l5">
          <div className="card">
            <div className="card-content card-object-properties">
              <div>
                Created at: {this.state.currentObject.createdAt}<br />
              </div>
              <div>
                <button className="btn-flat secondary-text" type="submit" name="action-update">
                  Update
                  <i className="material-icons right">send</i>
                </button>
                {this.state.currentObject.parentId != '-1' && (
                  <button
                    className="btn-flat red-text"
                    name="action-remove"
                    onClick={this.removeObject}
                  >
                    Delete
                    <i className="material-icons right">delete</i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>);
  }
}

export default ObjectProperties;
