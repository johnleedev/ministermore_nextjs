// app/fonts.ts
import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    { path: './fonts/Pretendard-Thin.ttf', weight: '100', style: 'normal' },
    { path: './fonts/Pretendard-Light.ttf', weight: '300', style: 'normal' },
    { path: './fonts/Pretendard-Regular.ttf', weight: '500', style: 'normal' },
    { path: './fonts/Pretendard-SemiBold.ttf', weight: '700', style: 'normal' },
    { path: './fonts/Pretendard-Bold.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-pretendard', // CSS 변수로 사용하고 싶을 때
});