import {
  createTranslation,
  deleteTranslation,
  getTranslations,
  updateTranslation,
} from "../services/translations";
import styles from "./dictionary.module.css";
import { useEffect, useState } from "react";

export type Translation = {
  id?: number;
  tagalog: string;
  english: string;
};

export function Dictionary() {
  console.log("rerender");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getTranslations().then((data) => {
      setFlashCards(data);
      setLoading(false);
    });
  }, []);

  const [flashCards, setFlashCards] = useState<Translation[]>([]);

  function deleteCard(index: number) {
    setFlashCards(flashCards.filter((_, i) => i !== index));
    const id = flashCards[index].id;
    if (id) {
      deleteTranslation(id);
    }
  }

  function addCard() {
    const lastTranslation = flashCards[flashCards.length - 1];
    if (lastTranslation.id === undefined) {
      return;
    }
    setFlashCards([...flashCards, { tagalog: "", english: "" }]);
  }

  function onCardChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    console.log(e.target.name, e.target.value);
    const card = flashCards[index];
    const updatedCard = {
      ...card,
      [e.target.name]: e.target.value,
    };
    setFlashCards([
      ...flashCards.slice(0, index),
      updatedCard,
      ...flashCards.slice(index + 1),
    ]);
  }

  function onSave(translation: Translation) {
    if (translation.id) {
      const oldTranslation = flashCards.find(
        (card) => card.id === translation.id
      );
      if (oldTranslation) {
        oldTranslation.tagalog = translation.tagalog;
        oldTranslation.english = translation.english;
        setFlashCards([...flashCards]);
      }
      updateTranslation(translation);
      return;
    }

    createTranslation(translation);
    setFlashCards([...flashCards.slice(0, -1), translation]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Dictionary</h1>
        <button onClick={addCard}>Add Card</button>
      </div>

      <div className={styles.table}>
        <p>Tagalog</p>
        <p>English</p>
        <p></p>

        {loading ? (
          <>
            <div className={styles.line} />
            <p>Loading...</p>
          </>
        ) : (
          flashCards.map((card, index) => (
            <>
              <div className={styles.line} />
              <DictionaryEntry
                key={`${card.tagalog}-${card.english}`}
                tagalog={card.tagalog}
                english={card.english}
                id={card.id}
                onChange={(e) => onCardChange(e, index)}
                onDelete={() => deleteCard(index)}
                onSave={onSave}
              />
            </>
          ))
        )}
      </div>
    </div>
  );
}

function DictionaryEntry({
  tagalog,
  english,
  id,
  onChange,
  onDelete,
  onSave,
}: {
  tagalog: string;
  english: string;
  id?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onSave: (translation: Translation) => void;
}) {
  const [translation, setTranslation] = useState<Translation>({
    id,
    tagalog,
    english,
  });
  function save() {
    if (translation.tagalog === "" || translation.english === "") {
      return;
    }

    setIsEditing(false);

    onSave(translation);
  }

  function edit() {
    setIsEditing(true);
  }
  const [isEditing, setIsEditing] = useState(tagalog === "" || english === "");

  return (
    <>
      {isEditing ? (
        <>
          <input
            type="text"
            placeholder="Tagalog"
            name="tagalog"
            value={translation.tagalog}
            onChange={(e) =>
              setTranslation({
                ...translation,
                tagalog: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="English"
            name="english"
            value={translation.english}
            onChange={(e) =>
              setTranslation({
                ...translation,
                english: e.target.value,
              })
            }
          />
        </>
      ) : (
        <>
          <p>{tagalog}</p>
          <p>{english}</p>
        </>
      )}
      <div>
        <button
          onClick={() => {
            isEditing ? save() : edit();
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button onClick={onDelete}>x</button>
      </div>
    </>
  );
}
