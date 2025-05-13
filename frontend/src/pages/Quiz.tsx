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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{questionNumber + 1}/15</p>
      {/* <TextQuestion
        translation={translations[questionNumber]}
        onNext={() => setQuestionNumber(questionNumber + 1)}
      /> */}
      <FourQuestion
        translation={translations[questionNumber]}
        alternatives={translations
          .slice(questionNumber + 1, questionNumber + 4)
          .map((t) => t.tagalog)}
        onNext={() => setQuestionNumber(questionNumber + 1)}
      />
    </div>
  );
}

function TextQuestion({
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

function FourQuestion({
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
    <>
      <p>{translation.english}</p>
      <div>
        <button
          onClick={() => {
            setCorrect(false);
            setAnswered(true);
          }}
        >
          {alternatives[0]}
        </button>
        <button
          onClick={() => {
            setCorrect(true);
            setAnswered(true);
          }}
        >
          {translation.tagalog}
        </button>
        <button
          onClick={() => {
            setCorrect(false);
            setAnswered(true);
          }}
        >
          {alternatives[1]}
        </button>
        <button
          onClick={() => {
            setCorrect(false);
            setAnswered(true);
          }}
        >
          {alternatives[2]}
        </button>
      </div>
      {answered ? (
        <>
          <p>
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
    </>
  );
}
