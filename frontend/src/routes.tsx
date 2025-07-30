import type { RouteObject } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dictionary } from "./pages/Dictionary";
import { Layout } from "./components/Layout";
import { Quiz } from "./pages/Quiz";
import { AddTranslation } from "./pages/Dictionary/AddTranslation";
import { DeleteTranslation } from "./pages/Dictionary/DeleteTranslation";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    index: true,
  },
  {
    element: <Layout />,
    children: [
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
      {
        path: "dictionary/delete/:id",
        element: <DeleteTranslation />,
      },
    ],
  },
];
