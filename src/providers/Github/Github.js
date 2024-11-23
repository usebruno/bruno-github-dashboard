import { createContext, useContext, useState } from 'react';
import issues from '../../../data/github-data/issues.json';
import prs from '../../../data/github-data/prs.json';
import releases from '../../../data/github-data/releases.json';
import meta from '../../../data/github-data/meta.json';

const GithubContext = createContext({});

export function GithubProvider({ children }) {
  const [githubIssues, setGithubIssues] = useState(issues);
  const [githubPrs, setGithubPrs] = useState(prs);
  const [githubReleases, setGithubReleases] = useState(releases);
  const [githubMeta, setGithubMeta] = useState(meta);
  const value = {
    issues: githubIssues.filter((issue) => !issue.pull_request),
    setIssues: setGithubIssues,
    prs: githubPrs,
    setPrs: setGithubPrs,
    releases: githubReleases,
    setReleases: setGithubReleases,
    meta: githubMeta,
    setMeta: setGithubMeta,
  };

  return (
    <GithubContext.Provider value={value}>
      {children}
    </GithubContext.Provider>
  );
}

export function useGithub() {
  const context = useContext(GithubContext);
  if (context === undefined) {
    throw new Error('useGithub must be used within a GithubProvider');
  }
  return context;
}
