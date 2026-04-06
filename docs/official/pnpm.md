# pnpm Documentation

**Official Documentation:** https://pnpm.io/  
**Version:** 10.33.0  
**Latest Release:** https://github.com/pnpm/pnpm/releases  
**Release Status:** Active (Security by Default since v10.0)

## Overview

**pnpm: Save time. Save disk space. Supercharge your monorepos.**

Get lightning-fast installation speeds and a smarter, safer way to manage dependencies.

pnpm is a fast, disk space efficient package manager. It uses a content-addressable store to store all packages, and uses hard links or symlinks to create node_modules structures. This approach saves significant disk space and provides faster installation times compared to npm or yarn.

### Key Philosophy

- **Security by Default**: pnpm v10+ introduced a security-first approach, blocking lifecycle scripts by default
- **Efficiency**: Content-addressable storage with hard links for minimal disk usage
- **Strictness**: Validates all options and prevents common npm/Yarn pitfalls
- **Monorepo-First**: Built-in workspace support with advanced features

## Motivation

### Saving disk space

When using npm, if you have 100 projects using a dependency, you will have 100 copies of that dependency saved on disk. With pnpm, the dependency will be stored in a content-addressable store, so:

1. If you depend on different versions of the dependency, only the files that differ are added to the store. For instance, if it has 100 files, and a new version has a change in only one of those files, pnpm update will only add 1 new file to the store, instead of cloning the entire dependency just for the singular change.
2. All the files are saved in a single place on the disk. When packages are installed, their files are hard-linked from that single place, consuming no additional disk space. This allows you to share dependencies of the same version across projects.

As a result, you save a lot of space on your disk proportional to the number of projects and dependencies, and you have a lot faster installations!

### Boosting installation speed

pnpm performs installation in three stages:
1. **Dependency resolution.** All required dependencies are identified and fetched to the store.
2. **Directory structure calculation.** The node_modules directory structure is calculated based on the dependencies.
3. **Linking dependencies.** All remaining dependencies are fetched and hard linked from the store to node_modules.

This approach is significantly faster than the traditional three-stage installation process of resolving, fetching, and writing all dependencies to node_modules.

### Creating a non-flat node_modules directory

When installing dependencies with npm or Yarn Classic, all packages are hoisted to the root of the modules directory. As a result, source code has access to dependencies that are not added as dependencies to the project.

By default, pnpm uses symlinks to add only the direct dependencies of the project into the root of the modules directory.

If your tooling doesn't work well with symlinks, you may still use pnpm and set the [nodeLinker](https://pnpm.io/settings) setting to `hoisted`. This will instruct pnpm to create a node_modules directory that is similar to those created by npm and Yarn Classic.

## Installation

### Prerequisites

If you don't use the standalone script or @pnpm/exe to install pnpm, then you need to have Node.js (at least v18.12) to be installed on your system.

### Using a standalone script

You may install pnpm even if you don't have Node.js installed, using the following scripts.

#### On Windows

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

#### On POSIX systems

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### In a Docker container

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Installing a specific version

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -s -- --version=10.33.0
```

### Using Corepack

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Using other package managers

#### Using npm

```bash
npm install -g pnpm
```

#### Using Homebrew

```bash
brew install pnpm
```

#### Using winget

```bash
winget install pnpm
```

#### Using Scoop

```bash
scoop install pnpm
```

#### Using Choco

```bash
choco install pnpm
```

#### Using Volta

```bash
volta install pnpm
```

### Compatibility

pnpm works on:
- Windows
- macOS
- Linux

### Troubleshooting

If pnpm is not found, you might need to close and reopen your terminal or add the pnpm installation directory to your PATH environment variable.

### Using a shorter alias

```bash
alias pn=pnpm
```

### Updating pnpm

```bash
pnpm add -g pnpm
```

### Uninstalling pnpm

```bash
npm uninstall -g pnpm
```

## pnpm CLI

### Differences vs npm

Unlike npm, pnpm validates all options. For example, `pnpm install --target_arch x64` will fail as `--target_arch` is not a valid option for `pnpm install`.

However, some dependencies may use the `npm_config_` environment variable, which is populated from the CLI options. In this case, you have the following options:

1. explicitly set the env variable: `npm_config_target_arch=x64 pnpm install`
2. force the unknown option with `--config.`: `pnpm install --config.target_arch=x64`

### Options

#### -C <path>, --dir <path>

Run as if pnpm was started in the `<path>` directory instead of the current working directory.

#### -w, --workspace-root

Run as if pnpm was started in the workspace root directory instead of the current working directory.

## Commands

### pnpm add <pkg>

Installs a package and any packages that it depends on.

#### TL;DR

```bash
pnpm add sax # saves to dependencies
pnpm add -D sax # saves to devDependencies
pnpm add -O sax # saves to optionalDependencies
pnpm add -g sax # installs globally
pnpm add sax@next # installs from the "next" tag
pnpm add sax@3.0.0 # installs version 3.0.0
```

#### Supported package sources

pnpm supports installing packages from various sources:

##### Trusted sources
- **npm registry**: Default registry source
- **JSR registry**: Native JSR support with `jsr:` protocol
- **Workspace packages**: Local workspace dependencies
- **Local file system**: Tarballs and directories

##### Exotic sources
- **Remote tarballs**: Direct URL to tarball
- **Git repositories**: Git-based dependencies with semver support

#### Options

##### --save-prod, -P

Save the package to `dependencies`.

##### --save-dev, -D

Save the package to `devDependencies`.

##### --save-optional, -O

Save the package to `optionalDependencies`.

##### --save-exact, -E

Save the exact version specified.

##### --save-peer

Save the package to `peerDependencies`.

##### --save-catalog

Save the package to the catalog.

##### --save-catalog-name <catalog_name>

Save the package to a named catalog.

##### --config

Use the specified configuration.

##### --ignore-workspace-root-check

Skip the workspace root check.

##### --global, -g

Install the package globally.

##### --workspace

Install the package in the workspace.

##### --allow-build

Allow building the package.

##### --filter <package_selector>

Filter packages to run the command on.

##### --cpu=<name>

Override the CPU architecture.

##### --os=<name>

Override the operating system.

##### --libc=<name>

Override the libc family.

## Security by Default (v10.0+)

### Overview

The most significant shift in pnpm v10.0 was the move to "Security by Default." pnpm stopped implicitly trusting installed packages, introducing multiple layers of security protection.

### Blocking Lifecycle Scripts (v10.0)

For years, pnpm install meant trusting the entire dependency tree to execute arbitrary code. In v10, this was turned off. pnpm no longer runs preinstall or postinstall scripts by default, eliminating a massive class of supply chain attack vectors.

```bash
pnpm install
```

Blocked by default:
- `preinstall`
- `postinstall`

### allowBuilds Configuration (v10.26)

Introduced in v10.26, replacing the earlier `onlyBuiltDependencies` with a more flexible configuration:

```yaml
allowBuilds:
  esbuild: true
  nx@21.6.4: true
