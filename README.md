# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
pnx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.17.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography" sveltekit-adapter="adapter:netlify" drizzle="database:sqlite+sqlite:turso" better-auth="demo:password,github" ai-tools="ide:gemini+tools:mcp,svelte-code-writer,svelte-core-bestpractices,svelte-file-editor+mcpSetup:local" playwright --install pnpm organic-og
```

## Developing

Once you've created a project and installed dependencies with `pnpm install` (or `pnpm install` or `yarn`), start a development server:

```sh
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
