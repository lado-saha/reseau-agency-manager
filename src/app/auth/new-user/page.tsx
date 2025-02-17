import { GalleryVerticalEnd } from 'lucide-react';

import { NewUserForm, NewUserFormMode } from '@/components/auth/new-user-form';
import { NavActions } from '@/components/app-topbar-actions';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Travelo | User'
};


export default async function Page(props: {
  searchParams: Promise<{
    mode?: NewUserFormMode;
    callbackUrl: string;
    email?: string;
  }>;
}) {
  // Default mode to 'signup' if not provided
  const { mode = 'signup', callbackUrl, email = '' } = await props.searchParams;
  let session = await auth(); // Implement this function

  if (mode === 'create') {
    session = await auth()
    if (!session) {
      redirect('/auth/new-user?mode=signup');
    }
  }

  //TODO: Add the validation for email

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Agency Portal
          </a>
          <NavActions />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <NewUserForm mode={mode} newEmail={email} callbackUrl={mode === 'create' ? callbackUrl : '/auth/login'} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
