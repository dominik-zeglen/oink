import React, { Component } from 'react';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

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

class LoginSection extends Component {
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
    this.props.data.refetch({
      login: this.state.login,
      pass: this.state.pass,
    });
  }

  render() {
    return (
      <Card className={this.props.classes.card}>
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
        <CardActions>
          <Button
            variant="raised"
            color="secondary"
            onClick={this.handleSubmit}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default graphql(query, {
  options: {
    variables: {
      login: '',
      pass: '',
    },
  },
})(withStyles(styles)(LoginSection));
