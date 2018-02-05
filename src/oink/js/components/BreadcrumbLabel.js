import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const styles = {
  inlineBlock: {
    display: 'inline-block',
  },
  label: {
    fontSize: '1.5rem',
  },
};
const component = props => (
  <div style={styles.inlineBlock}>
    <Link to={props.link}>
      <span>{props.label}</span>
    </Link>
    {!props.last && (
    	<span>&gt;</span>
		)}
  </div>
);

component.propTypes = {
  label: PropTypes.string,
  link: PropTypes.string,
  last: PropTypes.bool,
};
component.defaultProps = {
  label: 'Label',
  link: '',
  last: false,
};

export default component;
