import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';


export async function load (root) {
  const dir = search(root, 'brownie.yml');
  if (!dir) return null;

  const filename = path.join(dir, 'brownie.yml');
  const descriptor = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));

  return { descriptor, dir };
}


export function search (src, name) {
  const stat = fs.statSync(src);
  if (!stat.isDirectory()) return search(path.dirname(src), name);

  const filename = path.join(src, name);
  const found = fs.existsSync(filename);

  if (!found && src === '/') return null;
  if (!found) return search(path.dirname(src), name);

  return src;
}
