import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/app/layout.config';
import { LoginButton } from '@/components/login-button';
import { pageTree } from '@/lib/source';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions}
      tree={pageTree}
      sidebar={{
        enabled: true,
        footer: <LoginButton />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
