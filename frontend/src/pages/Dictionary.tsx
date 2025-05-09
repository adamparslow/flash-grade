import styles from "./dictionary.module.css";
import { useState } from "react";

const initialFlashCards = [
    {
        tagalog: "Hello",
        english: "Hello"
    },
    {
        tagalog: "Kumusta ka",
        english: "How are you?"
    },
]

export function Dictionary() {
    const [flashCards, setFlashCards] = useState(initialFlashCards);
    const [databaseFlashCards, setDatabaseFlashCards] = useState(initialFlashCards);

    function deleteCard(index: number) {
        setFlashCards(flashCards.filter((_, i) => i !== index));
    }

    function addCard() {
        setFlashCards([...flashCards, { tagalog: "", english: "" }]);
    }

    function onCardChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const card = flashCards[index];
        const updatedCard = {
            ...card,
            [e.target.name]: e.target.value
        }
        setFlashCards([...flashCards.slice(0, index), updatedCard, ...flashCards.slice(index + 1)]);
    }

    const areFlashCardsOutOfSync = JSON.stringify(flashCards) !== JSON.stringify(databaseFlashCards);


    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h1>Dictionary</h1>
                <div>
                    <button onClick={addCard}>Add Card</button>
                    <button disabled={!areFlashCardsOutOfSync} onClick={() => setDatabaseFlashCards(flashCards)}>Save to Database</button>
                </div>
            </div>

            <div className={styles.table}>
                <p>Tagalog</p>
                <p>English</p>
                <p></p>

                {flashCards.map((card, index) => (
                    <>
                        <div className={styles.line} />
                        <input type="text" placeholder="Tagalog" name="tagalog" value={card.tagalog} onChange={e => onCardChange(e, index)} />
                        <input type="text" placeholder="English" name="english" value={card.english} onChange={e => onCardChange(e, index)} />
                        <button onClick={() => deleteCard(index)}>x</button>
                    </>
                ))}
            </div>
        </div>
    )
}