import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/useRequest';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { runRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    data: { email, password },
    onSuccess: () => {
      Router.push('/');
    }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await runRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div>
        <label>Email Address</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input
          value={password}
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button>Sign Up</button>
      {errors}
    </form>
  );
};
