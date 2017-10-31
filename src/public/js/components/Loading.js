import React from 'react';

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={'loader'}>
      <div className={'preloader-wrapper big active'}>
        <div className={'spinner-layer spinner-blue-only'}>
          <div className={'circle-clipper left'}>
            <div className={'circle'} />
          </div>
          <div className={'gap-patch'}>
            <div className={'circle'} />
          </div>
          <div className={'circle-clipper right'}>
            <div className={'circle'} />
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Loading;