import { useEffect, useState } from "react";
import { getQuestions, type Question } from "../services/questions";
import { MultiQuestion } from "../components/questions/MultiQuestion";
import { MatchQuestion } from "../components/questions/MatchQuestion";
import { SingleQuestion } from "../components/questions/SingleQuestion";

export function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  function parseWord(word: string) {
    return word
      .trim()
      .split(" ")
      .map((w, i) =>
        i === 0
          ? w[0].toUpperCase() + w.slice(1).toLowerCase()
          : w.toLowerCase()
      )
      .join(" ");
  }

  function parseQuestion(question: Question) {
    return {
      ...question,
      translations: question.translations.map((t) => ({
        ...t,
        tagalog: parseWord(t.tagalog),
        english: parseWord(t.english),
      })),
    };
  }

  useEffect(() => {
    getQuestions().then((data) => {
      setQuestions(data.map(parseQuestion));
      setLoading(false);
    });
  }, []);

  const [questionNumber, setQuestionNumber] = useState(0);

  if (loading) {
    return <div>Loading...</div>;
  }

  const question = questions[questionNumber];

  function onNext() {
    setQuestionNumber(questionNumber + 1);
  }

  if (questionNumber === questions.length) {
    return (
      <div className="flex flex-col gap-5 h-full justify-center items-center">
        <h1 className="text-2xl font-bold">Quiz complete!</h1>
        <button
          className="bg-gray-500 p-2 text-white rounded-md cursor-pointer"
          onClick={() => setQuestionNumber(0)}
        >
          Play again?
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <p>{questionNumber + 1}/15</p>
      {question.type === "SINGLE" ? (
        <SingleQuestion
          key={question.translations[0].id}
          question={question}
          onNext={onNext}
        />
      ) : question.type === "MULTI" ? (
        <MultiQuestion
          key={question.translations[0].id}
          question={question}
          onNext={onNext}
        />
      ) : (
        <MatchQuestion
          key={question.translations[0].id}
          question={question}
          onNext={onNext}
        />
      )}
    </div>
  );
}

export interface QuestionProps {
  question: Question;
  onNext: () => void;
}
