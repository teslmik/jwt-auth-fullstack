import { useState } from 'react';

import { handlError } from '../helpers/error.helper';
import { UserService } from '../services/user.service';
import { type UserType } from '../types/types';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  const getUsers = async () => {
    try {
      const { data } = await UserService.fetchUsers();
      setUsers(data);
    } catch (error) {
      handlError(error);
    }
  };

  return (
    <div>
      <button onClick={getUsers} className="load-users">
        Load all users
      </button>
      <ul>
        {users.map((user, i) => (
          <li key={user?.email}>
            {`${i + 1}. `}
            {user?.email} - {user?.isActivated ? 'activated' : 'inactivated'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { UsersList };

