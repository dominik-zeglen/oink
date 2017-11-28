import React from 'react';
import {gQL} from '../../utils';

class ContainerProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      container_name: this.props.currentContainer.name,
      container_desc: this.props.currentContainer.description,
      container_visible: this.props.currentContainer.visible,
    };
    this.containerRemove = this.containerRemove.bind(this);
    this.onChange = this.onChange.bind(this);
    this.containerDataUpdate= this.containerDataUpdate.bind(this);
  }

  containerRemove(e) {
    e.preventDefault();
    const query = `
        mutation {
          RemoveContainer(id: "${this.props.currentContainer._id}")
        }
    `;
    const success = () => {
      this.props.history.push(this.props.currentContainer.parent_id);
    };
    const error = (e) => {
      console.log(e);
    };
    gQL(query, success, error);
  }

  containerDataUpdate(e) {
    e.preventDefault();
    const query = `
      mutation {
        UpdateContainer(id: "${this.props.currentContainer._id}", 
                        name: "${this.state.container_name}", 
                        description: "${this.state.container_desc}"
                        visible: ${this.state.container_visible})
      }
    `;
    const success = () => {
      this.props.fetchData();
    };
    const error = () => {};
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
    state[e.target.name] = changeOnOff(e.target.value) || ' ';
    this.setState(state);
  }

  render() {
    return <form className={'container-properties'} id={'container-update'} onSubmit={this.containerDataUpdate}>
      <div className={'row'}>
        <div className={'col s12 l7'}>
          <div className={'card row'}>
            <div className={'card-content'}>
              <div className={'input-field'}>
                <input placeholder={this.props.currentContainer.name}
                       id={'container-name'} type={'text'} name={'container_name'} onChange={this.onChange}/>
                <label htmlFor={'container-name'} className={'active'}>Container name</label>
              </div>
              <div className={'input-field'}>
                <input placeholder={this.props.currentContainer.description} id={'container-desc'}
                       type={'text'} name={'container_desc'} onChange={this.onChange}/>
                <label htmlFor={'container-desc'} className={'active'}>Container description</label>
              </div>
            </div>
          </div>
        </div>
        <div className={'col s12 l5'}>
          <div className={'card'}>
            <div className={'card-content card-container-properties'}>
              <div>
                Created at: {this.props.currentContainer.created_at}<br/>
              </div>
              <div>
                Visible:
                <div className={'switch d-inline-block'}>
                  <label>
                    <input type={'checkbox'} name={'container_visible'} onChange={this.onChange}/>
                    <span className={'lever'}/>
                  </label>
                </div>
              </div>
              <div>
                <button className={'btn-flat secondary-text'} type={'submit'} name={'action-update'}>
                  Update info
                  <i className={'material-icons right'}>send</i>
                </button>
                {this.props.currentContainer.parent_id != '-1' && (
                  <button className={'btn-flat red-text'} name={'action-remove'}
                          onClick={this.containerRemove}>
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

export default ContainerProperties;