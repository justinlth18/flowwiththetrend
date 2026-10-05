import Link from "next/link";
import { RailSmile } from "@/components/art";
import { TopNav } from "@/components/top-nav";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <aside className="rail">
        <div className="wordmark-wrap">
          <Link href="/" className="wordmark">
            FLOW
          </Link>
        </div>
        <div className="rail-tools">
          <RailSmile />
        </div>
      </aside>
      <div className="shell-main">
        <TopNav />
        {children}
      </div>
    </div>
  );
}
