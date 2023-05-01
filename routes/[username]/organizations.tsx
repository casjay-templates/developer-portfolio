/** @jsx h */
import { h } from 'preact';
import { tw } from '@twind';
import { PageProps, Handlers } from '$fresh/server.ts';
import { fetchOrganizations } from '../../services/github.ts';
import Repository from '../../components/Repository.tsx';
import Layout from '../../components/Layout.tsx';
import PageHeading from '../../components/PageHeading.tsx';
import { Status } from 'https://deno.land/std@0.146.0/http/http_status.ts';

interface Repository {
  id: number;
  login: string;
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
      const [status, repos] = await fetchOrganizations(username);

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

export default function Organizations({ data, params }: PageProps<{ repos: Repository[] }>) {
  const repos = data?.repos;
  const username = params.username;
  return (
    <Layout title={`${username} | Repository`}>
      <div className={tw`max-w-5xl mx-auto `}>
        <PageHeading heading='Organizations' backHref={`/${username}`} />
        <div className={tw`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4`}>
          {repos.map((repo) => (
            <Repository
              id={repo.id}
              name={repo.login}
              avatar_url={repo.avatar_url}
              description={repo.description}
              isPrivate={repo.private}
              forks_count={repo.forks_count}
              language={repo.language}
              stargazers_count={repo.stargazers_count}
              key={repo.id}
              html_url={`/${repo.login}`}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
