import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import 'antd/dist/reset.css';
import './App.css';
import AdminLayout from './Layouts/AdminLayout';
import UserLayout from './Layouts/UserLayout';
import ProtectedRoute from './Components/ProtectedRoutes';
import { ConfigProvider } from 'antd';

const ViewPendingLogs = React.lazy(() =>
  import('./Pages/Admin/ViewPendingLogs')
);
const ViewUpdatedLogs = React.lazy(() =>
  import('./Pages/Admin/ViewUpdatedLogs')
);
const Login = React.lazy(() => import('./Pages/Login/Login'));
const CreateEntry = React.lazy(() => import('./Pages/User/CreateEntry'));
const ViewEntries = React.lazy(() => import('./Pages/User/ViewEntries'));
const EditEntry = React.lazy(() => import('./Pages/User/EditEntry'));

export const queryClient = new QueryClient();
const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Inter', sans-serif"
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading. . .</div>}>
          <Toaster position="top-right" />
          <div className="App">
            <Routes>
              <Route element={<AdminLayout />}>
                <Route
                  path={'/admin/pending-entries'}
                  element={
                    <ProtectedRoute>
                      <ViewPendingLogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/admin/updated-entries'}
                  element={
                    <ProtectedRoute>
                      <ViewUpdatedLogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/admin'}
                  element={<Navigate to="/admin/pending-entries" replace />}
                />
              </Route>
              <Route element={<UserLayout />}>
                <Route
                  path={'/user/create-entry'}
                  element={
                    <ProtectedRoute>
                      <CreateEntry />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/user/update-entry/:timeLogId'}
                  element={<EditEntry />}
                />
                <Route
                  path={'/user/entries'}
                  element={
                    <ProtectedRoute>
                      <ViewEntries />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/user'}
                  element={<Navigate to="/user/create-entry" replace />}
                />
              </Route>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Suspense>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
