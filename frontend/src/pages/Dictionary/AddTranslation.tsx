import { useNavigate } from "react-router-dom";
import { createTranslation } from "../../services/translations";
import { useState } from "react";
import { searchTagalog } from "../../services/search";
import { searchEnglish } from "../../services/search";
import { Button, Input, Stack, TextField } from "@mui/material";

export function AddTranslation() {
  const [loading, setLoading] = useState(false);
  const [addCardLoading, setAddCardLoading] = useState(false);
  const [results, setResults] = useState<{
    tagalog: string;
    english: string;
  } | null>(null);
  const navigate = useNavigate();

  async function addCard() {
    setAddCardLoading(true);
    if (!results) {
      setAddCardLoading(false);
      return;
    }

    await createTranslation(results);
    navigate("/dictionary");
    setAddCardLoading(false);
  }

  async function search(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    const tagalog = (e.target as HTMLFormElement).tagalog.value;
    const english = (e.target as HTMLFormElement).english.value;

    console.log(tagalog, english);

    if (tagalog === "" && english === "") {
      setLoading(false);
      return;
    }

    if (tagalog === "") {
      const response = await searchEnglish(english);
      console.log(response);
      setResults({ tagalog: response.result, english });
    } else if (english === "") {
      const response = await searchTagalog(tagalog);
      console.log(response);
      setResults({ tagalog, english: response.result });
    }

    setLoading(false);
  }

  return (
    <Stack>
      <form onSubmit={search} className="flex flex-col gap-4 p-10">
        <div className="flex gap-4 justify-center">
          <input type="radio" id="tagalog" name="language" />
          <label htmlFor="tagalog">Tagalog</label>
          <input type="radio" id="english" name="language" />
          <label htmlFor="english">English</label>
        </div>
        <TextField
          variant="outlined"
          size="small"
          type="text"
          placeholder="Tagalog"
          name="tagalog"
        />
        <TextField
          type="text"
          placeholder="English"
          name="english"
        />
        <Button
          type="submit"
          variant="contained"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {
        results && (
          <div>
            <h2>Results</h2>
            <p>{results.tagalog}</p>
            <p>{results.english}</p>
            <button
              onClick={() => addCard()}
              className="bg-gray-300 rounded-md p-2 cursor-pointer"
            >
              {addCardLoading ? "Adding..." : "Add to vocab list?"}
            </button>
          </div>
        )
      }
    </Stack >
  );
}
