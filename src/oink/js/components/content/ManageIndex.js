import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loginUser, loginUserError, loginUserSuccess } from '../../actions';

class ManageIndexVisual extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      formFields: {},
    };
  }

  login(e) {
    e.preventDefault();
    this.props.loginUser();
    fetch('/manage/rest/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.formFields),
    }).then(r => r.json()).then((r) => {
      if (r.success) {
        this.props.loginUserSuccess(r.user.name);
      } else {
        this.onLoginReject();
      }
    });
  }

  onLoginReject() {
    this.props.loginUserError();
    this.setState({
      formClass: 'shake',
    });
    setTimeout(() => {
      this.setState({
        formClass: '',
      });
    }, 820);
  }

  onChange(e) {
    const t = e.currentTarget;
    const fields = this.state.formFields;
    fields[t.getAttribute('name')] = t.value;
    this.setState({
      formFields: fields,
    });
  }

  render() {
    return (
      <div>
        {this.props.activeUser ? <div>Hello, {this.props.activeUser}</div> : (
          <div className="row">
            <form onSubmit={this.login} className={`col s10 m6 l4 offset-s1 offset-m3 offset-l4 form--login ${this.state.formClass}`}>
              <input
                className="input-field"
                placeholder="login"
                onChange={this.onChange}
                name="login"
              />
              <input
                className="input-field"
                placeholder="pass"
                type="password"
                onChange={this.onChange}
                name="pass"
              />
              <button className="btn-action-primary right">Login</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeUser: state.activeUser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUser, loginUserSuccess, loginUserError }, dispatch);
}

const ManageIndex = connect(mapStateToProps, mapDispatchToProps)(ManageIndexVisual);

export default ManageIndex;
