import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  margin-right: auto;
  margin-left: auto;
  padding: 20px;
  margin-bottom: 200px;
`;

class Login extends React.Component<RouteComponentProps<any>> {
  public state = {hasFailed: false};

  private username: HTMLInputElement;
  private password: HTMLInputElement;

  private authenticate = (event) => {
    event.preventDefault();
    this.setState({hasFailed: false});
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 401) {
          this.setState({hasFailed: true});
        } else {
          this.props.history.push('/');
        }
      }
    };
    xhr.open('POST', '/authenticate', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({username: this.username.value, password: this.password.value}));
  }

  public render() {
    return (
      <Container>
        <Card className='card'>
          <form onSubmit={this.authenticate}>
            <p className='h4 text-center mb-4'>Sign in</p>

            {this.state.hasFailed && <div className='alert alert-danger'>Invalid credentials</div>}
            <label className='grey-text'>Your username</label>
            <input type='text' className='form-control' ref={ref => this.username = ref}/>

            <br/>

            <label className='grey-text'>Your password</label>
            <input type='password' className='form-control' ref={ref => this.password = ref}/>

            <div className='text-center mt-4'>
              <button className='btn btn-indigo' type='submit' onClick={this.authenticate}>Login</button>
            </div>
          </form>
        </Card>
      </Container>
    );
  }
}

export default withRouter(Login);
