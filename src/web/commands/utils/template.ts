import * as Mustache from "mustache";

/**
 * Render a template with Mustache.
 *
 * @param src Source template
 * @param obj Data input
 */
export function renderTemplate(src: string, obj: object = {}) {
  const template = src;
  const rendered = Mustache.render(template, obj);
  return rendered;
}
