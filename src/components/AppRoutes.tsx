import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Scanner from '../pages/Scanner'
import Records from '../pages/Records'
import Settings from '../pages/Settings'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      <Route path="/dashboard" element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      } />
      <Route path="/scanner" element={
        <MainLayout>
          <Scanner />
        </MainLayout>
      } />
      <Route path="/records" element={
        <MainLayout>
          <Records />
        </MainLayout>
      } />
      <Route path="/settings" element={
        <MainLayout>
          <Settings />
        </MainLayout>
      } />
    </Routes>
  )
}

export default AppRoutes