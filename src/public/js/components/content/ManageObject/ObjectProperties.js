import React from 'react';

import {gQL, jsonStringify, makename} from '../../../utils';
import FieldInput from '../ManageModule/FieldInput';
import {FIELD_TYPES} from '../../../misc';


class ObjectProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      objectName: null,
      currentObject: {},
      currentModule: {}
    };
    this.removeObject = this.removeObject.bind(this);
    this.onChange = this.onChange.bind(this);
    this.objectDataUpdate = this.objectDataUpdate.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.objectId);
  }

  fetchData(id) {
    this.setState(() => ({
      loading: true
    }));
    const query = `{
      Object(id: "${id}") {
        _id
        name
        created_at
        parent_id
        module
        fields {
          name
          value
        }
      }
    }`;
    const success = (res) => {
      const afterQuery = `{
        ContainerBreadcrumb(id: "${res.data.Object.parent_id}") {
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
        let breadcrumb = res_b.data.ContainerBreadcrumb;
        breadcrumb.push(res.data.Object);
        this.props.updateBreadcrumb(breadcrumb);
        this.setState({
          loading: false,
          currentObject: res.data.Object,
          currentModule: res_b.data.Module
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
          RemoveModule(id: "${this.state.currentObject._id}")
        }
    `;
    const success = () => {
      this.props.history.push(this.props.returnPath);
    };
    const error = (e) => {
      console.log(e);
    };
    gQL(query, success, error);
  }

  addField() {
    const state = this.state;
    state.fields.push(Object.assign({}, newFieldTemplate));
    this.setState(state);
  }

  objectDataUpdate(e) {
    e.preventDefault();
    const fields = this.state.fields;
    const query = `
      mutation {
        UpdateObject(id: "${this.state.currentObject._id}", 
                     name: "${this.state.objectName}")
      }
    `;
    console.log(query);
    const success = () => {
      const fields_query = `[${fields.map((f) => jsonStringify(f))}]`;
      const query_addFields = `
        mutation {
          AddObjectFields(id: "${this.state.currentObject._id}",
                          fields: ${fields_query})
        }
      `;
      const success_addFields = () => {
        this.props.fetchData();
      };
      if(fields.length > 0) {
        gQL(query_addFields, success_addFields, error);
        this.props.history.push('/manage/modules/');
      } else {
        this.props.history.push('/manage/modules/');
      }
    };
    const error = () => {
    };
    gQL(query, success, error);
  }

  onChange(e) {
    const changeOnOff = (v) => {
      if (v === 'on') {
        return true;
      } else {
        if (v === 'off' || v === '' || v === undefined) {
          return false;
        } else {
          return v;
        }
      }
    };
    const state = this.state;
    state[e.target.name] = changeOnOff(e.target.value);
    this.setState(state);
  }

  onChangeFieldInput(e) {
    const state = this.state;
    const slug = e.target.name.split(':');
    const fieldAttr = slug[0].slice(13);
    state.fields[parseInt(slug[1])][fieldAttr] = e.target.value;
    this.setState(state);
  }

  render() {
    return <form className={'object-properties'} id={'object-update'} onSubmit={this.objectDataUpdate}>
      <div className={'row'}>
        <div className={'col s12 l7'}>
          <div className={'card row'}>
            <div className={'card-content'}>
              <div className={'input-field'}>
                <input placeholder={this.state.currentObject.name}
                       id={'object-name'} type={'text'} name={'object_name'} onChange={this.onChange}/>
                <label htmlFor={'object-name'} className={'active'}>Object name</label>
              </div>
              <div className={'card-title'}>
                Object's attributes
              </div>
              {this.state.currentObject.fields && this.state.currentObject.fields.map((f, i) => {
                return <div key={i}>
                  <div className={'input-field'}>
                    <input // value={f.value}
                           type={'text'}
                           name={'field-' + i}
                           id={'field-' + i} />
                    <label htmlFor={'field:' + i} className={'active'}>
                      {this.state.currentModule.fields[i].displayName}
                      </label>
                  </div>
                </div>;
              })}
            </div>
          </div>
        </div>
        <div className={'col s12 l5'}>
          <div className={'card'}>
            <div className={'card-content card-object-properties'}>
              <div>
                Created at: {this.state.currentObject.created_at}<br/>
              </div>
              <div>
                <button className={'btn-flat secondary-text'} type={'submit'} name={'action-update'}>
                  Update
                  <i className={'material-icons right'}>send</i>
                </button>
                {this.state.currentObject.parent_id != '-1' && (
                  <button className={'btn-flat red-text'} name={'action-remove'}
                          onClick={this.removeObject}>
                    Delete
                    <i className={'material-icons right'}>delete</i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>;
  }
}

export default ObjectProperties;