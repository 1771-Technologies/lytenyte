# One Play - Simplified Mono Repo Management

One Play (op) is a command line tool that essentially wraps a set of common
JavaScript tools and provides some of its own. The primary goal is to simplify
the maintenance of a monorepo.

One Play expects a specific project structure and uses a specific set of tools.
It is opinionated on many aspects of the project, for example, libraries should
be in the `packages` folder, and the `packages` folder is a flat directory
of packages.

## Commands

- `op init`: used to create a new project
- `op astro`: a pass through to the astro cli. See [Astro CLI](https://docs.astro.build/en/reference/cli-reference/)
- `op compile`: builds a library project and puts it into a publishable state
- `op create`: create a new library package or site package
- `op fmt`: format a package with prettier
- `op lint`: lint a package with eslint
- `op story`: storybook cli. See [Storybook CLI](https://storybook.js.org/docs/api)
- `op test`: vitest cli pass through. See [Vitest CLI](https://vitest.dev/guide/cli.html)
- `op typecheck`: typecheck a package
- `op np`: pnpm cli. See [PNPM CLI](https://pnpm.io/cli/add)
- `op change`: changeset cli. See [Changeset CLI](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md)

## Config

All One Play projects will have a `op.config.toml` file. This file at a minimum contains the
name and npm organization of the project. This is mainly used by commands like `create` to
make new packages.

For example:

```toml
name = "1771 Technologies"
organization = "@lib"
```

The config may also contain a licenses array for listing out new licenses. By default
MIT and Apache 2.0 are configured. Any additional licenses specified are added to the list.

For example:

```toml
name = "1771 Technologies"
organization = "@lib"

[[licenses]]
name = "My license name"
content = """
TOML is greater. This will be the content of my license.
"""
```
