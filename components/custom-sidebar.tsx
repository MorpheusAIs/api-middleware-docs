'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CustomSidebar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <div className="flex flex-col h-full">
      {/* Your existing sidebar content goes here */}
      
      {/* Login/Account button at the bottom */}
      <div className="mt-auto p-4">
        {isLoading ? (
          <Button className="w-full" disabled>
            Loading...
          </Button>
        ) : session ? (
          <Link href="/account">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Account Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Login / Register
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
} 