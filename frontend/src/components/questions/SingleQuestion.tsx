import { useState } from "react";
import type { QuestionProps } from "../../pages/Quiz";

export function SingleQuestion({ question, onNext }: QuestionProps) {
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
          {answer.toLowerCase() === translation.english.toLowerCase()
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
        className="bg-gray-300 text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer"
      >
        {answered ? "Next" : "Answer"}
      </button>
    </div>
  );
}
