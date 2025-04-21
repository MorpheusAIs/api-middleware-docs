'use server'; // Mark this module as Server Actions

import { App, Octokit } from 'octokit';
import type { Feedback } from '@/components/rate';

// --- Configuration ---
// Keep constants internal to the module
const owner = 'MorpheusAIs';
const repo = 'api-middleware-docs';
const DocsCategory = 'Docs Feedback';
// -------------------

let instance: Octokit | undefined;

async function getOctokit(): Promise<Octokit> {
  if (instance) return instance;
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\n/g, '\n'); // Ensure newlines are correct

  if (!appId || !privateKey) {
    console.error('GitHub App ID or Private Key not configured.');
    throw new Error(
      'GitHub App credentials not provided. Feedback feature is disabled.',
    );
  }

  try {
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
  } catch (error) {
    console.error("Error initializing Octokit:", error);
    throw new Error("Failed to initialize GitHub connection.");
  }
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
async function getFeedbackDestination(): Promise<RepositoryInfo> {
  if (cachedDestination) return cachedDestination;
  const octokit = await getOctokit();

  try {
    const { repository }: { repository: RepositoryInfo } = await octokit.graphql(
      `
      query GetRepoInfo($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          id
          discussionCategories(first: 25) {
            nodes { id name }
          }
        }
      }
      `,
      { owner, repo }, // Pass variables here
    );

    return (cachedDestination = repository);
  } catch (error) {
    console.error("Error fetching repository info:", error);
    throw new Error("Failed to fetch GitHub repository information.");
  }
}

export async function onRateAction(url: string, feedback: Feedback) {
  console.log('Received feedback for:', url, feedback);

  try {
    const octokit = await getOctokit();
    const destination = await getFeedbackDestination();

    const category = destination.discussionCategories.nodes.find(
      (cat) => cat.name === DocsCategory,
    );

    if (!category) {
      console.error(`Discussion category '${DocsCategory}' not found in repository.`);
      throw new Error(
        `Please create a "${DocsCategory}" category in GitHub Discussions.`,
      );
    }

    const title = `Feedback for ${url}`;
    const body = `**[${feedback.opinion === 'good' ? '👍 Good' : '👎 Bad'}]**

${feedback.message || '_(No message provided)_'}

> Forwarded from user feedback.`;
    const query = `${JSON.stringify(`${title} in:title repo:${owner}/${repo} author:@me`)}`;

    // Search for existing discussion by title
    const { search }: { search: { nodes: { id: string }[] } } = await octokit.graphql(
        `
        query SearchDiscussion($query: String!) {
          search(type: DISCUSSION, query: $query, first: 1) {
            nodes {
              ... on Discussion {
                id
              }
            }
          }
        }
        `,
        { query }, // Pass query variable
      );

    if (search.nodes.length > 0) {
      console.log('Found existing discussion, adding comment:', search.nodes[0].id);
      // Add comment to existing discussion
      await octokit.graphql(
        `
        mutation AddComment($discussionId: ID!, $body: String!) {
          addDiscussionComment(input: { body: $body, discussionId: $discussionId }) {
            comment { id }
          }
        }
        `,
        { discussionId: search.nodes[0].id, body }, // Pass variables
      );
      console.log('Comment added successfully.');
    } else {
      console.log('Creating new discussion...');
      // Create new discussion
      await octokit.graphql(
        `
        mutation CreateDiscussion($repoId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
          createDiscussion(input: { repositoryId: $repoId, categoryId: $categoryId, body: $body, title: $title }) {
            discussion { id }
          }
        }
        `,
        {
          repoId: destination.id,
          categoryId: category.id,
          title,
          body,
        }, // Pass variables
      );
      console.log('New discussion created successfully.');
    }
  } catch (error) {
    console.error('Failed to process feedback action:', error);
    // Optional: re-throw or handle error appropriately for the client
    // For now, we just log it server-side.
  }
} 