export const generate = ({
  tag,
  props,
  textContent,
}: {
  tag: string;
  props: Record<string, string>;
  textContent: string;
}) => {
  return `return () => {
    const { h } = MiniVue;
    return h("${tag}", {${Object.entries(props)
    .map(([k, v]) => `${k}: "${v}"`)
    .join(", ")} },["${textContent}"]);
  }`;
};
