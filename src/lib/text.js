import { marked } from "marked";

export function md(str = "") {
  return marked.parseInline(str);
}

export function t(template = "", vars = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));
}