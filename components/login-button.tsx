'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LoginButton() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <div className="w-full p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {isLoading ? (
        <Button className="w-full" disabled>
          Loading...
        </Button>
      ) : session ? (
        <div className="flex flex-col gap-2">
          <Link href="/account" className="w-full">
            <Button 
              className="w-full" 
              color="primary"
            >
              Account Dashboard
            </Button>
          </Link>
          <Button 
            className="w-full" 
            color="secondary"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <Link href="/login" className="w-full block">
          <Button 
            className="w-full" 
            color="primary"
          >
            Login / Register
          </Button>
        </Link>
      )}
    </div>
  );
} 