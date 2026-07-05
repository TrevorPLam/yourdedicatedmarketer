declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.mdx' {
  let MDXComponent: (props: Record<string, unknown>) => JSX.Element;
  export default MDXComponent;
}
