import { useEffect, useState } from "react";
import { Translation } from "./Dictionary";
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
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{questionNumber}</p>
      <p>{translations[questionNumber].tagalog}</p>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={answered}
      />
      {answered ? (
        <p>
          {answer === translations[questionNumber].english
            ? "Correct"
            : "Incorrect"}
        </p>
      ) : null}
      <button
        onClick={() => {
          if (answer) {
            setQuestionNumber(questionNumber + 1);
            setAnswered(false);
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

function Question({
  translation,
  onAnswer,
}: {
  translation: Translation;
  onAnswer: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");

  return (
    <div>
      <p>{translation.tagalog}</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        name="answer"
      />
      <button onClick={() => onAnswer(answer)}>Answer</button>
    </div>
  );
}

function Answer({
  translation,
  answer,
}: {
  translation: Translation;
  answer: string;
}) {
  return (
    <div>
      <p>{translation.tagalog}</p>
      <p>{answer}</p>
    </div>
  );
}
