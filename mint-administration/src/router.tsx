import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/auth/Login'
import HomePage from './pages/Home'
import MyOrganizationsPage from './pages/me/Organizations'
import MyOrganizationPage from './pages/me/Organization'
import OrganizationsPage from './pages/organizations/Organizations'
import OrganizationSinglePage from './pages/organizations/OrganizationSingle'
import EventSinglePage from './pages/organizations/events/EventSingle'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
            path: "organizations/:id",
            element: <MyOrganizationPage />,
          }
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
                  {
                    path: ":subEventId",
                    element: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/test',
    element: <div>test</div>
  }
])
