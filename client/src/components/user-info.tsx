import axios from 'axios';
import { useCallback, useEffect } from 'react';

import { handlError } from '../helpers/error.helper';
import { AuthResponce, type UserType } from '../types/types';

type Properties = {
  user: UserType;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const ApiUrl = import.meta.env.VITE_APP_API_URL as string;

const UserInfo: React.FC<Properties> = ({ user, setIsAuth, setUser }) => {
  const checkAuth = useCallback(() => async () => {
    try {
      const { data } = await axios.get<AuthResponce>(
        `${ApiUrl}/refresh`,
        { withCredentials: true },
      );
      localStorage.setItem('token', data.accessToken);
      setIsAuth(true);
      setUser(data.user);
    } catch (error) {
      handlError(error);
    }
  }, [setIsAuth, setUser]) ;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, [checkAuth]);
  
  return (
    <>
      <span>Login user:</span>
      <ul>
        <li>{`User: ${user && user.email}`}</li>
        <li>{`Activated: ${user && user.isActivated}`}</li>
      </ul>
    </>
  );
};

export { UserInfo };
