import React from 'react';

import { gQL, jsonStringify, makename } from '../../../utils';
import FieldInput from './FieldInput';
import AddButton from '../../AddButton';
import { FIELD_TYPES } from '../../../misc';

const newFieldTemplate = {
  displayName: 'New field',
  type: FIELD_TYPES[0],
};


class ModuleProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      module_name: null,
      module_desc: null,
      currentModule: {},
    };
    this.removeModule = this.removeModule.bind(this);
    this.onChange = this.onChange.bind(this);
    this.moduleDataUpdate = this.moduleDataUpdate.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onChangeFieldInput = this.onChangeFieldInput.bind(this);
    this.addField = this.addField.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.moduleId);
  }

  fetchData(id) {
    this.setState(() => ({
      loading: true,
    }));
    const query = `{
      Module(id: "${id}") {
        _id
        name
        description
        createdAt
        fields {
          displayName
          name
          type
        }
      }
    }`;
    const success = (res) => {
      this.setState(prevState => ({
        loading: false,
        currentModule: res.data.Module,
        module_name: res.data.Module.name,
        module_desc: res.data.Module.description,
        fields: [],
      }));
      this.props.updateBreadcrumb([res.data.Module]);
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
          RemoveModule(id: "${this.state.currentModule._id}")
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
        UpdateModule(id: "${this.state.currentModule._id}",
                     name: "${this.state.module_name}",
                     description: "${this.state.module_desc}")
      }
    `;
    const success = () => {
      const fields_query = `[${fields.map(f => jsonStringify(f))}]`;
      const query_addFields = `
        mutation {
          AddModuleFields(id: "${this.state.currentModule._id}",
                          fields: ${fields_query})
        }
      `;
      const success_addFields = () => {
        this.props.fetchData();
      };
      if (fields.length > 0) {
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
      }
      if (v === 'off' || v === '' || v === undefined) {
        return false;
      }
      return v;
    };
    const state = this.state;
    state[e.target.name] = changeOnOff(e.target.value);
    this.setState(state);
  }

  onChangeFieldInput(e) {
    const state = this.state;
    const slug = e.target.name.split(':');
    const fieldAttr = slug[0].slice(13);
    state.fields[slug[1]].displayName = e.target.value;
    // state.fields[parseInt(slug[1])].type = $(e.target).parent().parent().find('input.select-dropdown')
    //  .val();
    this.setState(state);
  }

  componentDidUpdate(pp, ps, pc) {
    // $('select').material_select();
  }

  render() {
    return (<form className="module-properties" id="module-update" onSubmit={this.moduleDataUpdate}>
      <div className="row">
        <div className="col s12 l7">
          <div className="card row">
            <div className="card-content">
              <div className="input-field">
                <input
                  placeholder={this.state.currentModule.name}
                  id="module-name"
                  type="text"
                  name="module_name"
                  onChange={this.onChange}
                />
                <label htmlFor="module-name" className="active">Module name</label>
              </div>
              <div className="input-field">
                <input
                  placeholder={this.state.currentModule.description}
                  id="module-desc"
                  type="text"
                  name="module_desc"
                  onChange={this.onChange}
                />
                <label htmlFor="module-desc" className="active">Module description</label>
              </div>
              {this.state.currentModule.fields && this.state.currentModule.fields.map((f, i) => (<FieldInput
                field={f}
                iterator={i}
                disabled
                key={i}
              />))}
              {this.state.fields.map((t, i) => (<FieldInput
                iterator={i}
                onChange={this.onChangeFieldInput}
                disabled={false}
                key={i}
                field={t}
              />))}
            </div>
          </div>
        </div>
        <div className="col s12 l5">
          <div className="card">
            <div className="card-content card-module-properties">
              <div>
                Created at: {this.state.currentModule.createdAt}<br />
              </div>
              <div>
                <button className="btn-flat secondary-text" type="submit" name="action-update">
                  Update
                  <i className="material-icons right">send</i>
                </button>
                {this.state.currentModule.parentId != '-1' && (
                  <button
                    className="btn-flat red-text"
                    name="action-remove"
                    onClick={this.removeModule}
                  >
                    Delete
                    <i className="material-icons right">delete</i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <AddButton action={this.addField} />
      </div>
            </form>);
  }
}

export default ModuleProperties;
