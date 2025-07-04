import type { RouteObject } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dictionary } from "./pages/Dictionary";
import { Layout } from "./components/Layout";
import { Quiz } from "./pages/Quiz";
import { AddTranslation } from "./pages/Dictionary/AddTranslation";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dictionary",
        element: <Dictionary />,
      },
      {
        path: "quiz",
        element: <Quiz />,
      },
      {
        path: "search",
        element: <AddTranslation />,
      },
    ],
  },
];
