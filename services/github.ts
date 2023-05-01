const perPage: string = Deno.env.get('GITHUB_RETRIEVE')! || '1000';
const GITHUB_API: string = Deno.env.get('GITHUB_API')! || 'https://api.casjay.vercel.app/api/v1/git';

export async function fetchUserInfo(username: string) {
  const response = await fetch(`${GITHUB_API}/user/${username}`);
  return [response.status, await response.json()];
}

export async function fetchRepositories(username: string) {
  const response = await fetch(`${GITHUB_API}/repos/${username}?per_page=${perPage}&sort=full_name`);
  return [response.status, await response.json()];
}

export async function fetchOrganizations(username: string) {
  const response = await fetch(`${GITHUB_API}/orgs/${username}?per_page=${perPage}&sort=full_name`);
  return [response.status, await response.json()];
}

// export async function fetchUserBio(url: string) {
// const response = await fetch(`${url}`);
// return [response.status, await response.json()];
// }
