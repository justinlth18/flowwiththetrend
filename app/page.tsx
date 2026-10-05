import { HomeStage } from "@/components/home-stage";
import { ClosingBand, Marquee, Packages, Process } from "@/components/sections";

export default function HomePage() {
  return (
    <main>
      <HomeStage />
      <div className="below">
        <Marquee />
        <Packages />
        <Process />
        <ClosingBand />
      </div>
    </main>
  );
}
