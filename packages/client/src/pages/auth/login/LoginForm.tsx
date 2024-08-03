import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Spacer from '~components/atom/Spacer';
import Button from '~components/buttons/Button';
import TextField from '~components/form/TextField';
import useSnackbar from '~components/snckbar/hooks/useSnackbar';
import { useLoginMutation } from '~hooks/queries/authQueries';
import useMyAccountStore from '~store/useMyAccountStore';

interface LoginForm {
  email: string;
  password: string;
}

function LoginForm() {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const toggleIsPasswordOpen = () => setIsPasswordOpen((prev) => !prev);

  const { formState, register, handleSubmit } = useForm<LoginForm>({ mode: 'onBlur' });
  const { errors, isValid } = formState;

  const setMyAccount = useMyAccountStore(useShallow(({ setMyAccount }) => setMyAccount));

  const snackbar = useSnackbar();

  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLoginMutation();

  const onSubmit = handleSubmit((data: LoginForm) => {
    const mutation = async () => {
      const result = await mutateAsync(data);

      setMyAccount(result);
      navigate('/', { replace: true });

      return result;
    };

    snackbar.promise(mutation(), {
      pending: '로그인을 진행하는 중이에요.',
      success: ({ displayName }) => `${displayName}님 환영합니다. 좋은 하루 보내세요.`,
      error: '로그인 도중 오류가 발생했어요. 이메일/비밀번호를 확인해주세요.',
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <TextField
        {...register('email', {
          required: {
            value: true,
            message: '아이디(이메일)를 입력해주세요.',
          },
          pattern: {
            value: /^([\w-]|\.)+@([\w-]+\.)+[\w-]{2,4}$/,
            message: '이메일 형식에 맞게 입력해주세요.',
          },
        })}
        addonBefore={{
          type: 'ICON',
          icon: 'business/mail-line',
        }}
        message={errors.email?.message}
        placeholder="john.doe@example.com"
        isRequired
        isError={errors.email !== undefined}
      />
      <Spacer />
      <TextField
        {...register('password', {
          required: {
            value: true,
            message: '비밀번호를 입력해주세요.',
          },
        })}
        type={isPasswordOpen ? 'text' : 'password'}
        addonBefore={{
          type: 'ICON',
          icon: 'others/key-line',
        }}
        addonAfter={{
          type: 'ICON',
          icon: isPasswordOpen ? 'system/eye-line' : 'system/eye-off-line',
          onClick: toggleIsPasswordOpen,
        }}
        message={errors.password?.message}
        placeholder="Enter your password"
        isRequired
        isError={errors.password !== undefined}
      />
      <Spacer y={2} />
      <Button as="button" fullWidth isDisabled={!isValid} isLoading={isPending}>
        로그인 하기
      </Button>
    </form>
  );
}

export default LoginForm;
