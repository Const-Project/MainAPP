import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: 환경변수(.env)로 분리 필요 (현재는 디버깅 및 테스트를 위해 하드코딩 또는 설정값 사용)
// 개발 서버용 임시 키 (실제 프로젝트 환경에 맞게 변경)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

console.log('[Supabase Setup] Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// AppState 변경 시 (앱이 백그라운드/포그라운드 전환 시) 세션 자동 갱신 처리
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    console.debug('[Supabase Setup] App became active, starting AutoRefresh');
    supabase.auth.startAutoRefresh();
  } else {
    console.debug('[Supabase Setup] App went to background, stopping AutoRefresh');
    supabase.auth.stopAutoRefresh();
  }
});
