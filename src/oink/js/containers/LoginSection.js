import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

import { loginUserAction } from '../actions';

const query = gql`
  query AuthUser($login: String!, $pass: String!) {
    Auth(login: $login, pass: $pass)
  }
`;
const styles = {
  card: {
    maxWidth: 400,
    margin: '0 auto',
  },
};

function mapStateToProps() {
  return {};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUserAction }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
@withApollo
@withStyles(styles)
class LoginSection extends Component {
  static propTypes = {
    classes: PropTypes.object,
    data: PropTypes.any,
  }
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      login: '',
      pass: '',
    };
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit() {
    this.props.client.query({
      query,
      variables: { ...this.state },
    }).then(({ data }) => {
      if (data.Auth) {
        this.props.loginUserAction(this.state.login);
      } else {
        this.setState({ displayError: true });
      }
    });
  }

  render() {
    return (
      <Card className={this.props.classes.card}>
        <form onSubmit={this.handleSubmit}>
          <CardContent>
            <TextField
              name="login"
              label="Login"
              onChange={this.handleInputChange}
              fullWidth
            />
            <TextField
              name="pass"
              label="Password"
              variant="password"
              onChange={this.handleInputChange}
              fullWidth
            />
          </CardContent>
          {this.state.displayError && (
            <span>Error!</span>
          )}
          <CardActions>
            <Button
              variant="raised"
              color="secondary"
              onClick={this.handleSubmit}
            >
              Login
            </Button>
          </CardActions>
        </form>
      </Card>
    );
  }
}

export default LoginSection;
