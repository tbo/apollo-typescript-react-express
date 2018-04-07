import * as React from 'react';
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

const Login = () => (
  <Container>
    <Card className='card'>
      <form>
        <p className='h4 text-center mb-4'>Sign in</p>

        <label className='grey-text'>Your username</label>
        <input type='text' className='form-control'/>

        <br/>

        <label className='grey-text'>Your password</label>
        <input type='password' className='form-control'/>

        <div className='text-center mt-4'>
          <button className='btn btn-indigo' type='submit'>Login</button>
        </div>
      </form>
    </Card>
  </Container>
);

export default Login;
