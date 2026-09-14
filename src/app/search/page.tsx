import { Suspense } from "react";
import SearchResults from "./SearchResults";

export const metadata = {
  title: "Search — VastraVedh",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-px py-24 text-center text-ink/50">
          Searching…
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
