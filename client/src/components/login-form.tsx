import { useFormik } from 'formik';
import { useState } from 'react';

import { handlError } from '../helpers/error.helper';
import { AuthService } from '../services/auth.service';
import { FormButtons, UserInfo, UsersList } from './components';
import { type AuthRequest, type UserType } from '../types/types';

const LoginForm: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isRegistration, setIsRegistration] = useState(true);
  const [user, setUser] = useState<UserType>(null);

  const { handleSubmit, values, handleChange, resetForm } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      if (isAuth) {
        logout();
      } else if (isRegistration && !isAuth) {
        login(values);
      } else if (!isRegistration && !isAuth) {
        registration(values);
      }

      resetForm();
    },
  });

  const login = async (values: AuthRequest) => {
    try {
      const { data } = await AuthService.login(values);
      localStorage.setItem('token', data.accessToken);
      setIsAuth(true);
      setUser(data.user);
    } catch (error) {
      handlError(error);
    }
  };

  const registration = async (values: AuthRequest) => {
    try {
      const { data } = await AuthService.registration(values);
      localStorage.setItem('token', data.accessToken);
      setIsAuth(true);
      setUser(data.user);
    } catch (error) {
      handlError(error);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      setIsAuth(false);
      setUser(null);
    } catch (error) {
      handlError(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {!isAuth && (
          <>
            <label htmlFor="email">
              E-mail
              <input
                id="email"
                name="email"
                type="text"
                value={values.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </label>
          </>
        )}
        <FormButtons
          isAuth={isAuth}
          isRegistration={isRegistration}
          setIsRegistration={setIsRegistration}
        />
      </form>
      <div className="user-info">
        {isAuth ? (
          <>
            <UserInfo user={user} setIsAuth={setIsAuth} setUser={setUser} />
            <UsersList />
          </>
        ) : (
          'No user logged in...'
        )}
      </div>
    </>
  );
};

export { LoginForm };
