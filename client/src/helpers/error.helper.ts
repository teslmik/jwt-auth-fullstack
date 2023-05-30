// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlError = (error: any) => {
  console.log(error.response?.data?.message);
};

export { handlError };
