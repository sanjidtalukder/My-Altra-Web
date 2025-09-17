
import { createBrowserRouter } from "react-router-dom";
import Pulse from "../Pages/Pulse";
import RootLayout from "../layouts/RootLayouts";

import Simulate from "../Pages/Simulate";
import CityHeartbeat from "../Pages/CityHeartbeat";
import Home from "../Home/Home";
import Vision from "../Pages/Vision";
import Engage from "../Pages/Engage";
import DataLab from "../Pages/DataLab";
import Atlas from "../components/Atlas";
import New from "../Pages/New";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,  
    children: [
      { index: true, element: <Home /> },
        { path: "pulse", element: <Pulse /> },
      { path: "atlas", element: <Atlas /> },
      { path: "simulate", element:<Simulate></Simulate>  },
      { path: "impact", element: <CityHeartbeat></CityHeartbeat> },
      { path: "engage", element: <Engage></Engage> },
      { path: "data-lab", element: <DataLab></DataLab> },
      { path: "vision-roadmap", element: <Vision></Vision> },
      { path: "new", element: <New></New> },
    ],
  },
]);
