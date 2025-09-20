# Contributing to LyteNyte Grid

Thank you for considering a contribution to **LyteNyte Grid**!  
Your efforts help us improve the project and foster its growth.

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/) as our Code of Conduct.  
All contributors are expected to comply with it.

You can read the full document [here](https://github.com/1771-Technologies/lytenyte/blob/main/CODE_OF_CONDUCT.md) to better understand what behaviors are expected and accepted.

## Ways to Contribute

There are several ways to contribute to LyteNyte Grid. The two most direct are:

- **Opening issues** to report bugs or suggest improvements
- **Submitting pull requests** with code changes

We value both and appreciate the time and effort you put into making contributions.

## Pull Requests

Before submitting a pull request, we encourage you to review [GitHub’s guide to pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests).

LyteNyte Grid welcomes external contributions, but all pull requests will be reviewed before merging. To contribute:

1. Fork the repository
2. Make your changes
3. Open a pull request

### Standards for Pull Requests

All external pull requests must meet these requirements:

- Commits should have clear, descriptive messages
- All CI checks must pass successfully
- All tests must pass without errors

Once you open a pull request, a member of the **1771 Technologies team** will review it and provide feedback.
Please note: opening a pull request does not guarantee acceptance or merging.

## Step-by-Step: Creating a Pull Request for LyteNyte Grid

**Note**: we use `git-lfs` for managing test screenshots. Ensure you have it installed.

1. **Fork the repository**

   ```sh
   git clone https://github.com/<your-username>/lytenyte.git
   cd lytenyte
   git remote add upstream https://github.com/1771-Technologies/lytenyte.git
   ```

2. **Sync your local branch** with the upstream repository

   ```sh
   git checkout main
   git pull upstream main
   git lfs pull # If the files have not already been cloned.
   ```

3. **Install dependencies** we use `pnpm`

   ```sh
   pnpm install
   ```

4. **Create a new branch** for your work

   ```sh
   git checkout -b my-branch-name
   ```

5. **Make changes** and push them to your fork

   ```sh
   git push -u origin HEAD
   ```

6. **Open a pull request** on GitHub and describe your changes.

## License

LyteNyte Grid is available in two editions: **PRO** and **Core**.

- **PRO edition**: Licensed under a commercial license. Any contributions made to PRO code remain under this license, and contributors cannot claim ownership or rights.
- **Core edition**: Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Contributions to Core code will be released under this license.