```

### Defense in Depth (v10.16 & v10.21)

Multiple layers of defense to catch malicious packages before they reach your disk:

#### minimumReleaseAge

Blocks "zero-day" releases (e.g., packages younger than 24 hours), giving the community time to flag malicious updates.

```yaml
minimumReleaseAge: 1440 # 1 day in minutes
```

#### trustPolicy: no-downgrade

Prevents installing updates that have weaker provenance than previous versions (e.g., a version published without CI/CD verification).

```yaml
trustPolicy: no-downgrade
```

#### blockExoticSubdeps

Prevents trusted dependencies from pulling in transitive dependencies from untrusted sources.

```yaml
blockExoticSubdeps: true
```

## Global Virtual Store (v10.12+)

### Overview

One of pnpm's original innovations was the content-addressable store, which saved disk space by deduplicating files. In v10.12, this was extended with the Global Virtual Store.

### Configuration

```yaml
enableGlobalVirtualStore: true
```

### Benefits

1. **Massive Disk Savings**: Identical dependency graphs are shared across projects.
2. **Faster Installs**: If you have 10 projects using react@19, pnpm only needs to link it once globally.

### How it Works

Previously, projects had their own node_modules structure. With `enableGlobalVirtualStore: true`, pnpm links dependencies from a central location on disk directly into your project. The central store is located at `<store-path>/links`.

### ESM Considerations

If your dependencies are ESM and they import packages not declared in their own package.json, you may run into resolution errors. Solutions:

- Use `packageExtensions` to explicitly add missing dependencies
- Add the `@pnpm/plugin-esm-node-path` config dependency to restore NODE_PATH support for ESM

## Native JSR Support (v10.9+)

### Overview

pnpm embraced the new JSR registry with native support. You can install packages directly from JSR using the `jsr:` protocol.

### Usage

```bash
pnpm add jsr:@std/collections
pnpm add jsr:@hono/hono@4
pnpm add jsr:@hono/hono@latest
```

### Integration

This maps correctly in package.json and handles the unique resolution rules of JSR packages seamlessly alongside your npm dependencies.

## Config Dependencies (v10.0+)

### Overview

For monorepos and complex setups, pnpm introduced Config Dependencies. This feature allows you to share and centralize pnpm configuration—like hooks, patches, and build permissions—across multiple projects.

### How it Works

Config dependencies are installed into `node_modules/.pnpm-config` before the main dependency graph is resolved.

### Adding a Config Dependency

```bash
pnpm add --config my-configs
```

This adds to your pnpm-workspace.yaml:

```yaml
configDependencies:
  my-configs: "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
```

### Usage Examples

#### Loading an Allow List of Built Dependencies

```yaml
configDependencies:
  '@myorg/trusted-deps': 0.1.0+sha512-IERT0uXPBnSZGsCmoSuPzYNWhXWWnKkuc9q78KzLdmDWJhnrmvc7N4qaHJmaNKIusdCH2riO3iE34Osohj6n8w==
onlyBuiltDependenciesFile: node_modules/.pnpm-config/@myorg/trusted-deps/allow.json
```

#### Installing Dependencies Used in Hooks

```javascript
// .pnpmfile.cjs
const { readPackage } = require('.pnpm-config/my-hooks')
module.exports = {
  hooks: { readPackage }
}
```

#### Updating pnpm Settings Dynamically

```javascript
module.exports = {
  hooks: {
    updateConfig (config) {
      config.catalogs.default ??= {}
      config.catalogs.default['is-odd'] = '1.0.0'
      return config
    }
  }
}
```

## Automatic JavaScript Runtime Management (v10.14 & v10.21)

### Overview

pnpm extended runtime management to support Node.js, Deno, and Bun automatically.

### Configuration

Specify the required runtime in package.json via `devEngines.runtime`:

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "24.6.0"
    }
  }
}
```

### Benefits

pnpm will automatically download and use that specific version of the runtime for running scripts in that project. This makes "Works on my machine" a thing of the past—everyone on the team uses the exact same runtime, managed entirely by pnpm.

## Workspace

pnpm has built-in support for monorepositories (AKA multi-package repositories, multi-project workspaces, or monorepos). This means you can create a workspace to manage multiple packages with a single set of dependencies.

### Workspace protocol (workspace:)

If `linkWorkspacePackages` is set to `true`, pnpm will link packages from the workspace if the available packages match the declared ranges. For instance, `foo@1.0.0` is linked into `bar` if `bar` has `"foo": "^1.0.0"` in its dependencies and `foo@1.0.0` is in the workspace. However, if `bar` has `"foo": "2.0.0"` in dependencies and `foo@2.0.0` is not in the workspace, `foo@2.0.0` will be installed from the registry. This behavior introduces some uncertainty.

Luckily, pnpm supports the `workspace:` protocol. When this protocol is used, pnpm will refuse to resolve to anything other than a local workspace package. So, if you set `"foo": "workspace:2.0.0"`, this time installation will fail because `"foo@2.0.0"` isn't present in the workspace.

This protocol is especially useful when the `linkWorkspacePackages` option is set to `false`. In that case, pnpm will only link packages from the workspace if the `workspace:` protocol is used.

#### Referencing workspace packages through aliases

When referencing a workspace package via an alias, the alias should be prefixed with `workspace:`, and the package name should be suffixed with `@`. For example, in this package.json:

```json
{
  "dependencies": {
    "foo": "workspace:*",
    "bar": "workspace:baz@*",
    "qar": "workspace:qux@1.0.0"
  }
}
```

`foo` is the `foo` package from the workspace, `bar` is the `baz` package from the workspace (aliased as `bar`), and `qar` is the `qux` package from the workspace with version `1.0.0`.

#### Referencing workspace packages through their relative path

In addition to the `workspace:` protocol, pnpm allows referencing workspace packages via their relative path. This is useful when you want to reference a package that is not in the same directory as the current package.

```json
{
  "dependencies": {
    "foo": "file:../foo"
  }
}
```

#### Publishing workspace packages

When a workspace package is published, its dependencies that use the `workspace:` protocol are converted to regular version ranges. This is done so that the published package can be installed by users who are not using a workspace.

For example, if you have a package with the following dependencies:

