Integrations

# Feedback

Receive feedback from your users

## [Overview](https://fumadocs.vercel.app/docs/ui/feedback\#overview)

Feedback is crucial for knowing what your reader thinks, and help you to further improve documentation content.

## [Installation](https://fumadocs.vercel.app/docs/ui/feedback\#installation)

Add dependencies:

npmpnpmyarnbun

```
npm install class-variance-authority lucide-react
```

Copy the component:

components/rate.tsx

```
'use client';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { type SyntheticEvent, useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
} from 'fumadocs-ui/components/ui/collapsible';
import { cva } from 'class-variance-authority';
import { usePathname } from 'next/navigation';

const rateButtonVariants = cva(
  'inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current',
        false: 'text-fd-muted-foreground',
      },
    },
  },
);

export interface Feedback {
  opinion: 'good' | 'bad';
  message: string;
}

function get(url: string): Feedback | null {
  const item = localStorage.getItem(`docs-feedback-${url}`);

  if (item === null) return null;
  return JSON.parse(item) as Feedback;
}

function set(url: string, feedback: Feedback | null) {
  const key = `docs-feedback-${url}`;

  if (feedback) localStorage.setItem(key, JSON.stringify(feedback));
  else localStorage.removeItem(key);
}

export function Rate({
  onRateAction,
}: {
  onRateAction: (url: string, feedback: Feedback) => Promise<void>;
}) {
  const url = usePathname();
  const [previous, setPrevious] = useState<Feedback | null>(null);
  const [opinion, setOpinion] = useState<'good' | 'bad' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setPrevious(get(url));
  }, [url]);

  function submit(e?: SyntheticEvent) {
    e?.preventDefault();
    if (opinion == null) return;

    const feedback: Feedback = {
      opinion,
      message,
    };

    void onRateAction(url, feedback);

    set(url, feedback);
    setPrevious(feedback);
    setMessage('');
    setOpinion(null);
  }

  return (
    <Collapsible
      open={opinion !== null || previous !== null}
      onOpenChange={(v) => {
        if (!v) setOpinion(null);
      }}
      className="border-y py-3"
    >
      <div className="flex flex-row items-center gap-2">
        <p className="text-sm font-medium pe-2">How is this guide?</p>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: (previous?.opinion ?? opinion) === 'good',
            }),
          )}
          onClick={() => {
            setOpinion('good');
          }}
        >
          <ThumbsUp />
          Good
        </button>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: (previous?.opinion ?? opinion) === 'bad',
            }),
          )}
          onClick={() => {
            setOpinion('bad');
          }}
        >
          <ThumbsDown />
          Bad
        </button>
      </div>
      <CollapsibleContent className="mt-3">
        {previous ? (
          <div className="px-3 py-6 flex flex-col items-center gap-3 bg-fd-card text-fd-card-foreground text-sm text-center rounded-xl text-fd-muted-foreground">
            <p>Thank you for your feedback!</p>
            <button
              className={cn(
                buttonVariants({
                  color: 'secondary',
                }),
                'text-xs',
              )}
              onClick={() => {
                setOpinion(previous?.opinion);
                set(url, null);
                setPrevious(null);
              }}
            >
              Submit Again?
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded-lg bg-fd-secondary text-fd-secondary-foreground p-3 resize-none focus-visible:outline-none placeholder:text-fd-muted-foreground"
              placeholder="Leave your feedback..."
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === 'Enter') {
                  submit(e);
                }
              }}
            />
            <button
              type="submit"
              className={cn(buttonVariants({ color: 'outline' }), 'w-fit px-3')}
            >
              Submit
            </button>
          </form>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
```

The `@/lib/cn` import specifier may be different for your project, change it to import your `cn()` function if needed. (e.g. like `@/lib/utils`)

### [How to Use](https://fumadocs.vercel.app/docs/ui/feedback\#how-to-use)

Now add the `<Rate />` component to your docs page:

