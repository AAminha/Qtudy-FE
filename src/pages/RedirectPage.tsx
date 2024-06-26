import { getAuthKakao, postLogin } from '@/apis/authApi';
import authState from '@/recoils/atoms/authState';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

function RedirectPage() {
  const navigate = useNavigate();
  const code = new URL(document.location.toString()).searchParams.get('code');
  const setIsAuthenticated = useSetRecoilState(authState);

  const login = useCallback(async () => {
    if (!code) return;

    try {
      const kakaoRes = await getAuthKakao(code);
      const loginRes = await postLogin(kakaoRes.access_token);
      localStorage.setItem('accessToken', loginRes.accessToken);
      localStorage.setItem('refreshToken', loginRes.refreshToken);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {}
  }, [code, navigate, setIsAuthenticated]);

  useEffect(() => {
    if (!code) return;
    login();
  }, [code, login]);

  return null;
}

export default RedirectPage;
