# Contributing to `react-from-markup`

Contributions are welcomed and encouraged, whether they're questions, ideas, or code.

## Issues

Issues may be used to ask questions or contribute ideas.

Please title your issues succinctly and with meaning.

Descriptions should contain a brief explanation of your issue, followed by a more detailed breakdown.

Where possible, example code will usually make an issue easier to understand. For simple cases, some inline code snippets will suffice. When an issue is more complicated, a full repository that can reproduce a bug can also be very helpful.

## Pull requests

If you've found a bug, and fixed it, feel free to send in a PR.

For new features, please open an issue for discussion before opening a PR.

Note that this project follows the [conventional commits specification](https://www.conventionalcommits.org/). Please keep your commit messages in this format. You may need to squash, fixup, or otherwise rebase your PR before it will be accepted. This is very helpful for changelog generation.

When making a commit, you're encouraged to run `yarn cz`, which will run `commitizen` to structure your commits to the spec.

PRs will normally be subject to a code review. These should be humane, but detailed. Coding should be fun, but it should also be about learning and teaching: a review may involve questions from the reviewer, suggestions to make the code better, or - in some cases - constructive criticism.

## Releases

> N.B. only collaborators can trigger a release

Releases are executed locally, and deployed to `npm` by CI.

To trigger a release:
1. Check out a release branch, ie. `git checkout master && git pull && git checkout -b release/v2.0.0-pre.5`.
2. `git push`, else lerna will throw a minor fit.
3. `yarn release`, to generate changelogs, bump versions, and create tags. **Note: this step will initiate a deployment to npm;  make sure you have it right.** After completing this step, you must complete the remaining steps, even if the release is broken.
5. `git push` again, and open a PR.
6. When the build finishes, merge the PR.
7. Copy the changes from `/CHANGELOG.md` into the GitHub release, on this page: https://github.com/simon360/react-from-markup/releases/edit/YOUR_TAG_NAME_HERE
8. If any issues are discovered with the release, follow up with fixes and a new release.
