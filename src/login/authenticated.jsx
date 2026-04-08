import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponseState } from '../profile/responseState';

export function Authenticated(props) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.responseState === ResponseState.NotResponded) {
      navigate('/prompt');
    } else {
      navigate('/feed');
    }
  }, []);

  function logout() {
    props.onLogout();
  }

  return;
}
