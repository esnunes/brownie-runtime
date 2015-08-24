import { load } from './descriptor';


export default async function (root) {
  const { descriptor, dir } = await load(root);

  const resources = {};

  const names = Object.keys(descriptor);
  for (let name of names) {
    const { type, options } = descriptor[name];
    try {
      const loader = require(`brownie-${type}`);

      resources[name] = await loader(dir, process.env, name, options);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        console.error(e.stack || e);
        throw e;
      }
      console.warn(`- ignoring resource [${name}]: cannot load module [brownie-${type}]`);
    }
  }

  await require(dir).default(resources);
}
