import React from 'react';
import ReactDOM from 'react-dom';

import {FIELD_TYPES} from '../../../misc';


class FieldInput extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // $('select').material_select();
  }

  render() {
    return <div className={'row'}>
      <div className={'col m6 input-field'}>
        <input placeholder={this.props.field.displayName}
               id={'module-field-name:' + this.props.iterator}
               type={'text'}
               name={'module-field-name:' + this.props.iterator}
               disabled={this.props.disabled}
               onChange={this.props.onChange}/>
      </div>
      <div className={'col m6 input-field'}>
        <select name={'module-field-type:' + this.props.iterator} disabled={this.props.disabled}>
          {FIELD_TYPES.map((t, j) => {
            return <option value={t} key={j}>{t}</option>;
          })}
        </select>
        <label>Field type</label>
      </div>
    </div>;
  }
}

export {
  FieldInput as default
};
