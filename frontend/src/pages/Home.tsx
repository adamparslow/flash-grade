import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="flex flex-col gap-10 justify-center items-center h-full">
      <HomeLink to="/quiz">Quiz</HomeLink>
      <HomeLink to="/search">Search</HomeLink>
      <HomeLink to="/dictionary">Vocab List</HomeLink>
    </div>
  );
}

function HomeLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link className="bg-amber-600 p-2 rounded-lg w-1/2 max-w-1/2" to={to}>
      {children}
    </Link>
  );
}
