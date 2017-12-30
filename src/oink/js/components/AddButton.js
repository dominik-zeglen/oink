import React from 'react';

class AddButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={'fixed-action-btn ' + (Array.isArray(this.props.action) ? 'vertical click-to-toggle' : '')}
                onClick={Array.isArray(this.props.action) ? null : this.props.action}>
      <a className={'btn-floating btn-large waves-effect waves-light'}>
        <i className={'material-icons'}>add</i>
      </a>
      {Array.isArray(this.props.action) &&
      <ul>
        {this.props.action.map((a, i) => {
          return <li key={i}>
            <a className={'btn-floating'} onClick={a.action}>
              <i className={'material-icons'}>{a.icon}</i>
            </a>
          </li>;
        })
        }
      </ul>
      }
    </div>;
  }
}

export {
  AddButton as default
};
