import { fetchDetail } from "@/app/lib/data";
import Grid from "../../ui/grid";

export default async function Page({ params }: { params: { essai: string } }) {
  const { essai } = await params;
  console.log(essai);
  const tab = await fetchDetail(essai);
  console.log(tab);
  
  return(
    <div className="max-w-7xl pt-20 mx-auto px-4 py-8" >
        {tab.map((elt)=>(
            <div key={elt.id} className="space-y-8" >

              
                <Grid 
                valeur={elt.price} />            
            </div>

        ))}
    </div>
  );

}