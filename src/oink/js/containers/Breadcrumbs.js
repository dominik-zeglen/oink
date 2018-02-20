import React from 'react';
import { connect } from 'react-redux';

import BreadcrumbLabel from '../components/BreadcrumbLabel';


function mapStateToProps(state) {
  return { breadcrumbs: state.breadcrumbs };
}
function Breadcrumbs(props) {
  return (
    <div>
      <BreadcrumbLabel link="/" label="Home" last={!(props.breadcrumbs && props.breadcrumbs.length)} />
      {props.breadcrumbs && props.breadcrumbs.length > 0 && props.breadcrumbs.map((breadcrumb, bIndex) => (
        <BreadcrumbLabel
          link={breadcrumb.link}
          label={breadcrumb.label}
          last={bIndex === (props.breadcrumbs.length - 1)}
        />
))}
    </div>
  );
}

export default connect(mapStateToProps)(Breadcrumbs);

