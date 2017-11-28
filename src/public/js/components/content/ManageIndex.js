import React from 'react';

class ManageIndex extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      formFields: {}
    };
  }

  login(e) {
    e.preventDefault();
    fetch('/manage/rest/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.formFields)
    }).then((r) => {
      return r.json();
    }).then((r) => {
      if (r.success) {
        this.props.userActions.changeUser(r.user);
      } else {
        this.onLoginReject();
      }
    });
  }

  onLoginReject() {
    this.setState({
      formClass: 'shake'
    });
    setTimeout(() => {
      this.setState({
        formClass: ''
      });
    }, 820);
  }

  onChange(e) {
    const t = e.currentTarget;
    const fields = this.state.formFields;
    fields[t.getAttribute('name')] = t.value;
    this.setState({
      formFields: fields
    });
  }

  render() {
    return <div>
      {this.props.userActions.user ? <div>
        Hello, {this.props.userActions.user.name}
      </div> : <div className={'row'}>
        <form onSubmit={this.login} className={'col s10 m6 l4 offset-s1 offset-m3 offset-l4 form--login ' + this.state.formClass}>
          <input className={'input-field'} placeholder={'login'}
                 onChange={this.onChange} name={'login'}/>
          <input className={'input-field'} placeholder={'pass'} type={'password'}
                 onChange={this.onChange} name={'pass'}/>
          <button className={'btn-action-primary right'}>Login</button>
        </form>
      </div>}
    </div>;
  }
}

export default ManageIndex;