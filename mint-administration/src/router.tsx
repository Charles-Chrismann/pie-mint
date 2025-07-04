import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/auth/Login'
import HomePage from './pages/Home'
import MyOrganizationsPage from './pages/me/Organizations'
import MyOrganizationPage from './pages/me/Organization'
import OrganizationsPage from './pages/organizations/Organizations'
import OrganizationSinglePage from './pages/organizations/OrganizationSingle'
import EventSinglePage from './pages/organizations/events/EventSingle'
import { AuthProvider } from './contexts/AuthContext'
import MyEventPage from './pages/me/Event'
import MySubEventPage from './pages/me/SubEvent'
import EmulateRunPage from './pages/emulate-run/EmulateRun'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <LoginPage />
          }
        ]
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'me',
        children: [
          {
            path: "organizations",
            element: <MyOrganizationsPage />,
          },
          {
            path: "organizations/:organizationId",
            children: [
              {
                path: "",
                element: <MyOrganizationPage />
              },
              {
                path: "events/:eventId",
                children: [
                  {
                    path: '',
                    index: true,
                    element: <MyEventPage />
                  },
                  {
                    path: 'sub-events/:subEventId',
                    index: true,
                    element: <MySubEventPage />
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        path: "organizations",
        children: [
          {
            path: "",
            index: true,
            element: <OrganizationsPage />
          },
          {
            path: ":organizationId",
            element: <OrganizationSinglePage />
          },
          {
            path: ":organizationId/events",
            children: [
              {
                path: "",
                index: true,
                element: null
              },
              {
                path: ":eventId",
                element: <EventSinglePage />
              },
              {
                path: ":eventId/sub-events",
                children: [
                  {
                    path: "",
                    index: true,
                    element: null
                  },
                  // {
                  //   path: ":subEventId",
                  //   element: <SubEventPage />
                  // }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'emulate-run',
        element: <EmulateRunPage />
      }
    ]
  },
  {
    path: '/test',
    element: <div>test</div>
  }
])
