import { useNavigate } from "react-router-dom";
import { createTranslation } from "../../services/translations";
import { useState } from "react";

export function AddTranslation() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function addCard(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();

    const tagalog = (e.target as HTMLFormElement).tagalog.value;
    const english = (e.target as HTMLFormElement).english.value;

    if (tagalog === "" || english === "") {
      return;
    }

    (e.target as HTMLFormElement).tagalog.value = "";
    (e.target as HTMLFormElement).english.value = "";

    await createTranslation({ tagalog, english });
    navigate("/dictionary");
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={addCard} className="flex flex-col gap-4 p-10">
        <input
          type="text"
          placeholder="Tagalog"
          name="tagalog"
          className="border-gray-500 border-1 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="English"
          name="english"
          className="border-gray-500 border-1 rounded-md p-2"
        />
        <button
          type="submit"
          className="bg-gray-300 rounded-md p-2 cursor-pointer"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}
