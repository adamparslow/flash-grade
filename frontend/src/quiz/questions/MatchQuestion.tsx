import { useMemo, useState } from "react";
import type { QuestionProps } from "../QuizPage";

export function MatchQuestion({ question, onNext }: QuestionProps) {
  // Randomise the list using a simple Fisher-Yates shuffle
  const leftButtons = useMemo(() => question.translations
    .map(t => ({ ...t }))
    .sort(() => Math.random() - 0.5), [question]);
  const rightButtons = useMemo(() => question.translations.map(t => ({ ...t })).sort(() => Math.random() - 0.5), []);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);

  const [correctId, setCorrectId] = useState<number[]>([]);

  return (
    <div className="flex flex-col gap-5 h-full p-5">
      <div className="flex gap-5 h-full p-5">
        <div className="flex flex-col justify-stretch flex-1 gap-2">
          {leftButtons.map((translation) => (
            <MatchQuestionButton
              key={`left${translation.id}`}
              correct={correctId.includes(translation.id || 0)}
              show={
                Boolean(
                  selectedLeft &&
                  selectedRight &&
                  selectedLeft === translation.id
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
          {rightButtons.map((translation) => (
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
      <button
        onClick={() => {
          onNext();
        }}
        className="bg-gray-300 text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer"
      >
        Next
      </button>
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
      className={`${correct && show
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