```json
{
  "dependencies": {
    "foo": "workspace:*",
    "bar": "workspace:1.0.0"
  }
}
```

When the package is published, the dependencies will be converted to:

```json
{
  "dependencies": {
    "foo": "^1.0.0",
    "bar": "1.0.0"
  }
}
```

### Usage examples

#### Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

#### linkWorkspacePackages

When `true`, packages from the workspace are linked to `node_modules` of the workspace root. This means that you can import packages from the workspace as if they were installed from the registry.

```yaml
# pnpm-workspace.yaml
linkWorkspacePackages: true
```

#### injectWorkspacePackages

When `true`, pnpm injects workspace packages into the `node_modules` directory of all workspace packages. This is useful when you want to use workspace packages in all workspace packages without having to explicitly add them as dependencies.

```yaml
# pnpm-workspace.yaml
injectWorkspacePackages: true
```

#### dedupeInjectedDeps

When `true`, pnpm deduplicates injected dependencies. This means that if multiple workspace packages inject the same dependency, pnpm will only inject one copy of the dependency.

```yaml
# pnpm-workspace.yaml
dedupeInjectedDeps: true
```

#### syncInjectedDepsAfterScripts

When `true`, pnpm synchronizes injected dependencies after running scripts. This ensures that injected dependencies are always up-to-date.

```yaml
# pnpm-workspace.yaml
syncInjectedDepsAfterScripts: true
```

#### preferWorkspacePackages

When `true`, pnpm prefers workspace packages over registry packages. This means that if a workspace package and a registry package have the same name and version, pnpm will use the workspace package.

```yaml
# pnpm-workspace.yaml
preferWorkspacePackages: true
```

#### sharedWorkspaceLockfile

When `true`, pnpm uses a shared lockfile for all workspace packages. This means that all workspace packages share the same lockfile, which can improve performance and reduce the size of the lockfile.

```yaml
# pnpm-workspace.yaml
sharedWorkspaceLockfile: true
```

#### saveWorkspaceProtocol

When `true`, pnpm saves the `workspace:` protocol to package.json files. This means that when you add a workspace package as a dependency, pnpm will use the `workspace:` protocol instead of the version range.

```yaml
# pnpm-workspace.yaml
saveWorkspaceProtocol: true
```

#### includeWorkspaceRoot

When `true`, pnpm includes the workspace root in the dependency resolution process. This means that the workspace root can be used as a dependency.

```yaml
# pnpm-workspace.yaml
includeWorkspaceRoot: true
```

#### ignoreWorkspaceCycles

When `true`, pnpm ignores cycles in the workspace dependency graph. This can be useful when you have circular dependencies in your workspace.

```yaml
# pnpm-workspace.yaml
ignoreWorkspaceCycles: true
```

#### disallowWorkspaceCycles

When `true`, pnpm disallows cycles in the workspace dependency graph. This means that if you have circular dependencies in your workspace, pnpm will fail.

```yaml
# pnpm-workspace.yaml
disallowWorkspaceCycles: true
```

#### failIfNoMatch

When `true`, pnpm fails if no workspace package matches the specified package selector. This can be useful when you want to ensure that a workspace package exists.

```yaml
# pnpm-workspace.yaml
failIfNoMatch: true
```

## Catalogs

"Catalogs" are a workspace feature for defining dependency version ranges as reusable constants. Constants defined in catalogs can later be referenced in package.json files.

### The Catalog Protocol (catalog:)

Once a catalog is defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'

# Define a catalog of version ranges.
catalog:
  react: ^18.3.1
  redux: ^5.0.1
```

The `catalog:` protocol can be used instead of the version range itself.

```json
{
  "name": "@example/app",
  "dependencies": {
    "react": "catalog:react",
    "redux": "catalog:redux"
  }
}
```

This is equivalent to writing a version range (e.g. `^18.3.1`) directly:

```json
{
  "name": "@example/app",
  "dependencies": {
    "react": "^18.3.1",
    "redux": "^5.0.1"
  }
}
```

You may use the `catalog:` protocol in the next fields:

- **package.json:**
  - `dependencies`
  - `devDependencies`
  - `peerDependencies`
  - `optionalDependencies`

- **pnpm-workspace.yaml:**
  - `overrides`

The `catalog:` protocol allows an optional name after the colon (ex: `catalog:name`) to specify which catalog should be used. When a name is omitted, the default catalog is used.

### Advantages

In a workspace (i.e. monorepo or multi-package repo) it's common for the same dependency to be used by many packages. Catalogs reduce duplication when authoring package.json files and provide a few benefits in doing so:

- **Maintain unique versions** — It's usually desirable to have only one version of a dependency in a workspace. Catalogs make this easier to maintain. Duplicated dependencies can conflict at runtime and cause bugs. Duplicates also increase size when using a bundler.
- **Easier upgrades** — When upgrading a dependency, only the catalog entry in `pnpm-workspace.yaml` needs to be edited rather than all package.json files using that dependency. This saves time — only one line needs to be changed instead of many.
- **Fewer merge conflicts** — Since package.json files do not need to be edited when upgrading a dependency, git merge conflicts no longer happen in these files.

### Defining Catalogs

Catalogs are defined in the `pnpm-workspace.yaml` file. There are two ways to define catalogs:

1. Using the (singular) `catalog` field to create a catalog named `default`.
2. Using the (plural) `catalogs` field to create arbitrarily named catalogs.

If you have an existing workspace that you want to migrate to using catalogs, you can use the following codemod:

```bash
pnpx codemod pnpm/catalog
```

#### Default Catalog

The top-level `catalog` field allows users to define a catalog named `default`.

```yaml
catalog:
  react: ^18.2.0
  react-dom: ^18.2.0
```

These version ranges can be referenced through `catalog:default`. For the default catalog only, a special `catalog:` shorthand can also be used. Think of `catalog:` as a shorthand that expands to `catalog:default`.

#### Named Catalogs

Multiple catalogs with arbitrarily chosen names can be configured under the `catalogs` key.

```yaml
catalogs:
  # Can be referenced through "catalog:react17"
  react17:
    react: ^17.0.2
    react-dom: ^17.0.2
  # Can be referenced through "catalog:react18"
  react18:
    react: ^18.2.0
    react-dom: ^18.2.0
```

A default catalog can be defined alongside multiple named catalogs. This might be useful in a large multi-package repo that's migrating to a newer version of a dependency piecemeal.

```yaml
catalog:
  react: ^16.14.0
  react-dom: ^16.14.0
catalogs:
  # Can be referenced through "catalog:react17"
  react17:
    react: ^17.0.2
    react-dom: ^17.0.2
  # Can be referenced through "catalog:react18"
  react18:
    react: ^18.2.0
    react-dom: ^18.2.0
