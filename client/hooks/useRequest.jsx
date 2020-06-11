import Axios from 'axios';
import { useState } from 'react';

export default ({ url, method, data, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const runRequest = async () => {
    try {
      setErrors(null);
      const response = await Axios[method](url, data);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log(err.response.data);
      setErrors(<div>{err.response.data.errors.map((err) => err.msg)}</div>);
    }
  };
  return { runRequest, errors };
};
