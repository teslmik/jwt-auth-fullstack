type Properties = {
  isAuth: boolean;
  isRegistration: boolean;
  setIsRegistration: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormButtons: React.FC<Properties> = ({
  isAuth,
  isRegistration,
  setIsRegistration,
}) => {
  return (
    <>
      {!isAuth &&
        (isRegistration ? (
          <p>
            Not registered?{' '}
          <span onClick={() => setIsRegistration(false)}>
              Follow to Registered
            </span>
          </p>
        ) : (
          <p>
            Registered?{' '}
            <span onClick={() => setIsRegistration(true)}>Follow to Login</span>
          </p>
        ))}
      <div className="btns">
        {!isAuth ? (
          <button type="submit">
            {isRegistration ? 'Login' : 'Registration'}
          </button>
        ) : (
          <button type="submit">Logout</button>
        )}
      </div>
    </>
  );
};

export { FormButtons };
