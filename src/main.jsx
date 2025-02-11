import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import Homepage from "./pages/Homepage.jsx";
import Navbar from "./components/Navbar.jsx";
import DestinationDetails from "./pages/DestinationDetails.jsx";
import AddDestination from "./pages/AddDestination.jsx";

import { Provider } from "react-redux";

import { store } from "./app/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/destination-details/:destinationName/:destinationId",
        element: <DestinationDetails />,
      },
      {
        path: "/add-destination",
        element: <AddDestination />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <Homepage />
      </RouterProvider>
    </Provider>
  </StrictMode>
);
