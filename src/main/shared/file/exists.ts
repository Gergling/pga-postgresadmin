import { access, constants } from "node:fs";
// import { promisify } from "node:util";

// const accessAsync = promisify(access);

// TODO: IDK if this is useful here. I ended up not using it because it needed
// to identify when a file's metadata was unreadable.

export const fileExists = (path: string) => new Promise<boolean>((resolve) => {
  access(path, constants.F_OK, (err) => {
    if (err?.code === 'ENOENT' || err?.code === 'ENOTDIR') {
      return resolve(false);
    }
    return resolve(true);
  });
});
