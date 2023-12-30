import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import AlertModal from '@/components/common/Modal/AlertModal';
import { FONT_16, FONT_20 } from '@/styles/FontStyles';
import { BLACK } from '@/styles/ColorStyles';
import { DEVICE_SIZE } from '@/styles/DeviceSize';
import { login } from '@/api/auth/login';
import { emailRules, signInPwRules } from '@/lib/constants/inputErrorRules';
import { useStore } from '@/context/stores';
import Head from 'next/head';

function Login() {
  const [message, setMessage] = useState('');
  const [isSuccess, setsSuccess] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const { modals, showModal, hideModal } = useStore((state) => ({
    modals: state.modals,
    showModal: state.showModal,
    hideModal: state.hideModal,
  }));

  const { isLoading, setAuthToken, setIsLoading, setError, setUser } = useStore();

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      setMessage('로그인에 성공했습니다.');
      setAuthToken(data.token);
      setUser(data.user);
      setIsLoading(false);
      showModal('customAlert');
      setsSuccess(true);
    },
    onError: (error: any) => {
      setMessage(error.message);
      setError(error.message);
      setIsLoading(false);
      showModal('customAlert');
      setsSuccess(false);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleLogin = (data: any) => {
    setIsLoading(true);
    mutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <>
      <Head>
        <title>로그인 | Taskify</title>
      </Head>
      <StyledRoot>
        <StyledContainer>
          <Link href="/">
            <StyledLogo src="/images/logo_main.svg" alt="Main logo" />
          </Link>
          <StyledWord>오늘도 만나서 반가워요!</StyledWord>
          <StyledForm onSubmit={handleSubmit(handleLogin)}>
            <Input type="email" register={register('email', emailRules)} error={errors.email} isHookForm />
            <Input
              type="password"
              isPassword
              register={register('password', signInPwRules)}
              error={errors.password}
              isHookForm
            />
            <StyledButtonWrapper>
              <Button.Plain style="primary" roundSize="L" isNotActive={isLoading}>
                로그인
              </Button.Plain>
              {isLoading && <Spinner />}
            </StyledButtonWrapper>
            <StyledWrapper>
              회원이 아니신가요? <Link href="/signup">회원가입하기</Link>
            </StyledWrapper>
          </StyledForm>
          {modals[modals.length - 1] === 'customAlert' && (
            <AlertModal type="customAlert" isSuccess={isSuccess}>
              {message}
            </AlertModal>
          )}
        </StyledContainer>
      </StyledRoot>
    </>
  );
}

export default Login;

const StyledRoot = styled.div`
  height: 100vh;
`;

const StyledContainer = styled.div`
  width: 100%;
  max-width: 520px;
  height: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledLogo = styled.img`
  width: 200px;
  height: 279px;
  @media (max-width: ${DEVICE_SIZE.mobile}) {
    width: 120px;
    height: 167px;
  }
`;

const StyledWord = styled.span`
  width: 189px;
  height: 24px;
  margin: 10px auto 38px;
  text-align: center;
  ${FONT_20};
`;

const StyledForm = styled.form`
  width: 100%;
`;

const StyledWrapper = styled.div`
  margin-top: 24px;
  text-align: center;
  ${FONT_16};
  color: ${BLACK[2]};
`;

const StyledButtonWrapper = styled.div`
  width: 100%;
  height: 50px;
`;
