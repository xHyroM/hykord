// Thanks vencord for this - https://github.com/Vendicated/Vencord/blob/main/src/components/Flex.tsx

export const Flex = (
  props: React.PropsWithChildren<
    {
      flexDirection?: React.CSSProperties['flexDirection'];
      style?: React.CSSProperties;
      className?: string;
    } & React.HTMLProps<HTMLDivElement>
  >,
) => {
  props.style ??= {};
  props.style.flexDirection ||= props.flexDirection;
  props.style.gap ??= '1em';
  props.style.display = 'flex';
  return <div {...props}>{props.children}</div>;
};
