export class Trie<T> {
  constructor() {
    this.root = new TrieNode<T>();
  }
  root: TrieNode<T>;

  add(route: string, value: T) {
    let current = this.root;
    const parts = route === "/" ? [""] : route.split("/");
    // /dashboard/guest, /dashboard/, /dashboard, /
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] || "index";
      if (!current.children.has(part)) {
        const node = new TrieNode<T>();
        current.children.set(part, node);
      }
      current = current.children.get(part)!;
    }
    current.value = value;
  }

  toJSON() {
    return this.root.toJSON();
  }
}

export class TrieNode<T> {
  children = new Map<String, TrieNode<T>>();
  value?: T;

  toJSON() {
    return {
      children: objectFromMap(this.children),
      value: this.value,
    };
  }
}

function objectFromMap<T>(map: Map<String, T>) {
  const obj: { [key: string]: any } = {};
  const entries = Array.from(map.entries());
  for (const [key, value] of entries) {
    obj[`${key}`] = value;
  }
  return obj;
}
