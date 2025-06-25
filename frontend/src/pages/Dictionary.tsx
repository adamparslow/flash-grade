import { Link } from "react-router-dom";
import { getTranslations } from "../services/translations";
import styles from "./dictionary.module.css";
import { useEffect, useState } from "react";

export type Translation = {
  id?: number;
  tagalog: string;
  english: string;
};

export function Dictionary() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getTranslations().then((data) => {
      setTranslations(data);
      setLoading(false);
    });
  }, []);

  // function deleteCard(index: number) {
  //   setTranslations(translations.filter((_, i) => i !== index));
  //   const id = translations[index].id;
  //   if (id) {
  //     deleteTranslation(id);
  //   }
  // }

  // async function onSave(translation: Translation) {
  //   const oldTranslation = translations.find(
  //     (card) => card.id === translation.id
  //   );
  //   if (oldTranslation) {
  //     oldTranslation.tagalog = translation.tagalog;
  //     oldTranslation.english = translation.english;
  //     setTranslations([...translations]);
  //   }
  //   updateTranslation(translation);
  // }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Dictionary</h1>
        <Link to="/search">Add Card</Link>
      </div>
      <p>{translations.length} translations</p>

      <div className={styles.table}>
        <DictionaryText left>Tagalog</DictionaryText>
        <DictionaryText>English</DictionaryText>

        {loading ? (
          <>
            <div className={styles.line} />
            <p>Loading...</p>
          </>
        ) : (
          translations.map((card, index) => (
            <>
              {/* <div className="border-t-2 border-gray-300 col-span-2" /> */}
              <DictionaryEntry
                key={`${card.tagalog}-${card.english}`}
                tagalog={card.tagalog}
                english={card.english}
                id={card.id}
                // onDelete={() => deleteCard(index)}
                // onSave={onSave}
                bottom={index === translations.length - 1}
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
  // onDelete,
  // onSave,
  bottom,
}: {
  tagalog: string;
  english: string;
  id?: number;
  // onDelete: () => void;
  // onSave: (translation: Translation) => void;
  bottom?: boolean;
}) {
  const [translation, setTranslation] = useState<Translation>({
    id,
    tagalog,
    english,
  });
  // function save() {
  //   if (translation.tagalog === "" || translation.english === "") {
  //     return;
  //   }

  //   setIsEditing(false);

  //   onSave(translation);
  // }

  // function edit() {
  //   setIsEditing(true);
  // }
  // const [isEditing, setIsEditing] = useState(tagalog === "" || english === "");
  const isEditing = false;

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
          <DictionaryText left bottom={bottom}>
            {tagalog}
          </DictionaryText>
          <DictionaryText bottom={bottom}>{english}</DictionaryText>
        </>
      )}
      {/* <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          onClick={() => {
            isEditing ? save() : edit();
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          onClick={onDelete}
        >
          x
        </button>
      </div> */}
    </>
  );
}

function DictionaryText({
  children,
  left,
  bottom,
}: {
  children: React.ReactNode;
  left?: boolean;
  bottom?: boolean;
}) {
  return (
    <p
      className={`${
        left ? "border-r-2 bg-amber-50" : "bg-blue-50"
      } p-2 border-gray-400 ${bottom ? "" : "border-b-2"}`}
    >
      {children}
    </p>
  );
}
