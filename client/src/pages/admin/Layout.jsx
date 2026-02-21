import React from 'react'
import AdminNavbar from '../../components/AdminNavbar'
import Adminsidebar from '../../components/Adminsidebar'
import { Outlet, Navigate } from 'react-router-dom'
import Loading from '../../components/Loading'
import { useUser } from '@clerk/clerk-react'

const Layout = () => {
  const { user, isLoaded } = useUser()

  // Clerk data abhi load nahi hua
  if (!isLoaded) return <Loading />

  // Admin nahi hai
  if (user?.publicMetadata?.role !== 'admin') {
    return <Navigate to="/" />
  }

  // Admin hai
  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <Adminsidebar />
        <div className="flex flex-1 justify-center px-4 py-10 md:px-10 h-[calc(100vh-72px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
