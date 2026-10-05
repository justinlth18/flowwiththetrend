const STAR =
  "M32 3.2 38.4 20.8 57.2 22.2 42.8 34.4 47.6 52.4 32 42.6 16.4 52.4 21.2 34.4 6.8 22.2 25.6 20.8 32 3.2Z";

const SPARKLE = "M32 1.5 37.2 22.4 60.5 26.2 42.6 38.4 50.8 60.2 32 47.2 13.2 60.2 21.4 38.4 3.5 26.2 26.8 22.4 32 1.5Z";

export function Spark({
  className = "",
  color = "#fff200",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d={SPARKLE} fill={color} stroke="#161616" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  );
}

export function NavIcon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 48 48",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "plate":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" fill="#fff200" stroke="#161616" strokeWidth="2.4" />
          <circle cx="24" cy="24" r="9" fill="#ff4fa0" stroke="#161616" strokeWidth="2.2" />
          <path d="M19 26.5c2 2.2 8 2.2 10 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "cards":
      return (
        <svg {...common}>
          <rect x="8" y="12" width="22" height="26" rx="5" fill="#7fd4ff" stroke="#161616" strokeWidth="2.2" transform="rotate(-8 19 25)" />
          <rect x="18" y="10" width="22" height="26" rx="5" fill="#fff200" stroke="#161616" strokeWidth="2.2" />
        </svg>
      );
    case "stars":
      return (
        <svg {...common}>
          <path d={STAR} transform="translate(2 6) scale(0.42)" fill="#fff200" stroke="#161616" strokeWidth="2" />
          <path d={STAR} transform="translate(22 4) scale(0.5)" fill="#ff4fa0" stroke="#161616" strokeWidth="2" />
          <path d={STAR} transform="translate(16 24) scale(0.38)" fill="#c77dff" stroke="#161616" strokeWidth="2" />
        </svg>
      );
    case "path":
      return (
        <svg {...common}>
          <path d="M10 34c8-14 12-14 16-4s8 16 14-8" fill="none" stroke="#161616" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="12" cy="32" r="4" fill="#fff200" stroke="#161616" strokeWidth="2" />
          <circle cx="26" cy="24" r="4" fill="#ff4fa0" stroke="#161616" strokeWidth="2" />
          <circle cx="38" cy="16" r="4" fill="#7fd4ff" stroke="#161616" strokeWidth="2" />
        </svg>
      );
    case "frames":
      return (
        <svg {...common}>
          <rect x="7" y="12" width="34" height="24" rx="4" fill="#fffdf2" stroke="#161616" strokeWidth="2.2" />
          <path d="M7 18h34" stroke="#161616" strokeWidth="2.2" />
          <circle cx="12" cy="15" r="1.3" fill="#161616" />
          <circle cx="16.5" cy="15" r="1.3" fill="#161616" />
          <rect x="12" y="23" width="14" height="8" rx="2" fill="#37e85c" />
          <rect x="28" y="23" width="8" height="8" rx="2" fill="#ff4fa0" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d={STAR} transform="translate(8 6) scale(0.52)" fill="#fff200" stroke="#161616" strokeWidth="2.2" />
        </svg>
      );
  }
}

