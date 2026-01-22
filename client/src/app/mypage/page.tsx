'use client';

import { useEffect, useState } from 'react';
import './Mypage.scss';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../MainURL';
import { useRecoilState } from 'recoil';
import { recoilLoginState, recoilUserData } from '../../RecoilStore';
import Header from '../../components/Header';

export default function ProfilePage() {

  const router = useRouter();
  const [isLogin, setIsLogin] = useRecoilState(recoilLoginState);
  const [userData, setUserData] = useRecoilState(recoilUserData);

  const [currentTab, setCurrentTab] = useState(1);
  const [refresh, setRefresh] = useState<boolean>(false);

  interface ProfileProps {
    grade : string;
    userAccount: string;
    userNickName: string;
    userSort: string;
    userDetail: string;
    userURL: string;
  }
  
  const [userProfile, setUserProfile] = useState<ProfileProps>();
  const [grade, setGrade] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [userSort, setUserSort] = useState('');
  const [userDetail, setUserDetail] = useState('');
  const [userURL, setUserURL] = useState('');
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordChange, setPasswordChange] = useState('');

  const [isViewPasswdChange, setIsViewPasswdChange] = useState<boolean>(false);
  const [isViewDeleteAccount, setIsViewDeleteAccount] = useState<boolean>(false);
  const [agreeDeleteAccount, setAgreeDeleteAccount] = useState<boolean>(false);

  const fetchPosts = async () => {
    const res = await axios.get(`${MainURL}/mypage/getprofile/${userData.userAccount}`)
    if (res.data) {
      setUserProfile(res.data[0]);
      setGrade(res.data[0].grade);
      setUserAccount(res.data[0].userAccount);
      setUserNickName(res.data[0].userNickName);
      setUserSort(res.data[0].userSort);
      setUserDetail(res.data[0].userDetail);
      setUserURL(res.data[0].userURL);
    }
  };

  useEffect(() => {
		fetchPosts();
	}, [refresh]);  

  return (
    <div>
      <Header />
      <div>
        {/* Profile Content */}
      </div>
      <Footer />
    </div>
  )
}
