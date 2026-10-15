import { Colophon } from "@/components/colophon";

export default function WorkLayout({ children }: LayoutProps<"/work">) {
  return (
    <>
      {children}
      <Colophon apart />
    </>
  );
}
