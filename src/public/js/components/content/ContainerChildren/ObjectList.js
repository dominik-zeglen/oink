import React from 'react';
import {Link} from 'react-router-dom';

class ObjectList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={'row'}>
      <div className={'col s12 m6 l5'}>
        <div className={'collection'}>
          {(this.props.objects && this.props.objects.length > 0) ? (this.props.objects.map((o, i) => {
            return <div key={i} className={'collection-item'}>
              <Link to={'/manage/object/' + o._id} onClick={this.fetchData}>
                <div className={'collection-item-name'}>{o.name}</div>
                <div className={'collection-item-desc'}>{o.description}</div>
              </Link>
            </div>;
          })) : 'Looks like it\'s empty.'}
        </div>
      </div>
    </div>;
  }
}

export default ObjectList;