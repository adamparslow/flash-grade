import { useEffect, useState } from "react";
import type { Translation } from "./Dictionary";
import { getQuestions, type Question } from "../services/questions";

export function Quiz() {
  // const [translations, setTranslations] = useState<Translation[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const [questionNumber, setQuestionNumber] = useState(0);

  if (loading) {
    return <div>Loading...</div>;
  }

  const question = questions[questionNumber];
  console.log(question);

  return (
    <div className="flex flex-col gap-5 h-full">
      <p>{questionNumber + 1}/15</p>
      {question.type === "SINGLE" ? (
        <SingleQuestion
          key={question.translations[0].id}
          question={question}
          onNext={() => setQuestionNumber(questionNumber + 1)}
        />
      ) : question.type === "MULTI" ? (
        <MultiQuestion
          key={question.translations[0].id}
          question={question}
          onNext={() => setQuestionNumber(questionNumber + 1)}
        />
      ) : (
        <MatchQuestion
          key={question.translations[0].id}
          question={question}
          onNext={() => setQuestionNumber(questionNumber + 1)}
        />
      )}
    </div>
  );
}

interface QuestionProps {
  question: Question;
  onNext: () => void;
}

function SingleQuestion({ question, onNext }: QuestionProps) {
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  const translation = question.translations[0];

  return (
    <div className="flex flex-col gap-5 h-full p-5">
      <p>{translation.tagalog}</p>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !answered) {
            setAnswered(true);
          }
        }}
        disabled={answered}
        id="answer"
        className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          } else {
            setAnswered(true);
          }
        }}
      >
        {answered ? "Next" : "Answer"}
      </button>
    </div>
  );
}

function MultiQuestion({ question, onNext }: QuestionProps) {
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

function MatchQuestion({ question, onNext }: QuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [incorrectLeft, setIncorrectLeft] = useState<number[]>([]);
  const [incorrectRight, setIncorrectRight] = useState<number[]>([]);

  const [correctId, setCorrectId] = useState<number[]>([]);

  console.log(selectedLeft, selectedRight);

  return (
    <div className="flex gap-5 h-full p-5">
      <div className="flex flex-col justify-stretch flex-1 gap-2">
        {question.translations.map((translation) => (
          <MatchQuestionButton
            key={`left${translation.id}`}
            correct={correctId.includes(translation.id || 0)}
            show={
              Boolean(
                selectedLeft && selectedRight && selectedLeft === translation.id
              ) || correctId.includes(translation.id || 0)
            }
            onClick={() => {
              if (selectedRight && selectedLeft) {
                setSelectedLeft(translation.id || 0);
                setSelectedRight(null);
                return;
              }
              setSelectedLeft(translation.id || 0);
              if (selectedRight === translation.id) {
                setCorrectId([...correctId, translation.id || 0]);
              }
            }}
            disabled={correctId.includes(translation.id || 0)}
          >
            {translation.english}
          </MatchQuestionButton>
        ))}
      </div>
      <div className="flex flex-col flex-1 gap-2">
        {question.translations.map((translation) => (
          <MatchQuestionButton
            key={`right${translation.id}`}
            correct={correctId.includes(translation.id || 0)}
            show={
              Boolean(
                selectedLeft &&
                  selectedRight &&
                  selectedRight === translation.id
              ) || correctId.includes(translation.id || 0)
            }
            onClick={() => {
              if (selectedRight && selectedLeft) {
                setSelectedLeft(null);
                setSelectedRight(translation.id || 0);
                return;
              }
              setSelectedRight(translation.id || 0);
              if (selectedLeft === translation.id) {
                setCorrectId([...correctId, translation.id || 0]);
              }
            }}
            disabled={correctId.includes(translation.id || 0)}
          >
            {translation.tagalog}
          </MatchQuestionButton>
        ))}
      </div>
    </div>
  );
}

function MatchQuestionButton({
  children,
  onClick,
  correct,
  show,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  correct?: boolean;
  show?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        correct && show
          ? "bg-green-600 text-white"
          : !correct && show
          ? "bg-red-700 text-white"
          : "bg-gray-200 text-black"
      } p-2 rounded-md hover:bg-gray-400 cursor-pointer focus:bg-blue-600 focus:text-white`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
