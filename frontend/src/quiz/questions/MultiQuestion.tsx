import { useState } from "react";
import type { QuestionProps } from "../QuizPage";

export function MultiQuestion({ question, onNext }: QuestionProps) {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  const correctIndex = (question.translations[0].id || 0) % 4;
  const correctTranslation = question.translations[correctIndex];
  const answers = question.translations.map((t) => t.tagalog);

  return (
    <div className="flex flex-col gap-5 h-full p-5">
      <p>{correctTranslation.english}</p>
      <div className="grid grid-cols-2 gap-2 justify-center">
        {answers.map((answer, index) => (
          <QuestionButton
            key={index}
            onClick={() => {
              setCorrect(answer === correctTranslation.tagalog);
              setAnswered(true);
            }}
            correct={answer === correctTranslation.tagalog}
          >
            {answer}
          </QuestionButton>
        ))}
      </div>
      {answered ? (
        <>
          <p className={correct ? "text-green-600" : "text-red-400"}>
            {correct
              ? "Correct"
              : `Incorrect: correct answer is ${correctTranslation.tagalog}`}
          </p>
          <button
            onClick={() => {
              onNext();
              setAnswered(false);
            }}
            className="bg-gray-300 text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer"
          >
            {answered ? "Next" : "Answer"}
          </button>
        </>
      ) : null}
    </div>
  );
}

function QuestionButton({
  children,
  onClick,
  correct,
}: {
  children: React.ReactNode;
  onClick: () => void;
  correct?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        correct ? "focus:bg-green-600" : "focus:bg-red-700"
      } focus:text-white bg-gray-200 text-black p-2 rounded-md hover:bg-gray-400 cursor-pointer`}
    >
      {children}
    </button>
  );
}