```
import { DocsPage } from 'fumadocs-ui/page';
import { Rate } from '@/components/rate';
import posthog from 'posthog-js';

export default async function Page() {
  return (
    <DocsPage toc={toc} full={page.data.full}>
      {/* at the bottom of page */}
      <Rate
        onRateAction={async (url, feedback) => {
          'use server';

          await posthog.capture('on_rate_docs', feedback);
        }}
      />
    </DocsPage>
  );
}
```

On above example, it reports user feedback by capturing a `on_rate_docs` event on PostHog.

You can specify your own server action to `onRateAction`, and report the feedback to different destinations like database, or GitHub Discussions via their API.

### [Linking to GitHub Discussion](https://fumadocs.vercel.app/docs/ui/feedback\#linking-to-github-discussion)

To report your feedback to GitHub Discussion, make a custom `onRateAction`.

You can copy this example as a starting point:

lib/github.ts

```
import { App, Octokit } from 'octokit';
import type { Feedback } from '@/components/rate';

export const repo = 'fumadocs';
export const owner = 'fuma-nama';
export const DocsCategory = 'Docs Feedback';

let instance: Octokit | undefined;

async function getOctokit(): Promise<Octokit> {
  if (instance) return instance;
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!appId || !privateKey) {
    throw new Error(
      'No GitHub keys provided for Github app, docs feedback feature will not work.',
    );
  }

  const app = new App({
    appId,
    privateKey,
  });

  const { data } = await app.octokit.request(
    'GET /repos/{owner}/{repo}/installation',
    {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  instance = await app.getInstallationOctokit(data.id);
  return instance;
}

interface RepositoryInfo {
  id: string;
  discussionCategories: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
}

let cachedDestination: RepositoryInfo | undefined;
async function getFeedbackDestination() {
  if (cachedDestination) return cachedDestination;
  const octokit = await getOctokit();

  const {
    repository,
  }: {
    repository: RepositoryInfo;
  } = await octokit.graphql(`
  query {
    repository(owner: "${owner}", name: "${repo}") {
      id
      discussionCategories(first: 25) {
        nodes { id name }
      }
    }
  }
`);

  return (cachedDestination = repository);
}

export async function onRateAction(url: string, feedback: Feedback) {
  'use server';
  const octokit = await getOctokit();
  const destination = await getFeedbackDestination();
  if (!octokit || !destination) return;

  const category = destination.discussionCategories.nodes.find(
    (category) => category.name === DocsCategory,
  );

  if (!category)
    throw new Error(
      `Please create a "${DocsCategory}" category in GitHub Discussion`,
    );

  const title = `Feedback for ${url}`;
  const body = `[${feedback.opinion}] ${feedback.message}\n\n> Forwarded from user feedback.`;

  const {
    search: { nodes: discussions },
  }: {
    search: {
      nodes: { id: string }[];
    };
  } = await octokit.graphql(`
          query {
            search(type: DISCUSSION, query: ${JSON.stringify(`${title} in:title repo:fuma-nama/fumadocs author:@me`)}, first: 1) {
              nodes {
                ... on Discussion { id }
              }
            }
          }`);

  if (discussions.length > 0) {
    await octokit.graphql(`
            mutation {
              addDiscussionComment(input: { body: ${JSON.stringify(body)}, discussionId: "${discussions[0].id}" }) {
                comment { id }
              }
            }`);
  } else {
    await octokit.graphql(`
            mutation {
              createDiscussion(input: { repositoryId: "${destination.id}", categoryId: "${category!.id}", body: ${JSON.stringify(body)}, title: ${JSON.stringify(title)} }) {
                discussion { id }
              }
            }`);
  }
}
```

- Create your own GitHub App and obtain its app ID and private key.
- Fill required environment variables.
- Replace constants like `owner`, `repo`, and `DocsCategory`.

How is this guide?

GoodBad

[Edit on GitHub](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/(integrations)/feedback.mdx)

[Static Export\\
\\
Enable static export with Fumadocs](https://fumadocs.vercel.app/docs/ui/static-export) [llms.txt\\
\\
Output docs content for large language models](https://fumadocs.vercel.app/docs/ui/llms)