```

### Publishing

When a workspace package is published, its dependencies that use the `catalog:` protocol are converted to regular version ranges. This is done so that the published package can be installed by users who are not using a workspace.

For example, if you have a package with the following dependencies:

```json
{
  "dependencies": {
    "react": "catalog:react",
    "redux": "catalog:redux"
  }
}
```

When the package is published, the dependencies will be converted to:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "redux": "^5.0.1"
  }
}
```

### Settings

#### catalogMode

Specifies how the catalog should be used.

- `strict` (default): Only allow catalog entries to be used.
- `relaxed`: Allow catalog entries to be used, but also allow regular version ranges.

```yaml
# pnpm-workspace.yaml
catalogMode: strict
```

#### cleanupUnusedCatalogs

When `true`, pnpm removes unused catalogs from the lockfile. This can be useful when you want to keep the lockfile clean.

```yaml
# pnpm-workspace.yaml
cleanupUnusedCatalogs: true
```

## Settings (pnpm-workspace.yaml)

pnpm gets its configuration from the command line, environment variables, `pnpm-workspace.yaml`, and `.npmrc` files.

### Dependency Resolution

#### overrides

Override specific packages in the dependency tree.

```yaml
# pnpm-workspace.yaml
overrides:
  foo: ^1.0.0
  bar@2.0.0: ^2.1.0
```

#### packageExtensions

Add missing fields to packages.

```yaml
# pnpm-workspace.yaml
packageExtensions:
  "foo@*":
    peerDependencies:
      bar: "*"
  "bar@*":
    peerDependencies:
      baz: "*"
```

#### allowedDeprecatedVersions

Allow specific deprecated versions of packages.

```yaml
# pnpm-workspace.yaml
allowedDeprecatedVersions:
  foo: "1.0.0"
  bar: "2.0.0"
```

#### updateConfig

Configure how packages should be updated.

##### updateConfig.ignoreDependencies

Sometimes you can't update a dependency. For instance, the latest version of the dependency started to use ESM but your project is not yet in ESM. Annoyingly, such a package will be always printed out by the `pnpm outdated` command and updated, when running `pnpm update --latest`. However, you may list packages that you don't want to upgrade in the ignoreDependencies field:

```yaml
updateConfig:
  ignoreDependencies:
    - load-json-file
```

Patterns are also supported, so you may ignore any packages from a scope: `@babel/*`.

```yaml
updateConfig:
  ignoreDependencies:
    - "@babel/*"
```

#### supportedArchitectures

You can specify architectures for which you'd like to install optional dependencies, even if they don't match the architecture of the system running the install.

For example, the following configuration tells to install optional dependencies for Windows x64:

```yaml
supportedArchitectures:
  os:
    - win32
  cpu:
    - x64
```

Whereas this configuration will install optional dependencies for Windows, macOS, and the architecture of the system currently running the install. It includes artifacts for both x64 and arm64 CPUs:

```yaml
supportedArchitectures:
  os:
    - win32
    - darwin
    - current
  cpu:
    - x64
    - arm64
```

Additionally, supportedArchitectures also supports specifying the libc of the system.

```yaml
supportedArchitectures:
  libc:
    - glibc
    - musl
```

#### ignoredOptionalDependencies

If an optional dependency has its name included in this array, it will be skipped. For example:

```yaml
ignoredOptionalDependencies:
  - fsevents
  - "@esbuild/*"
```

#### minimumReleaseAge

Added in: v10.16.0
- Default: 0
- Type: number (minutes)

To reduce the risk of installing compromised packages, you can delay the installation of newly published versions. In most cases, malicious releases are discovered and removed from the registry within an hour.

`minimumReleaseAge` defines the minimum number of minutes that must pass after a version is published before pnpm will install it. This applies to all dependencies, including transitive ones.

For example, the following setting ensures that only packages released at least one day ago can be installed:

```yaml
minimumReleaseAge: 1440
```

#### minimumReleaseAgeExclude

Added in: v10.16.0
- Default: undefined
- Type: string[]

If you set `minimumReleaseAge` but need certain dependencies to always install the newest version immediately, you can list them under `minimumReleaseAgeExclude`. The exclusion works by package name and applies to all versions of that package.

Example:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
  - webpack
  - react
```

Added in: v10.17.0
You may also use patterns. For instance, allow all packages from your org:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
  - '@myorg/*'
```

Added in: v10.19.0
You may also exempt specific versions (or a list of specific versions using a disjunction with `||`). This allows pinning exceptions to mature-time rules:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
  - nx@21.6.5
  - webpack@4.47.0 || 5.102.1
```

#### trustPolicy

Added in: v10.21.0
- Default: off
- Type: no-downgrade | off

When set to `no-downgrade`, pnpm will fail if a package's trust level has decreased compared to previous releases. For example, if a package was previously published by a trusted publisher but now only has provenance or no trust evidence, installation will fail. This helps prevent installing potentially compromised versions. Trust checks are based solely on publish date, not semver. A package cannot be installed if any earlier-published version had stronger trust evidence. Starting in v10.24.0, prerelease versions are ignored when evaluating trust evidence for a non-prerelease install, so a trusted prerelease cannot block a stable release that lacks trust evidence.

#### trustPolicyExclude

Added in: v10.22.0
- Default: []
- Type: string[]

A list of package selectors that should be excluded from the trust policy check. This allows you to install specific packages or versions even if they don't satisfy the `trustPolicy` requirement.

For example:

```yaml
trustPolicy: no-downgrade
trustPolicyExclude:
  - 'chokidar@4.0.3'
  - 'webpack@4.47.0 || 5.102.1'
  - '@babel/core@7.28.5'
```

#### trustPolicyIgnoreAfter

Added in: v10.27.0
- Default: undefined
- Type: number (minutes)

Allows ignoring the trust policy check for packages published more than the specified number of minutes ago. This is useful when enabling strict trust policies, as it allows older versions of packages (which may lack a process for publishing with signatures or provenance) to be installed without manual exclusion, assuming they are safe due to their age.

#### blockExoticSubdeps

Added in: v10.26.0
- Default: false
- Type: Boolean

When set to `true`, only direct dependencies (those listed in your root package.json) may use exotic sources (like git repositories or direct tarball URLs). All transitive dependencies must be resolved from a trusted source, such as the configured registry, local file paths, workspace links, or trusted GitHub repositories (node, bun, deno).

This setting helps secure the dependency supply chain by preventing transitive dependencies from pulling in code from untrusted locations.

Exotic sources include:
- Git repositories (`git+ssh://...`)
- Direct URL links to tarballs (`https://.../package.tgz`)

