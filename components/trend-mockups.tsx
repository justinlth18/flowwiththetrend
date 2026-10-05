function Frame({
  domain,
  children,
  className,
}: {
  domain: string;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={`mockframe ${className}`}>
      <div className="mockframe-bar">
        <i />
        <i />
        <i />
        <span>{domain}</span>
        <em>sample mockup</em>
      </div>
      <div className="mockframe-screen">{children}</div>
    </div>
  );
}

function VibrantMock() {
  return (
    <Frame domain="ada.example" className="mock-vibrant">
      <div className="mv-vibrant">
        <aside>ADA</aside>
        <div className="mv-vibrant-main">
          <p>chef portfolio · 2026</p>
          <strong>ada cho</strong>
          <em>plates, pop-ups, the diary</em>
          <div>
            <span>plates</span>
            <span>pop-ups</span>
            <span>diary</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function KineticMock() {
  return (
    <Frame domain="rio.example" className="mock-kinetic">
      <div className="mv-kinetic">
        <nav>
          <span>work</span>
          <span>about</span>
          <span>note</span>
        </nav>
        <p className="mv-giant">RIO</p>
        <div className="mv-run" aria-hidden="true">
          <span>sets — campaigns — stills — night market — sets — campaigns — stills — night market —</span>
        </div>
        <ol>
          <li>
            <b>01</b> night market
          </li>
          <li>
            <b>02</b> red room
          </li>
          <li>
            <b>03</b> chrome fruit
          </li>
        </ol>
      </div>
    </Frame>
  );
}

function BrokenMock() {
  return (
    <Frame domain="june.example" className="mock-broken">
      <div className="mv-broken">
        <div className="bk bk-photo">rooms</div>
        <div className="bk bk-pink">hands</div>
        <div className="bk bk-name">
          june
          <br />
          park
        </div>
        <div className="bk bk-yellow">the pass</div>
        <div className="bk bk-blue">portraits</div>
        <p>photographs, off the grid</p>
      </div>
    </Frame>
  );
}

function GlassMock() {
  return (
    <Frame domain="mira.example" className="mock-glass">
      <div className="mv-glass">
        <header>
          <span>mira sol</span>
          <span>pastry</span>
        </header>
        <h3>sweet work, clear glass</h3>
        <div>
          <article>
            <b>tarts</b>
            <span>citrus, olive oil</span>
          </article>
          <article>
            <b>glazes</b>
            <span>mirror, fruit</span>
          </article>
          <article>
            <b>the book</b>
            <span>2026</span>
          </article>
        </div>
      </div>
    </Frame>
  );
}

function RetroMock() {
  return (
    <Frame domain="nova.example" className="mock-retro">
      <div className="mv-retro">
        <span className="mv-badge">2026</span>
        <p className="mv-chrome">NOVA KEI</p>
        <p className="mv-retro-sub">motion · titles · clubs</p>
        <div>
          <article>
            <b>01</b> title sequence
          </article>
          <article>
            <b>02</b> club identity
          </article>
        </div>
      </div>
    </Frame>
  );
}

function DarkMock() {
  return (
    <Frame domain="ellis.example" className="mock-dark">
      <div className="mv-dark">
        <header>
          <span>ellis ward</span>
          <em>index</em>
        </header>
        <ul>
          <li>
            <b>01</b> the tasting
          </li>
          <li>
            <b>02</b> private dining
          </li>
          <li>
            <b>03</b> the diary
          </li>
        </ul>
        <div className="mv-ochre">menu</div>
      </div>
    </Frame>
  );
}

const mockups = {
  vibrant: VibrantMock,
  kinetic: KineticMock,
  broken: BrokenMock,
  glass: GlassMock,
  retro: RetroMock,
  dark: DarkMock,
};

export function TrendMockup({ id }: { id: string }) {
  const Mock = mockups[id as keyof typeof mockups] ?? VibrantMock;
  return <Mock />;
}
