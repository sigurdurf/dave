import React, { Component } from 'react';
import Header from './Header';

type DashboardLayoutProps = {
  children: React.ReactNode,
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Header />
        {children}
    </>
  );
}