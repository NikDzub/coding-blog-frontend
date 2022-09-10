import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { LoginThunk } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';

import { Navigate } from 'react-router-dom';

import Spiner from '../../components/Spiner';
import { Button, Input, FormHelperText } from '@mui/material';

import styles from './Login.module.scss';

const Login = () => {
  const dispatch = useDispatch();

  const { user, status } = useSelector((state) => {
    return state.authReducer.auth;
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (loginData) => {
    dispatch(LoginThunk(loginData));
  };

  if (status === 'loading') {
    return <Spiner status={status}></Spiner>;
  }

  if (window.localStorage.getItem('token') && status === 'logged in') {
    return <Navigate to={'/'}></Navigate>;
  }

  return (
    <div className={styles.formWrap}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.section}>
          <Input
            placeholder="username"
            type="text"
            id="username"
            aria-describedby="username"
            {...register('username', {
              required: ' ',
              minLength: 4,
            })}
            error={Boolean(errors.username?.message)}
          />

          <FormHelperText id="username">
            {errors.username?.message}
          </FormHelperText>
        </div>

        <div className={styles.section}>
          <Input
            placeholder="password"
            type="password"
            id="password"
            aria-describedby="password"
            {...register('password', {
              required: ' ',
              minLength: 4,
            })}
            error={Boolean(errors.password?.message)}
          />

          <FormHelperText id="password">
            {errors.password?.message}
          </FormHelperText>
        </div>

        <div className={styles.section}>
          <Button disabled={!isValid} type="submit" variant="contained">
            Login
          </Button>
          {status === 'login error' && <p>{status}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
