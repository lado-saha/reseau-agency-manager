import { Separator } from 'src/components/ui/separator';
import Loading from './loading';

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium pb-2">Station Profile</h1>
        <p className="text-sm text-muted-foreground">
          {/* TODO: Add good description */}
          This profile differentiates this station from others in the agency.
        </p>
      </div>
      <Separator />
      {/* <StationProfileForm /> */}
      {/* <Loading variant="card" message="Fetching vehicles..." value={50} /> */}
      <Loading variant="inline" message="Loading data..." size="lg" />
    </div>
  );
}
