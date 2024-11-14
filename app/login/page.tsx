import StationProfileForm from '@/components/form-station-profile';
import { Separator } from '@/components/ui/separator';

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
      <StationProfileForm />
    </div>
  );
}
