import { Colophon } from "@/components/colophon";

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <Colophon />
    </>
  );
}
