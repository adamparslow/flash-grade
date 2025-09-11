import type { RouteObject } from "react-router-dom";
import { HomePage } from "./general/HomePage";
import { DictionaryPage } from "./vocabList/DictionaryPage";
import { Layout } from "./general/Layout";
import { QuizPage } from "./quiz/QuizPage";
import { AddTranslationPage } from "./vocabList/AddTranslationPage";
import { DeleteTranslationPage } from "./vocabList/DeleteTranslationPage";
import { SentencesPage } from "./sentences/SentencesPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    index: true,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "dictionary",
        element: <DictionaryPage />,
      },
      {
        path: "quiz",
        element: <QuizPage />,
      },
      {
        path: "dictionary/add",
        element: <AddTranslationPage />,
      },
      {
        path: "dictionary/delete/:id",
        element: <DeleteTranslationPage />,
      },
      {
        path: "sentences",
        element: <SentencesPage />,
      },
    ],
  },
];
