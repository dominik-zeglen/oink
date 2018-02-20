import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  inlineBlock: {
    display: 'inline-block',
    margin: '2rem 0',
  },
  label: {
    fontSize: theme.typography.headline.fontSize,
    color: theme.typography.headline.color,
    fontFamily: theme.typography.headline.fontFamily,
    textDecoration: 'none',
  },
});

function BreadcrumbLabel(props) {
  return (
    <div className={props.classes.inlineBlock}>
      <Link to={props.link} className={props.classes.label}>
        {props.label}
      </Link>
      {!props.last && (
      <span>&gt;</span>
    )}
    </div>
  );
}

BreadcrumbLabel.propTypes = {
  label: PropTypes.string,
  link: PropTypes.string,
  last: PropTypes.bool,
  classes: PropTypes.object,
};
BreadcrumbLabel.defaultProps = {
  label: 'Label',
  link: '',
  last: false,
};

export default withStyles(styles)(BreadcrumbLabel);
