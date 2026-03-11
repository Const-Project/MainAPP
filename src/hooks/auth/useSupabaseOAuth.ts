import { useState } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/apis/supabase';
import { useBackendLogin } from './useBackendLogin';

WebBrowser.maybeCompleteAuthSession();

export const useSupabaseOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: backendLogin } = useBackendLogin();

  // Create redirect URI for our scheme
  const redirectUri = makeRedirectUri({
    scheme: 'haniumapp',
    path: 'auth/callback',
  });

  const performOAuth = async (provider: 'google' | 'kakao') => {
    setIsLoading(true);
    console.debug(`[SupabaseOAuth] performOAuth started for ${provider}`);
    console.debug(`[SupabaseOAuth] Redirect URI: ${redirectUri}`);

    try {
      // [STEP 1] Supabase Auth를 통해 제공자(Provider)의 OAuth 로그인 URL 획득
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true, // 직접 브라우저를 열기 위해 자동 리다이렉트 방지
        },
      });

      if (error) {
        console.error('[SupabaseOAuth] signInWithOAuth error:', error);
        throw error;
      }

      if (!data?.url) {
        console.error('[SupabaseOAuth] No URL returned from signInWithOAuth');
        throw new Error('No URL returned');
      }

      // [STEP 2] Expo WebBrowser를 사용하여 모바일 기기에 내장된 브라우저로 실제 로그인 페이지 오픈
      console.debug(`[SupabaseOAuth] Opening browser for URL: ${data.url}`);
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      
      console.debug('[SupabaseOAuth] Auth session result type:', result.type);

      if (result.type === 'success') {
        // [STEP 2-1] 리다이렉트 성공 시, 딥링크 URL 파싱
        const { url } = result;
        console.debug('[SupabaseOAuth] URL received on success. Parsing URL...');
        
        // App(React Native) 환경에서는 URL Hash Fragment(#) 부분에 토큰이 들어오는 경우가 많음
        const urlObj = new URL(url);
        const fragment = urlObj.hash.substring(1);
        const urlSearchParams = new URLSearchParams(fragment);
        let accessToken = urlSearchParams.get('access_token');
        let refreshToken = urlSearchParams.get('refresh_token');
        
        // 쿼리스트링(?) 형태인 경우를 대비한 Fallback
        if (!accessToken) {
          accessToken = urlObj.searchParams.get('access_token');
          refreshToken = urlObj.searchParams.get('refresh_token');
        }

        if (accessToken) {
          // [STEP 3] 토큰 추출 성공
          // 3-1. Supabase Local Session 설정 (앱 구동 내 상태 동기화)
          console.debug('[SupabaseOAuth] Access token parsed successfully. Logging into Supabase locally...');
          
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          // 3-2. 백엔드(Spring) 토큰 교환 호출 (useBackendLogin 참조)
          console.debug('[SupabaseOAuth] Sending access token to backend...');
          const backendRes = await backendLogin(accessToken);
          
          if (backendRes.isSuccess) {
            console.log('[SupabaseOAuth] Backend login complete!');
            return { 
              success: true, 
              isNewUser: backendRes.result?.newUser, 
              nickname: backendRes.result?.nickname 
            };
          } else {
            console.error('[SupabaseOAuth] Backend login failed with message:', backendRes.message);
            throw new Error(backendRes.message);
          }
        } else {
          console.warn('[SupabaseOAuth] No access token found in the URL. URL:', url);
          throw new Error('No access_token found in URL');
        }
      } else {
        console.warn(`[SupabaseOAuth] Browser closed or cancelled. Result type: ${result.type}`);
        return { success: false, cancelled: true };
      }
    } catch (err) {
      console.error('[SupabaseOAuth] Exception during performOAuth:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
      console.debug(`[SupabaseOAuth] performOAuth finished`);
    }
  };

  return { performOAuth, isLoading, redirectUri };
};
