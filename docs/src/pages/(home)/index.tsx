import { Link } from "waku";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-xl font-medium">Fumadocs on Waku.</h1>
      <Link
        to="/docs"
        className="bg-fd-primary text-fd-primary-foreground mx-auto rounded-lg px-3 py-2 text-sm font-medium"
      >
        Open Docs
      </Link>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  };
};
