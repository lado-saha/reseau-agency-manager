'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Employee, EmployeeRole } from '@/lib/models/employee';
import { EmployeeForm } from './form-employee';

export function EmployeeDetailView<T extends EmployeeRole>({
  originalEmployee,
  adminId,
  roles,
  orgId
}: {
  originalEmployee: Employee<T> | undefined;
  adminId: string;
  roles: T[];
  orgId: string;
}) {
  const mode: 'edit-mode' | 'creation-mode' =
    originalEmployee !== undefined ? 'edit-mode' : 'creation-mode';

  const [employee, setEmployee] = useState(originalEmployee);
  const router = useRouter();

  return (
    <div>
      <EmployeeForm<T>
        orgId={orgId}
        roles={roles}
        id={employee?.id || 'new'}
        adminId={adminId}
        oldEmployee={originalEmployee}
        onSubmitCompleteAction={(newId, data) => {
          router.back(); // Navigates back to the previous page
        }}
      />
    </div>
  );
}
