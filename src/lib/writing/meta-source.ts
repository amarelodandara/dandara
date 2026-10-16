import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Tag } from "@/badges/tags";
import type { PostMeta } from "./posts";

const CONTENT = path.join(process.cwd(), "src", "content", "writing");

const META_BLOCK = /export const meta = \{([\S\s]*?)\n\};/;

const FIELD = /^ +(\w+):\s*"([^"]*)",$/gm;

const TAG_LIST = /^ +tags: \[([^\]]*)\],$/m;

const fieldsIn = (body: string) => {
  const found = new Map<string, string>();
  for (const [, name, value] of body.matchAll(FIELD)) {
    found.set(name, value);
  }
  return found;
};

const tagsIn = (body: string, file: string) => {
  const list = TAG_LIST.exec(body);
  if (!list) {
    throw new Error(`${path.basename(file)} has no "tags" in its meta export.`);
  }
  return [...list[1].matchAll(/"([^"]+)"/g)].map(([, tag]) => tag as Tag);
};

export async function readPostMeta(file: string): Promise<PostMeta> {
  const source = await readFile(file, "utf8");
  const block = META_BLOCK.exec(source);
  if (!block) {
    throw new Error(`${path.basename(file)} has no "export const meta" block.`);
  }

  const fields = fieldsIn(block[1]);
  const take = (name: string) => {
    const value = fields.get(name);
    if (value === undefined) {
      throw new Error(
        `${path.basename(file)} has no "${name}" in its meta export.`,
      );
    }
    return value;
  };

  return {
    title: take("title"),
    deck: take("deck"),
    blurb: take("blurb"),
    date: take("date"),
    tags: tagsIn(block[1], file),
  };
}

export async function readPosts() {
  const files = await readdir(CONTENT);
  const posts = files
    .filter((name) => name.endsWith(".mdx"))
    .map(async (name) => ({
      slug: name.replace(/\.mdx$/, ""),
      meta: await readPostMeta(path.join(CONTENT, name)),
    }));

  return Promise.all(posts);
}
