'use client';

import React from 'react';
// import './ServiceMain.scss';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ServiceMainPage() {

  const router = useRouter();

  const serviceList = [
    {
      iconClass: 'document',
      icon: '📄',
      title: '모바일전단지(소개)',
      category: '교회소개',
      description: '교회의 소개를 모바일에서 편리하게 확인할 수 있습니다.',
      badge: 'Mobile Booklet Notice',
      path: '/service/notice'
    },
    {
      iconClass: 'build',
      icon: '📄',
      title: '모바일전단지(행사)',
      category: '행사소개',
      description: '행사의 소개를 모바일에서 편리하게 확인할 수 있습니다.',
      badge: 'Mobile Booklet Event',
      path: '/service/event'
    }
  ];

  return (
    <div>
      <Header/>
      <div className="service-main">
        <div className="service-header">
          <div className="header-content">
            <h1>사역의 질을 향상 할 수 있도록</h1>
            <h2>교회와 사역의 특성에 따라<br />맞춤형 서비스를 제공합니다.</h2>
          </div>
        </div>

        <div className="service-grid">
          {serviceList.map((service: any, index: number) => (
            <div key={index} className="service-card"
              onClick={()=>{
                router.push(service.path);
              }}
            >
              <div className={`service-icon ${service.iconClass}`}>{service.icon}</div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p className="service-category">{service.category}</p>
                <p className="service-description">{service.description}</p>
                <div className="service-badge">{service.badge}</div>
                <div className="service-arrow">→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
