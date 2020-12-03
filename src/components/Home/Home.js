import axios from 'axios';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
function Home(props) {
  useEffect(() => {
    axios.get('/user/me')
      .then(function (response) {
        if (response.status !== 200) {
          redirectToLogin()
        }
      })
      .catch(function (error) {
        redirectToLogin()
      });
  })
  function redirectToLogin() {
    props.history.push('/login');
  }
  return (
    <div className="mt-2">
      Home page content

    </div>
  )
}

export default withRouter(Home);