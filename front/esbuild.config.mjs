import * as esbuild from 'esbuild'
import wyw from '@wyw-in-js/esbuild'

const isProduction = process.env.NODE_ENV === 'production';

const buildOptions = {
  entryPoints: ['index.ts'],
  bundle: true,
  outfile: 'www/app.js',
  loader: { '.ts': 'tsx' },
  minify: isProduction,
  plugins: [
    wyw({
      filter: /\.(js|jsx|ts|tsx)$/,
      sourceMap: isProduction,
    }),
  ],
};

const build = async () => {
  await esbuild.build(buildOptions);
  console.log(`Build completed, mode=${process.env.NODE_ENV}`);
};

const serve = async () => {
  const context = await esbuild.context(buildOptions);
  const server = await context.serve({
    servedir: 'www', port: 3001
  })
  console.log(`Serving at http://localhost:${server.port} and watching for changes...`);
};

const run = async () => {
  if (isProduction) {
    await build();
  } else {
    await serve();
  }
};

run().catch((error) => {
  console.error('Error:', error);
  process.exit(1)
});
