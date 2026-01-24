'use client';

import { useEffect } from "react";
import axios from "axios";
import '../Login.scss'
import { useRouter, useSearchParams } from 'next/navigation';
import MainURL from "../../MainURL";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { recoilKaKaoLoginData, recoilLoginPath, recoilLoginState, recoilNaverLoginData, recoilUserData } from "../../RecoilStore";

export default function LoginSnsPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  
  const setIsLogin = useSetRecoilState(recoilLoginState);
  const setUserData = useSetRecoilState(recoilUserData);
  const loginPath = useRecoilValue(recoilLoginPath);
  const kakaoLoginData = useRecoilValue(recoilKaKaoLoginData);
  const naverLoginData = useRecoilValue(recoilNaverLoginData);

  const KAKAO_API_KEY = kakaoLoginData.APIKEY;
  const KAKAO_REDIRECT_URI = kakaoLoginData.REDIRECT_URI_Auth;

  const NAVER_CLIENT_ID = naverLoginData.CLIENTID;
  const NAVER_SECRET = naverLoginData.SECRET;
  const NAVER_STATE = "sdfsdfsdf";

  const requestToken = async () => { 
    if (code && !state) {
    axios
      .post(`${MainURL}/api/login/loginsnstoken`, {
        sort : 'kakao',
        client_id: KAKAO_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
        secret : '',
        state : ''
      })
      .then((res) => {
        axios
          .post(`${MainURL}/api/login/login`, {
            url: 'kakao',
            AccessToken: res.data,
          })
          .then((res: any) => {
            if (res.data.isUser === true) {
              console.log('res.data.isUser', res.data.isUser);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              setIsLogin(true);
              setUserData({
                userAccount : res.data.userAccount,
                userNickName : res.data.userNickName,
                userChurch : res.data.userChurch,
                userSort: res.data.userSort,
                userDetail: res.data.userDetail,
                grade: res.data.grade,
                authInstitution : res.data.authInstitution,
                authChurch : res.data.authChurch,
                authDepartment : res.data.authDepartment,
                authGroup: res.data.authGroup
              })
              router.replace(loginPath || '/');
            } else if (res.data.isUser === false) {
              sessionStorage.setItem('snsLoginData', JSON.stringify({data:res.data, sort:'sns'}));
              router.push('/login/logisterDetail');
            }
          }).catch((err: any) => {
            console.log('kakao 로그인 에러:', err);
          });
      }).catch((err: any) => {
        console.error('kakao 토큰 에러', err);
      });
    } else if (code && state === NAVER_STATE) {
      axios
        .post(`${MainURL}/api/login/loginsnstoken`, {
          sort : 'naver',
          client_id: NAVER_CLIENT_ID,
          code: code,
          redirect_uri: '',
          secret : NAVER_SECRET,
          state : NAVER_STATE
        })
        .then((res) => {
          axios
            .post(`${MainURL}/api/login/login`, {
              url: 'naver',
              AccessToken: res.data,
            })
            .then((res: any) => {
              if (res.data.isUser === true) {
                localStorage.setItem("refreshToken", res.data.refreshToken);
                setIsLogin(true);
                setUserData({
                  userAccount : res.data.userAccount,
                  userNickName : res.data.userNickName,
                  userChurch : res.data.userChurch,
                  userSort: res.data.userSort,
                  userDetail: res.data.userDetail,
                  grade: res.data.grade,
                  authInstitution : res.data.authInstitution,
                  authChurch : res.data.authChurch,
                  authDepartment : res.data.authDepartment,
                  authGroup: res.data.authGroup
                })
                router.replace(loginPath || '/');
              } else if (res.data.isUser === false) {
                sessionStorage.setItem('snsLoginData', JSON.stringify({data:res.data, sort:'sns'}));
                router.push('/login/logisterDetail');
              }
            }).catch((err: any) => {
              console.log('kakao 토큰 요청 에러:', err);
            });
        }).catch((err: any) => {
          console.error('naver 로그인 에러', err);
        });
    }
  }

  useEffect(() =>{
    requestToken();
  }, []);

   
  
}
