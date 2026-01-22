'use client';

import { useState } from 'react';
import './Company.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Company from './Company';

export default function CompanyPage() {
  return (
    <div>
      <Header/>
      <Company />
      <Footer />
    </div>
  );
}
