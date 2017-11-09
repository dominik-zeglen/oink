import React from 'react';

import {gQL, jsonStringify, makename} from '../../../utils';
import FieldInput from '../ManageModule/FieldInput';
import AddButton from '../../AddButton';
import {FIELD_TYPES} from '../../../misc';


class ObjectProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      module_name: null,
      module_desc: null,
      currentObject: {}
    };
    this.removeModule = this.removeModule.bind(this);
    this.onChange = this.onChange.bind(this);
    this.moduleDataUpdate = this.moduleDataUpdate.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onChangeFieldInput = this.onChangeFieldInput.bind(this);
    this.addField = this.addField.bind(this);
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
      }
    }`;
    const success = (res) => {
      const query_breadcrumb = `{
        ContainerBreadcrumb(id: "${res.data.Object.parent_id}") {
          _id
          name
        }
      }`;
      const success_breadcrumb = (res_b) => {
        let breadcrumb = res_b.data.ContainerBreadcrumb;
        breadcrumb.push(res.data.Object);
        this.props.updateBreadcrumb(breadcrumb);
        this.setState((prevState) => ({
          loading: false,
          currentObject: res.data.Object,
        }));
      };
      gQL(query_breadcrumb, success_breadcrumb, error);
    };
    const error = (res) => {
      console.log(res);
    };
    gQL(query, success, error);
  }

  removeModule(e) {
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

  moduleDataUpdate(e) {
    e.preventDefault();
    const fields = this.state.fields;
    const query = `
      mutation {
        UpdateModule(id: "${this.state.currentObject._id}", 
                     name: "${this.state.module_name}", 
                     description: "${this.state.module_desc}")
      }
    `;
    console.log(query);
    const success = () => {
      const fields_query = `[${fields.map((f) => jsonStringify(f))}]`;
      const query_addFields = `
        mutation {
          AddModuleFields(id: "${this.state.currentObject._id}",
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
    if(fieldAttr === 'name') {
      state.fields[slug[1]]['displayName'] = makename(e.target.value);
      state.fields[parseInt(slug[1])]['type'] = $(e.target).parent().parent().find('input.select-dropdown').val();

    }
    this.setState(state);
  }

  componentDidUpdate(pp, ps, pc) {
    $('select').material_select();
  };

  render() {
    return <form className={'object-properties'} id={'object-update'} onSubmit={this.moduleDataUpdate}>
      <div className={'row'}>
        <div className={'col s12 l7'}>
          <div className={'card row'}>
            <div className={'card-content'}>
              <div className={'input-field'}>
                <input placeholder={this.state.currentObject.name}
                       id={'object-name'} type={'text'} name={'module_name'} onChange={this.onChange}/>
                <label htmlFor={'object-name'} className={'active'}>Module name</label>
              </div>
              <div className={'input-field'}>
                <input placeholder={this.state.currentObject.description} id={'object-desc'}
                       type={'text'} name={'module_desc'} onChange={this.onChange}/>
                <label htmlFor={'object-desc'} className={'active'}>Module description</label>
              </div>
              {this.state.currentObject.fields && this.state.currentObject.fields.map((f, i) => {
                return <FieldInput field={f}
                                   iterator={i}
                                   disabled={true}
                                   key={i}/>;
              })}
              {this.state.fields.map((t, i) => {
                return <FieldInput iterator={i}
                                   onChange={this.onChangeFieldInput}
                                   disabled={false}
                                   key={i}
                                   field={t}/>;
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
        <AddButton action={this.addField} />
      </div>
    </form>;
  }
}

export default ObjectProperties;