import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/layouts/app-layout";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Auth from "@/pages/auth";
import Link from "@/pages/link";
import RedirectUrl from "@/pages/redirect-url";
import UrlProvider from "@/context/url-context";
import RequireAuth from "@/components/require-auth";

const router = createBrowserRouter([
    {
        element: <AppLayout/>,
        children: [
            {
                path: "/",
                element: <Landing/>,
            },
            {
                path: "/dashboard",
                element: (
                  <RequireAuth>
                      <Dashboard/>
                  </RequireAuth>
                ),
            },
            {
                path: "/auth",
                element: <Auth/>,
            },
            {
                path: "/link/:id",
                element: (
                  <RequireAuth>
                      <Link/>
                  </RequireAuth>
                ),
            },
            {
                path: "/:id",
                element: <RedirectUrl/>
            }
        ],
    },
]);

function App() {
    return (
      <UrlProvider>
          <RouterProvider router={router}/>
      </UrlProvider>
    );
}

export default App;
