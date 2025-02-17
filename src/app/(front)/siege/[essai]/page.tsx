import { fetchDetail } from "@/app-front/lib/data";
import Grid from "../../ui/grid";

export default async function Page({ params }: { params: Promise<{ essai: string }> }) {
  // Await the params promise
  const resolvedParams = await params;
  const { essai } = resolvedParams;

  console.log(essai);

  // Fetch details based on the resolved essai parameter
  const tab = await fetchDetail(essai);
  console.log(tab);

  return (
    <div className="max-w-7xl pt-20 mx-auto px-4 py-8">
      {tab.map((elt) => (
        <div key={elt.id} className="space-y-8">
          <Grid valeur={elt.price} />
        </div>
      ))}
    </div>
  );
}