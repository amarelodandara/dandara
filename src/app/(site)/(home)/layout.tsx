import { Colophon } from "@/components/colophon";
import { Signposts } from "@/components/signposts";

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <Signposts here="/" />
      <Colophon />
    </>
  );
}
