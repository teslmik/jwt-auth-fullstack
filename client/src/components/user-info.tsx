import axios from 'axios';
import { useEffect } from 'react';

import { handlError } from '../helpers/error.helper';
import { AuthResponce, type UserType } from '../types/types';

type Properties = {
  user: UserType;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const ApiUrl = import.meta.env.VITE_APP_API_URL as string;

const UserInfo: React.FC<Properties> = ({ user, setIsAuth, setUser }) => {
  const checkAuth = async () => {
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
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
