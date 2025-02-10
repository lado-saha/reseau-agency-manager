'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Employee, EmployeeRole } from '@/lib/models/employee';
import { EmployeeForm } from './form-employee';
import { DeleteDialog } from '../dialogs/dialog-delete';
import { User } from '@/lib/models/user';

export function EmployeeDetailView<T extends EmployeeRole>({
  originalEmployee,
  adminId,
  roles,
  orgId,
  emailParam
}: {
  originalEmployee: Employee<T> | undefined;
  adminId: string;
  roles: T[];
  orgId: string;
  emailParam?: string
}) {
  const mode: 'edit-mode' | 'creation-mode' =
    originalEmployee !== undefined ? 'edit-mode' : 'creation-mode';

  const [employee, setEmployee] = useState(originalEmployee);
  const router = useRouter();

  const handleDeleteClick = () => { };

  return (
    <div>
      <div className="flex items-center mt-2 mb-2">
        <div className="ml-auto flex items-center gap-2">
          {mode === 'edit-mode' && (
            <DeleteDialog
              title="Fire Employee"
              triggerText="Fire Employee"
              description={`Are you sure you want to fire ${(employee?.user as User | undefined)?.name}? This action cannot be undone.`}
              onDeleteAction={() => {
                // deleteAction(employee.id);
              }} mode={'archive'} />
          )}
        </div>
      </div>

      <EmployeeForm<T>
        orgId={orgId}
        roles={roles}
        emailParam={emailParam}
        id={employee?.id || 'new'}
        adminId={adminId}
        oldEmployee={originalEmployee}
        onSubmitCompleteAction={(newId, data) => {
          router.back(); // Navigates back to the previous page
          setTimeout(() => {
            router.refresh();
          }, 1000); // Give some time for navigation before refreshing

        }}
      />
    </div>
  );
}