### Dependency Hoisting Settings

#### hoist

Hoist packages to the root of the node_modules directory.

```yaml
# pnpm-workspace.yaml
hoist: true
```

#### hoistWorkspacePackages

Hoist workspace packages to the root of the node_modules directory.

```yaml
# pnpm-workspace.yaml
hoistWorkspacePackages: true
```

#### hoistPattern

Pattern for packages to hoist.

```yaml
# pnpm-workspace.yaml
hoistPattern:
  - "*"
  - "!foo"
```

#### publicHoistPattern

Pattern for packages to publicly hoist.

```yaml
# pnpm-workspace.yaml
publicHoistPattern:
  - "*types*"
  - "@types/*"
```

#### shamefullyHoist

Shamefully hoist all packages.

```yaml
# pnpm-workspace.yaml
shamefullyHoist: true
```

### Node-Modules Settings

#### modulesDir

Directory for node_modules.

```yaml
# pnpm-workspace.yaml
modulesDir:
  - "node_modules"
```

#### nodeLinker

Type of node linker to use.

```yaml
# pnpm-workspace.yaml
nodeLinker: "isolated" # or "hoisted" or "pnp"
```

#### symlink

Create symlinks.

```yaml
# pnpm-workspace.yaml
symlink: true
```

#### enableModulesDir

Enable modules directory.

```yaml
# pnpm-workspace.yaml
enableModulesDir: true
```

#### virtualStoreDir

Directory for virtual store.

```yaml
# pnpm-workspace.yaml
virtualStoreDir: "node_modules/.pnpm"
```

#### virtualStoreDirMaxLength

Maximum length of virtual store directory.

```yaml
# pnpm-workspace.yaml
virtualStoreDirMaxLength: 120
```

#### packageImportMethod

Method for importing packages.

```yaml
# pnpm-workspace.yaml
packageImportMethod: "clone" # or "copy" or "hardlink"
```

#### modulesCacheMaxAge

Maximum age of modules cache.

```yaml
# pnpm-workspace.yaml
modulesCacheMaxAge: 7d
```

#### dlxCacheMaxAge

Maximum age of dlx cache.

```yaml
# pnpm-workspace.yaml
dlxCacheMaxAge: 1d
```

#### enableGlobalVirtualStore

Added in: v10.12.1
- Default: false (always false in CI)
- Type: Boolean
- Status: Experimental

When enabled, node_modules contains only symlinks to a central virtual store, rather than to node_modules/.pnpm. By default, this central store is located at `<store-path>/links` (use `pnpm store path` to find `<store-path>`).

