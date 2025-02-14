'use client';
import { VehicleModel } from '@/lib/models/resource';
import { useState } from 'react';
import { VehicleModelForm } from './form-vehicle-model';
import { DeleteDialog } from '../dialogs/dialog-delete';
import { useRouter } from 'next/navigation';

export function VehicleModelDetailView({
  id, originalModel, adminId, agencyId
}: {
  id: string, originalModel: VehicleModel | undefined;
  adminId: string, agencyId: string
}) {
  const mode: 'edit-mode' | 'creation-mode' =
    originalModel !== undefined ? 'edit-mode' : 'creation-mode';

  const [model, _] = useState(originalModel);

  const handleDeleteClick = () => {
  };

  const router = useRouter();
  return (
    <div>
      <div className="flex items-center mt-2 mb-2">
        <div className="ml-auto flex items-center gap-2">
          {mode === 'edit-mode' && (
            <DeleteDialog
              title="Archive Vehicle Model"
              triggerText="Archive Model"
              description={`Are you sure you want to archive ${model?.name}?. will automatically archive all  vehicles based on it.`}
              onDeleteAction={() => {
                // deleteAction(employee.id);
              }} mode={'archive'} />
          )}
        </div>
      </div>

      <VehicleModelForm id={id} agencyId={agencyId} adminId={adminId} onSubmitCompleteAction={() => {
        router.back()
        setTimeout(() => {
          router.refresh();
        }, 1000); // Give some time for navigation before refreshing

      }} originalModel={model} />
    </div>
  );
}
