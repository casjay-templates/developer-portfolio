/** @jsx h */
import { h } from 'preact';
import { tw } from '@twind';
import { PageProps, Handlers } from '$fresh/server.ts';
import { fetchRepositories } from '../../services/github.ts';
import Repository from '../../components/Repository.tsx';
import Layout from '../../components/Layout.tsx';
import PageHeading from '../../components/PageHeading.tsx';
import { Status } from 'https://deno.land/std@0.146.0/http/http_status.ts';

interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  avatar_url: string;
  html_url: string;
}
export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const username = ctx.params.username;
      if (!username) {
        return new Response(undefined, {
          status: Status.Found,
          headers: {
            location: '/',
          },
        });
      }
      const [status, repos] = await fetchRepositories(username);

      if (status !== Status.OK) {
        return new Response(undefined, {
          status: Status.Found,
          headers: {
            location: '/',
          },
        });
      }
      return ctx.render({ repos });
    } catch (error) {
      console.log(error);
      return new Response(undefined, {
        status: Status.Found,
        headers: {
          location: '/',
        },
      });
    }
  },
};

export default function Repositories({ data, params }: PageProps<{ repos: Repository[] }>) {
  const repos = data?.repos;
  const username = params.username;
  return (
    <Layout title={`${username} | Repository`}>
      <div className={tw`max-w-5xl mx-auto `}>
        <PageHeading heading='Repositories' backHref={`/${username}`} />
        <div className={tw`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4`}>
          {repos.map((repo) => (
            <Repository
              id={repo.id}
              name={repo.name}
              language={repo.language}
              isPrivate={repo.private}
              avatar_url={repo.avatar_url}
              forks_count={repo.forks_count}
              description={repo.description}
              stargazers_count={repo.stargazers_count}
              html_url={repo.html_url}
              key={repo.id}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
