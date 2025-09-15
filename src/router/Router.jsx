
import { createBrowserRouter } from "react-router-dom";
import Atlas from "../pages/Atlas";
import Pulse from "../Pages/Pulse";
import RootLayout from "../layouts/RootLayouts";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,  
    children: [
      { index: true, element: <Pulse /> },
      { path: "atlas", element: <Atlas /> },
    //   { path: "simulate", element: <div>Simulate Page</div> },
    //   { path: "impact", element: <div>Impact Page</div> },
    //   { path: "engage", element: <div>Engage Page</div> },
    //   { path: "data-lab", element: <div>Data Lab Page</div> },
    //   { path: "vision-roadmap", element: <div>Vision Roadmap Page</div> },
    ],
  },
]);
