import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ApiUrl } from '../enums/api-url.enum';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../types/auth-request.type';
import { AuthResponce } from '../types/auth-responce.type';
import { UserType } from '../types/user.type';

const LoginForm: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserType>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isRegistered, setIsRegistered] = useState(true);
  const { handleSubmit, values, handleChange, resetForm } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      if (isAuth) {
        logout();
      } else if (isRegistered && !isAuth) {
        login(values);
      } else if (!isRegistered && !isAuth) {
        registration(values);
      }

      resetForm();
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlError = (error: any) => {
    console.log(error.response?.data?.message);
  }

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

  const checkAuth = async () => {
    try {
      const { data } = await axios.get<AuthResponce>(`${ApiUrl.API_URL}/refresh`, { withCredentials: true });
      localStorage.setItem('token', data.accessToken);
      setIsAuth(true);
      setUser(data.user);
    } catch (error) {
      handlError(error);
    }
  };

  const getUsers = async () => {
    try {
      const { data } = await UserService.fetchUsers();
      setUsers(data);
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
    <div>
      <h1>Anywhere in your app!</h1>
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
        {!isAuth &&
          (isRegistered ? (
            <p>
              Not registered? <span onClick={() => setIsRegistered(false)}>Follow to Registered</span>
            </p>
          ) : (
            <p>
              Registered? <span onClick={() => setIsRegistered(true)}>Follow to Login</span>
            </p>
          ))}
        <div className="btns">
          {!isAuth ? (
            <button type="submit">{isRegistered ? 'Login' : 'Registration'}</button>
          ) : (
            <button type="submit">Logout</button>
          )}
        </div>
      </form>
      <h2>
        {isAuth ? (
          <>
            <span>Login user:</span>
            <ul>
              <li>{`User: ${user && user.email}`}</li>
              <li>{`Activated: ${user && user.isActivated}`}</li>
            </ul>
            <div>
              <button onClick={getUsers} className="load-users">
                Load all users
              </button>
              <ul>
                {users.map((user, i) => (
                  <li key={user?.email}>
                    {`${i + 1}. `}{user?.email} - {user?.isActivated ? 'activated' : 'inactivated'}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          'No user logged in...'
        )}
      </h2>
    </div>
  );
};

export { LoginForm };
