import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MuiLink from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { authClient } from '../../lib/auth/client';
import { isValidEmail, isValidPassword } from '../../lib/validate';
import { paths } from '../../paths';
import { userState } from '../../states/user.state';

export function SignInForm(): React.JSX.Element {
  const setUser = useSetRecoilState(userState);

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsPending(true);

    const { email, password } = data;

    if (!isValidEmail(email)) {
      setError('email', { message: '유효한 이메일 주소를 입력하세요.' });
      setIsPending(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError('password', { message: '유효한 비밀번호를 입력하세요.' });
      setIsPending(false);
      return;
    }

    const { nickname, role, error } = await authClient.login({ email, password });

    if (error) {
      setError('root', { type: 'server', message: error });
      setIsPending(false);
      return;
    }

    setUser({ nickname, role });
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">관리자 로그인</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && <FormHelperText>{errors.root.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password && <FormHelperText>{errors.root.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <div>
            <MuiLink component={RouterLink} to={paths.auth.resetPassword} variant="subtitle2">
              비밀번호를 잊으셨나요?
            </MuiLink>
          </div>
          {errors.root && <Alert color="error">{errors.root.message}</Alert>}
          <Button disabled={isPending} type="submit" variant="contained">
            로그인
          </Button>
        </Stack>
      </form>
      <Alert color="warning">회원가입은 별도로 문의해주세요. </Alert>
    </Stack>
  );
}
