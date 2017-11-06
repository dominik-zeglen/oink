import React from 'react';

class AddButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={'fixed-action-btn'} onClick={this.props.action}>
      <a className={'btn-floating btn-large waves-effect waves-light'}>
        <i className={'material-icons'}>add</i>
      </a>
    </div>;
  }
}

export {
  AddButton as default
};
