import Axios from 'axios';

const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>;
};

export const getServerSideProps = async ({ req }) => {
  const response = await Axios.get(
    'http://auth-srv:3000/api/users/currentuser',
    { headers: req.headers }
  );
  return {
    props: {
      currentUser: response.data.currentUser
    }
  };
};

export default LandingPage;