export function RailSmile() {
  return (
    <svg className="rail-smile" viewBox="0 0 72 64" aria-hidden="true">
      <path d={STAR} transform="translate(2 2) scale(0.34)" fill="#161616" />
      <path d={STAR} transform="translate(40 2) scale(0.34)" fill="#161616" />
      <path d="M16 46c8 10 32 10 40 0" fill="none" stroke="#161616" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function PlateFace({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" aria-hidden="true">
      <ellipse cx="120" cy="198" rx="78" ry="16" fill="#161616" opacity="0.14" />
      <circle cx="120" cy="112" r="96" fill="#fffdf2" stroke="#161616" strokeWidth="6" />
      <circle cx="120" cy="112" r="72" fill="#fff200" stroke="#161616" strokeWidth="6" />
      <path d={STAR} transform="translate(62 62) scale(0.48)" fill="#161616" />
      <path d={STAR} transform="translate(138 62) scale(0.48)" fill="#161616" />
      <path d="M78 132c14 22 70 22 84 0" fill="none" stroke="#161616" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function SauceBottle({
  className = "",
  body = "#37e85c",
  cap = "#161616",
  label = "#fff200",
}: {
  className?: string;
  body?: string;
  cap?: string;
  label?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 120 220" aria-hidden="true">
      <ellipse cx="60" cy="204" rx="36" ry="8" fill="#161616" opacity="0.15" />
      <rect x="46" y="18" width="28" height="22" rx="6" fill={cap} />
      <path d="M48 40h24l8 18H40l8-18Z" fill="#fffdf2" stroke="#161616" strokeWidth="4" />
      <rect x="28" y="56" width="64" height="132" rx="28" fill={body} stroke="#161616" strokeWidth="5" />
      <rect x="40" y="96" width="40" height="46" rx="10" fill={label} stroke="#161616" strokeWidth="3" />
      <path d={STAR} transform="translate(46 104) scale(0.28)" fill="#161616" />
      <path d="M48 78c8 10 16 10 24 0" fill="none" stroke="#161616" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 70c6 18 6 70 0 96" fill="none" stroke="#fffdf2" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function HeroScene() {
  return (
    <div className="scene scene-hero" aria-hidden="true">
      <Spark className="spark spark-a" color="#ff4fa0" />
      <Spark className="spark spark-b" color="#c77dff" />
      <Spark className="spark spark-c" color="#fffdf2" />
      <Spark className="spark spark-d" color="#7fd4ff" />
      <PlateFace className="plate" />
      <SauceBottle className="bottle bottle-a" />
      <SauceBottle className="bottle bottle-b" body="#7fd4ff" cap="#ff4fa0" label="#fffdf2" />
    </div>
  );
}

export function FeatureScene() {
  return (
    <div className="scene scene-feature" aria-hidden="true">
      <svg className="burst" viewBox="0 0 200 200">
        <path
          fill="#ff4fa0"
          stroke="#161616"
          strokeWidth="4"
          strokeLinejoin="round"
          d="M100 8l14 48 46-28-18 50 52-4-40 36 48 28-52-8 8 50-38-36-20 48-14-50-42 28 20-48L8 112l50-8-28-46 48 16L100 8Z"
        />
      </svg>
      <Spark className="spark spark-e" color="#fff200" />
      <Spark className="spark spark-f" color="#c77dff" />
      <Spark className="spark spark-g" color="#7fd4ff" />
      <div className="hang">
        <article className="webcard webcard-blue">
          <span />
          <b>FLOW</b>
          <i />
          <i />
        </article>
        <article className="webcard webcard-lilac">
          <span />
          <b>MENU</b>
          <i />
          <i />
        </article>
        <article className="webcard webcard-yellow">
          <span />
          <b>PLATE</b>
          <i />
          <i />
        </article>
      </div>
    </div>
  );
}

export function ConsultScene() {
  return (
    <div className="scene scene-consult" aria-hidden="true">
      <span className="glow glow-pink" />
      <span className="glow glow-blue" />
      <span className="glow glow-yellow" />
      <span className="dish dish-bowl" />
      <span className="dish dish-glass">
        <i />
      </span>
      <span className="dish dish-cake" />
    </div>
  );
}

export function TileScene({ tone }: { tone: "sea" | "chef" }) {
  return (
    <div className={`scene scene-tile scene-${tone}`} aria-hidden="true">
      <Spark className="spark spark-h" color={tone === "sea" ? "#fff200" : "#37e85c"} />
      <Spark className="spark spark-i" color={tone === "sea" ? "#ff4fa0" : "#fff200"} />
      {tone === "sea" ? <PlateFace className="plate plate-small" /> : <SauceBottle className="bottle bottle-tile" body="#c77dff" cap="#fff200" />}
    </div>
  );
}