In the central virtual store, each package is hard linked into a directory whose name is the hash of its dependency graph. As a result, all projects on the system can symlink their dependencies from this shared location on disk. This approach is conceptually similar to how [NixOS manages packages](https://nixos.org/guides/how-nix-works/), using dependency graph hashes to create isolated and shareable package directories in the Nix store.

This should not be confused with the global content-addressable store. The actual package files are still hard linked from the content-addressable store—but instead of being linked directly into node_modules/.pnpm, they are linked into the global virtual store.

Using a global virtual store can significantly speed up installations when a warm cache is available. However, in CI environments (where caches are typically absent), it may slow down installation. If pnpm detects that it is running in CI, this setting is automatically disabled.

To support hoisted dependencies when using a global virtual store, pnpm relies on the NODE_PATH environment variable. This allows Node.js to resolve packages from the hoisted node_modules directory. However, this workaround does not work with ESM modules, because Node.js no longer respects NODE_PATH when using ESM.

If your dependencies are ESM and they import packages not declared in their own package.json (which is considered bad practice), you'll likely run into resolution errors. There are two ways to fix this:

- Use `packageExtensions` to explicitly add the missing dependencies.
- Add the `@pnpm/plugin-esm-node-path` config dependency to your project. This plugin registers a custom ESM loader that restores NODE_PATH support for ESM, allowing hoisted dependencies to be resolved correctly.

```yaml
enableGlobalVirtualStore: true
```

### Store Settings

#### storeDir

Directory for store.

```yaml
# pnpm-workspace.yaml
storeDir: "~/.pnpm-store"
```

#### verifyStoreIntegrity

Verify store integrity.

```yaml
# pnpm-workspace.yaml
verifyStoreIntegrity: true
```

#### useRunningStoreServer

Use running store server.

```yaml
# pnpm-workspace.yaml
useRunningStoreServer: true
```

#### strictStorePkgContentCheck

Strict store package content check.

```yaml
# pnpm-workspace.yaml
strictStorePkgContentCheck: true
```

### Lockfile Settings

#### lockfile

Path to lockfile.

```yaml
# pnpm-workspace.yaml
lockfile: "pnpm-lock.yaml"
```

#### preferFrozenLockfile

Prefer frozen lockfile.

```yaml
# pnpm-workspace.yaml
preferFrozenLockfile: true
```

#### lockfileIncludeTarballUrl

Include tarball URL in lockfile.

```yaml
# pnpm-workspace.yaml
lockfileIncludeTarballUrl: true
```

#### gitBranchLockfile

Use git branch for lockfile.

```yaml
# pnpm-workspace.yaml
gitBranchLockfile: true
```

#### mergeGitBranchLockfilesBranchPattern

Pattern for merging git branch lockfiles.

```yaml
# pnpm-workspace.yaml
mergeGitBranchLockfilesBranchPattern: "dependabot/*"
```

#### peersSuffixMaxLength

Maximum length of peers suffix.

```yaml
# pnpm-workspace.yaml
peersSuffixMaxLength: 200
```

### Request Settings

#### gitShallowHosts

Git shallow hosts.

```yaml
# pnpm-workspace.yaml
gitShallowHosts:
  - "github.com"
  - "gitlab.com"
```

#### networkConcurrency

Network concurrency.

```yaml
# pnpm-workspace.yaml
networkConcurrency: 16
```

#### fetchRetries

Number of fetch retries.

```yaml
# pnpm-workspace.yaml
fetchRetries: 2
```

#### fetchRetryFactor

Fetch retry factor.

```yaml
# pnpm-workspace.yaml
fetchRetryFactor: 10
```

#### fetchRetryMintimeout

Fetch retry minimum timeout.

```yaml
# pnpm-workspace.yaml
fetchRetryMintimeout: 10000
```

#### fetchRetryMaxtimeout

Fetch retry maximum timeout.

```yaml
# pnpm-workspace.yaml
fetchRetryMaxtimeout: 60000
```

#### fetchTimeout

Fetch timeout.

```yaml
# pnpm-workspace.yaml
fetchTimeout: 60000
```

#### fetchWarnTimeoutMs

Fetch warn timeout in milliseconds.

```yaml
# pnpm-workspace.yaml
fetchWarnTimeoutMs: 10000
```

#### fetchMinSpeedKiBps

Minimum fetch speed in KiB/s.

```yaml
# pnpm-workspace.yaml
fetchMinSpeedKiBps: 40
```

### Peer Dependency Settings

#### autoInstallPeers

Automatically install peer dependencies.

```yaml
# pnpm-workspace.yaml
autoInstallPeers: true
```

#### dedupePeerDependents

Dedupe peer dependents.

```yaml
# pnpm-workspace.yaml
dedupePeerDependents: true
```

#### strictPeerDependencies

Strict peer dependencies.

```yaml
# pnpm-workspace.yaml
strictPeerDependencies: true
```

#### resolvePeersFromWorkspaceRoot

Resolve peers from workspace root.

```yaml
# pnpm-workspace.yaml
resolvePeersFromWorkspaceRoot: true
```

#### peerDependencyRules

Peer dependency rules.

```yaml
# pnpm-workspace.yaml
peerDependencyRules:
  ignoreMissing:
    - "react"
  allowAny:
    - "eslint"
```

### CLI Settings

#### [no-]color

Enable or disable color output.

```yaml
# pnpm-workspace.yaml
color: true
```

#### loglevel

Log level.

```yaml
# pnpm-workspace.yaml
loglevel: "info" # or "debug", "warn", "error"
```

#### useBetaCli

Use beta CLI.

```yaml
# pnpm-workspace.yaml
useBetaCli: true
```

#### recursiveInstall

Recursive install.

```yaml
# pnpm-workspace.yaml
recursiveInstall: true
```

#### engineStrict

Strict engine checking.

```yaml
# pnpm-workspace.yaml
engineStrict: true
```

#### npmPath

Path to npm.

```yaml
# pnpm-workspace.yaml
npmPath: "/usr/bin/npm"
```

#### packageManagerStrict

Strict package manager checking.

```yaml
# pnpm-workspace.yaml
packageManagerStrict: true
```

#### packageManagerStrictVersion

Strict package manager version checking.

```yaml
# pnpm-workspace.yaml
packageManagerStrictVersion: true
```

#### managePackageManagerVersions

Manage package manager versions.

```yaml
# pnpm-workspace.yaml
managePackageManagerVersions: true
```

### Build Settings

#### ignoreScripts

- Default: false
- Type: Boolean

Do not execute any scripts defined in the project package.json and its dependencies.

This flag does not prevent the execution of [.pnpmfile.cjs](https://pnpm.io/pnpmfile)

```yaml
ignoreScripts: true
```

#### ignoreDepScripts

- Default: false
- Type: Boolean

Do not execute any scripts of the installed packages. Scripts of the projects are executed.

Since v10, pnpm doesn't run the lifecycle scripts of dependencies unless they are listed in [onlyBuiltDependencies](https://pnpm.io/settings).

```yaml
ignoreDepScripts: true
```

#### childConcurrency

- Default: 5
- Type: Number

The maximum number of child processes to allocate simultaneously to build node_modules.

```yaml
childConcurrency: 5
```

#### sideEffectsCache

- Default: true
- Type: Boolean

Use and cache the results of (pre/post)install hooks.

When a pre/post install script modify the contents of a package (e.g. build output), pnpm saves the modified package in the global store. On future installs on the same machine, pnpm reuses this cached, prebuilt version—making installs significantly faster.

You may want to disable this setting if:
1. The install scripts modify files outside the package directory (pnpm cannot track or cache these changes).
2. The scripts perform side effects that are unrelated to building the package.

```yaml
sideEffectsCache: true
```

#### sideEffectsCacheReadonly

- Default: false
- Type: Boolean

Only use the side effects cache if present, do not create it for new packages.

```yaml
sideEffectsCacheReadonly: true
```

#### unsafePerm

- Default: false IF running as root, ELSE true
- Type: Boolean

Set to true to enable UID/GID switching when running package scripts. If set explicitly to false, then installing as a non-root user will fail.

```yaml
unsafePerm: true
```

#### nodeOptions

- Default: NULL
- Type: String

Options to pass through to Node.js via the NODE_OPTIONS environment variable. This does not impact how pnpm itself is executed but it does impact how lifecycle scripts are called.

To preserve existing NODE_OPTIONS you can reference the existing environment variable using `${NODE_OPTIONS}` in your configuration:

```yaml
nodeOptions: "${NODE_OPTIONS:- } --experimental-vm-modules"
```

#### verifyDepsBeforeRun

- Default: false
- Type: install, warn, error, prompt, false

This setting allows the checking of the state of dependencies before running scripts. The check runs on `pnpm run` and `pnpm exec` commands. The following values are supported:

- install - Automatically runs install if node_modules is not up to date.
- warn - Prints a warning if node_modules is not up to date.
- prompt - Prompts the user for permission to run install if node_modules is not up to date.
- error - Throws an error if node_modules is not up to date.
- false - Disables dependency checks.

```yaml
verifyDepsBeforeRun: install
```

#### strictDepBuilds

Added in: v10.3.0
- Default: false
- Type: Boolean

When `strictDepBuilds` is enabled, the installation will exit with a non-zero exit code if any dependencies have unreviewed build scripts (aka postinstall scripts).

```yaml
strictDepBuilds: true
```

#### allowBuilds

Added in: v10.26.0

A map of package matchers to explicitly allow (true) or disallow (false) script execution. This field replaces `onlyBuiltDependencies` and `ignoredBuiltDependencies` (which are also deprecated by this new setting), providing a single source of truth.

```yaml
allowBuilds:
  esbuild: true
  core-js: false
  "nx@21.6.4 || 21.6.5": true
```

Default behavior: Packages not listed in `allowBuilds` are disallowed by default and a warning is printed. If `strictDepBuilds` is set to true, an error will be printed instead.

#### neverBuiltDependencies

Dependencies that should never be built.

```yaml
# pnpm-workspace.yaml
neverBuiltDependencies:
  - "foo"
  - "bar"
```

#### onlyBuiltDependencies

Dependencies that should only be built.

```yaml
# pnpm-workspace.yaml
onlyBuiltDependencies:
  - "foo"
  - "bar"
```

#### onlyBuiltDependenciesFile

File containing dependencies that should only be built.

```yaml
# pnpm-workspace.yaml
onlyBuiltDependenciesFile: "only-built.txt"
```

#### ignoredBuiltDependencies

Ignored built dependencies.

```yaml
# pnpm-workspace.yaml
ignoredBuiltDependencies:
  - "foo"
  - "bar"
```

#### dangerouslyAllowAllBuilds

Dangerously allow all builds.

```yaml
# pnpm-workspace.yaml
dangerouslyAllowAllBuilds: true
```

### Node.js Settings

#### useNodeVersion

Use specific Node.js version.

```yaml
# pnpm-workspace.yaml
useNodeVersion: "18.12.0"
```

#### nodeVersion

Node.js version.

```yaml
# pnpm-workspace.yaml
nodeVersion: "18.12.0"
```

#### node-mirror

Node.js mirror.

```yaml
# pnpm-workspace.yaml
node-mirror: "https://nodejs.org/dist"
```

#### executionEnv.nodeVersion

Execution environment Node.js version.

```yaml
# pnpm-workspace.yaml
executionEnv:
  nodeVersion: "18.12.0"
```

### Other Settings

#### savePrefix

```yaml
# pnpm-workspace.yaml
savePrefix: "^"
```

#### tag

```yaml
# pnpm-workspace.yaml
tag: "latest"
```

#### globalDir

```yaml
# pnpm-workspace.yaml
globalDir: "~/.pnpm-global"
```

#### globalBinDir

```yaml
# pnpm-workspace.yaml
globalBinDir: "~/.pnpm-global/bin"
```

#### stateDir

```yaml
# pnpm-workspace.yaml
stateDir: "~/.pnpm-state"
```

#### cacheDir

```yaml
# pnpm-workspace.yaml
cacheDir: "~/.pnpm-cache"
```

#### useStderr

```yaml
# pnpm-workspace.yaml
useStderr: true
```

#### updateNotifier

```yaml
# pnpm-workspace.yaml
updateNotifier: true
```

#### preferSymlinkedExecutables

```yaml
# pnpm-workspace.yaml
preferSymlinkedExecutables: true
```

#### ignoreCompatibilityDb

```yaml
# pnpm-workspace.yaml
ignoreCompatibilityDb: true
```

#### resolutionMode

```yaml
# pnpm-workspace.yaml
resolutionMode: "highest"
```

#### registrySupportsTimeField

```yaml
# pnpm-workspace.yaml
registrySupportsTimeField: true
```

#### extendNodePath

```yaml
# pnpm-workspace.yaml
extendNodePath: true
```

#### deployAllFiles

```yaml
# pnpm-workspace.yaml
deployAllFiles: true
```

#### dedupeDirectDeps

```yaml
# pnpm-workspace.yaml
dedupeDirectDeps: true
```

#### optimisticRepeatInstall

```yaml
# pnpm-workspace.yaml
optimisticRepeatInstall: true
```

#### requiredScripts

```yaml
# pnpm-workspace.yaml
requiredScripts:
  - "build"
  - "test"
```

#### enablePrePostScripts

```yaml
# pnpm-workspace.yaml
enablePrePostScripts: true
```

#### scriptShell

```yaml
# pnpm-workspace.yaml
scriptShell: "/bin/bash"
```

#### shellEmulator

```yaml
# pnpm-workspace.yaml
shellEmulator: true
```

#### catalogMode

```yaml
# pnpm-workspace.yaml
catalogMode: strict
```

#### ci

```yaml
# pnpm-workspace.yaml
ci: true
```

#### cleanupUnusedCatalogs

```yaml
# pnpm-workspace.yaml
cleanupUnusedCatalogs: true
```

## Supported Package Sources

pnpm supports installing packages from various sources. These sources are divided into two categories: trusted sources and exotic sources.

### Trusted sources

#### npm registry

pnpm add package-name will install the latest version of package-name from the [npm registry](https://www.npmjs.com/) by default.

If executed in a workspace, the command will first try to check whether other projects in the workspace use the specified package. If so, the already used version range will be installed.

You may also install packages by:
- tag: `pnpm add express@nightly`
- version: `pnpm add express@1.0.0`
- version range: `pnpm add express@2 react@">=0.1.0 <0.2.0"`

#### JSR registry

Added in: v10.9.0

To install packages from the [JSR](https://jsr.io/) registry, use the `jsr:` protocol prefix:

```bash
pnpm add jsr:@hono/hono
pnpm add jsr:@hono/hono@4
pnpm add jsr:@hono/hono@latest
```

This works just like installing from npm, but tells pnpm to resolve the package through JSR instead.

#### Workspace

Note that when adding dependencies and working within a workspace, packages will be installed from the configured sources, depending on whether or not `linkWorkspacePackages` is set, and use of the [workspace: range protocol](https://pnpm.io/workspaces).

#### Local file system

There are two ways to install from the local file system:
1. from a tarball file (.tar, .tar.gz, or .tgz)
2. from a directory

Examples:

```bash
pnpm add ./package.tar.gz
pnpm add ./some-directory
```

When you install from a directory, a symlink will be created in the current project's node_modules, so it is the same as running `pnpm link`.

### Exotic sources

#### Remote tarball

You can install a package from a remote tarball URL:

```bash
pnpm add https://github.com/index.js/index.js/archive/v1.0.0.tar.gz
```

#### Git repository

You can install a package from a Git repository:

```bash
pnpm add https://github.com/user/repo.git
pnpm add git+ssh://github.com:user/repo.git
pnpm add git://github.com:user/repo.git
```

You can also specify:

- A commit: `pnpm add user/repo#commit-id`
- A branch: `pnpm add user/repo#branch-name`
- A tag: `pnpm add user/repo#tag-name`

You can install from a specific subdirectory of a Git repository:

```bash
pnpm add user/repo#path/to/subdir
```

## Troubleshooting

### Common Issues

#### pnpm command not found

If pnpm is not found, you might need to:
1. Close and reopen your terminal
2. Add the pnpm installation directory to your PATH environment variable

#### Permission errors

On some systems, you might need to use `sudo` or configure npm to work without sudo:

```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### Symlink issues

If your tooling doesn't work well with symlinks, you can set:

```yaml
nodeLinker: "hoisted"
```

#### ESM resolution issues with Global Virtual Store

If you encounter ESM resolution errors when using `enableGlobalVirtualStore`, either:
1. Use `packageExtensions` to add missing dependencies
2. Add `@pnpm/plugin-esm-node-path` config dependency

### Performance Issues

#### Slow installations

- Check your network connection
- Increase `networkConcurrency` if you have a fast connection
- Consider using `sideEffectsCache: true`
- Try `enableGlobalVirtualStore: true` for multi-project setups

#### High disk usage

- Check `storeDir` location
- Use `pnpm store prune` to clean up unused packages
- Consider `enableGlobalVirtualStore: true` to share dependencies

### Security Issues

#### Malicious packages

- Enable `minimumReleaseAge` to block zero-day releases
- Use `trustPolicy: no-downgrade` to prevent trust downgrades
- Enable `blockExoticSubdeps` to prevent exotic transitive dependencies
- Configure `allowBuilds` to control which packages can run scripts

## Migration Guide

### From npm/Yarn

1. Install pnpm globally
2. Run `pnpm import` to generate `pnpm-lock.yaml` from existing lockfile
3. Delete `node_modules` and `package-lock.json`/`yarn.lock`
4. Run `pnpm install`

### From pnpm v9 to v10

Key changes in v10:
- Lifecycle scripts are blocked by default
- New `allowBuilds` setting replaces `onlyBuiltDependencies`
- Enhanced security features enabled
- Global Virtual Store available

Update your configuration:

```yaml
# Old settings
onlyBuiltDependencies:
  - esbuild

# New settings
allowBuilds:
  esbuild: true
```

## Best Practices

### Security

1. Always use `allowBuilds` instead of `onlyBuiltDependencies`
2. Enable `minimumReleaseAge` for production environments
3. Consider `trustPolicy: no-downgrade` for critical applications
4. Use `blockExoticSubdeps` to prevent exotic transitive dependencies

### Performance

1. Enable `sideEffectsCache` for faster rebuilds
2. Use `enableGlobalVirtualStore` for multi-project setups
3. Configure appropriate `networkConcurrency` for your network
4. Regularly run `pnpm store prune` to clean up

### Monorepos

1. Use catalogs for dependency management
2. Configure `sharedWorkspaceLockfile` for better performance
3. Use workspace protocol for internal dependencies
4. Consider config dependencies for shared configuration

### CI/CD

1. Use `preferFrozenLockfile: true` in CI
2. Set `ci: true` to disable interactive prompts
3. Consider `minimumReleaseAge: 0` for latest dependencies
4. Use `verifyDepsBeforeRun: install` for consistency

## Commands Reference

### Package Management

- `pnpm add <pkg>` - Install a package
- `pnpm remove <pkg>` - Remove a package
- `pnpm update` - Update packages
- `pnpm outdated` - Check for outdated packages
- `pnpm list` - List installed packages

### Workspace Management

- `pnpm -r <cmd>` - Run command in all workspace packages
- `pnpm --filter <pattern> <cmd>` - Run command in filtered packages
- `pnpm --workspace-root <cmd>` - Run command from workspace root

### Store Management

- `pnpm store path` - Show store path
- `pnpm store prune` - Remove unused packages from store
- `pnpm store status` - Show store status

### Configuration

- `pnpm config list` - List configuration
- `pnpm config get <key>` - Get configuration value
- `pnpm config set <key> <value>` - Set configuration value

### Scripts

- `pnpm run <script>` - Run a script
- `pnpm exec <command>` - Execute a command
- `pnpm dlx <command>` - Execute a command without installing

## Environment Variables

### Core Variables

- `PNPM_HOME` - Directory where pnpm is installed
- `PNPM_STORE_DIR` - Directory for the content-addressable store
- `PNPM_CACHE_DIR` - Directory for cache files

### Network Variables

- `HTTP_PROXY` / `HTTPS_PROXY` - Proxy configuration
- `NO_PROXY` - Proxy bypass list

### Feature Flags

- `PNPM_IGNORE_CWD` - Ignore current working directory
- `PNPM_SCRIPT_SHELL` - Shell for running scripts

## Configuration Files

### .npmrc

Standard npm configuration file. pnpm respects most npm configuration options.

### pnpm-workspace.yaml

Workspace configuration file for monorepos.

### .pnpmfile.cjs

JavaScript file for customizing pnpm behavior through hooks.

### package.json

Standard package.json with additional pnpm-specific fields:

```json
{
  "pnpm": {
    "overrides": {},
    "patchedDependencies": {},
    "onlyBuiltDependencies": [],
    "neverBuiltDependencies": []
  }
}
```

## Hooks

### Available Hooks

- `readPackage` - Modify package information before installation
- `afterAllResolved` - Modify the lockfile after resolution
- `validatePeerDependencies` - Validate peer dependencies
- `updateConfig` - Dynamically update pnpm configuration

### Example .pnpmfile.cjs

```javascript
function readPackage(pkg, context) {
  // Add missing dependencies
  if (pkg.name === 'some-package') {
    pkg.dependencies = pkg.dependencies || {}
    pkg.dependencies.missing-dep = '^1.0.0'
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
```

## Contributing

### Development Setup

```bash
git clone https://github.com/pnpm/pnpm.git
cd pnpm
pnpm install
pnpm build
```

### Testing

```bash
pnpm test
pnpm test:unit
pnpm test:e2e
```

### Building

```bash
pnpm build
pnpm build:docs
```

## Support

### Documentation

- Official docs: https://pnpm.io/
- API reference: https://pnpm.io/api
- CLI reference: https://pnpm.io/cli

### Community

- GitHub Discussions: https://github.com/pnpm/pnpm/discussions
- Discord: https://discord.gg/pnpm
- Twitter: https://twitter.com/pnpmjs

### Bug Reports

- GitHub Issues: https://github.com/pnpm/pnpm/issues
- Security issues: security@pnpm.io

## License

pnpm is licensed under the MIT License. See the LICENSE file for details.

## Changelog

### v10.0.0 (2025)

- **Security by Default**: Lifecycle scripts blocked by default
- **allowBuilds**: New build permission system
- **Config Dependencies**: Shareable configuration
- **Enhanced Trust Policies**: Multiple security layers

### v10.9.0 (2025)

- **Native JSR Support**: `jsr:` protocol
- **Performance Improvements**: Faster dependency resolution

### v10.12.0 (2025)

- **Global Virtual Store**: Share dependencies across projects
- **Experimental Features**: Advanced caching strategies

### v10.14.0 (2025)

- **Runtime Management**: Automatic Node.js/Deno/Bun management
- **Enhanced Workspace Features**: Better monorepo support

### v10.16.0 (2025)

- **minimumReleaseAge**: Zero-day protection
- **Enhanced Security**: Additional attack vector prevention

### v10.21.0 (2025)

- **trustPolicy**: Provenance-based trust system
- **blockExoticSubdeps**: Exotic source restrictions

### v10.26.0 (2025)

- **allowBuilds**: Flexible build permissions
- **Enhanced Config Dependencies**: Better sharing capabilities

---

*This documentation is maintained to reflect the latest features and best practices for pnpm 10.x. For the most up-to-date information, visit the official pnpm documentation at https://pnpm.io/*
