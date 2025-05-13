import { useEffect, useState } from "react";
import type { Translation } from "./Dictionary";
import { getTranslations } from "../services/translations";

export function Quiz() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTranslations().then((data) => {
      setTranslations(data);
      setLoading(false);
    });
  }, []);

  const [questionNumber, setQuestionNumber] = useState(0);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <p>{questionNumber + 1}/15</p>
      <div className="h-1/3" />
      {/* <TextQuestion
        translation={translations[questionNumber]}
        onNext={() => setQuestionNumber(questionNumber + 1)}
      /> */}
      <MultiQuestion
        translation={translations[questionNumber]}
        alternatives={translations
          .slice(questionNumber + 1, questionNumber + 4)
          .map((t) => t.tagalog)}
        onNext={() => setQuestionNumber(questionNumber + 1)}
      />
    </div>
  );
}

function SingleQuestion({
  translation,
  onNext,
}: {
  translation: Translation;
  onNext: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  return (
    <>
      <p>{translation.tagalog}</p>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={answered}
        id="answer"
      />
      {answered ? (
        <p>
          {answer === translation.english
            ? "Correct"
            : `Incorrect: correct answer is ${translation.english}`}
        </p>
      ) : null}
      <button
        onClick={() => {
          if (answered) {
            (document.getElementById("answer") as HTMLInputElement).value = "";
            setAnswer("");
            onNext();
            setAnswered(false);
          } else {
            setAnswered(true);
          }
        }}
      >
        {answered ? "Next" : "Answer"}
      </button>
    </>
  );
}

function MultiQuestion({
  translation,
  alternatives,
  onNext,
}: {
  translation: Translation;
  alternatives: string[];
  onNext: () => void;
}) {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  return (
    <div className="flex flex-col gap-5 h-full">
      <p>{translation.english}</p>
      <div className="flex gap-2 justify-center">
        <QuestionButton
          onClick={() => {
            setCorrect(false);
            setAnswered(true);
          }}
        >
          {alternatives[0]}
        </QuestionButton>
        <QuestionButton
          onClick={() => {
            setCorrect(true);
            setAnswered(true);
          }}
          correct
        >
          {translation.tagalog}
        </QuestionButton>
        <QuestionButton
          onClick={() => {
            setCorrect(false);
            setAnswered(true);
          }}
        >
          {alternatives[1]}
        </QuestionButton>
        <QuestionButton
          onClick={() => {
            setCorrect(false);
            setAnswered(true);
          }}
        >
          {alternatives[2]}
        </QuestionButton>
      </div>
      {answered ? (
        <>
          <p className={correct ? "text-green-600" : "text-red-400"}>
            {correct
              ? "Correct"
              : `Incorrect: correct answer is ${translation.tagalog}`}
          </p>
          <button
            onClick={() => {
              (document.getElementById("answer") as HTMLInputElement).value =
                "";
              onNext();
              setAnswered(false);
            }}
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
