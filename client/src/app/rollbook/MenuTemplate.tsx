'use client';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { recoilLoginState, recoilUserData } from '../../RecoilStore';
import { useRouter } from 'next/navigation';

interface MenuTemplateProps {
  currentNum?: string;
  currentSubNum?: string;
}

export default function MenuTemplate(props: MenuTemplateProps) {

  const router = useRouter();
  const isLogin = useRecoilValue(recoilLoginState);
  const userData = useRecoilValue(recoilUserData);

  const alertLogin = () => {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }

  const alertRequest = () => {
    alert('본 게시판은 정회원만 접근할 수 있습니다. 등업 게시판에서 등업신청을 해주세요.');
    router.push('/store/graderequest');
  }

  interface SelectMenuProps {
    menuNum : number;
    title: string;
    url : string;
  }
  const SelectMenu: React.FC<SelectMenuProps> = ({ menuNum, title, url}) => {
    return (
      <div onClick={()=>{
        router.push(`/rollbook${url}`)
      }}
        className={parseInt(props.currentNum || '0') === menuNum ? "subpage__menu__item subpage__menu__item--on" : "subpage__menu__item"}>
        {title}
      </div>
    )    
  };

  interface SelectSubMenuProps {
    menuSubNum : number;
    title: string;
    url : string;
  }
  const SelectSubMenu: React.FC<SelectSubMenuProps> = ({ menuSubNum, title, url}) => {
    return (
      <div onClick={()=>{
        router.push(`/rollbook${url}`)
      }}
        className={parseInt(props.currentSubNum || '0') === menuSubNum ? "subpage__menu__item__sub subpage__menu__item--on__sub" : "subpage__menu__item__sub"}>
        {title}
      </div>
    )    
  };

  return (
    <div className="subpage__menu">
      <div className="subpage__menu__title">온라인출석부</div>
      
      <div className="subpage__menu__list menu__desktop">
        <SelectMenu title='전체교회' menuNum={1} url={'/'}/>
      </div>

      <div className="subpage__menu__list menu__mobile">
        <SelectMenu title='전체교회' menuNum={1} url={'/'}/>
      </div>

    </div>
  )
}
