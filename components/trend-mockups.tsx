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

function Shot({ name }: { name: string }) {
  return (
    <span className={`shot shot-${name}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function VibrantMock() {
  return (
    <Frame domain="adacho.example" className="mock-vibrant">
      <div className="mv-vibrant">
        <header>
          <b>Ada Cho</b>
          <nav>
            <span className="on">Selected</span>
            <span>Pop-ups</span>
            <span>Diary</span>
            <span>Contact</span>
          </nav>
        </header>
        <div className="mv-hero">
          <div>
            <p>Chef · Singapore</p>
            <strong>Selected plates, from the pass.</strong>
            <em>Private dining, three-night pop-ups, and a short diary of what left the kitchen.</em>
          </div>
          <figure>
            <Shot name="plate" />
            <figcaption>Citrus crab, olive oil · private dining · 2026</figcaption>
          </figure>
        </div>
        <ul>
          <li>
            <Shot name="night" />
            <b>Night market</b>
            <small>Kampong Glam · three nights</small>
          </li>
          <li>
            <Shot name="bowl" />
            <b>The red room</b>
            <small>Twelve seats · by request</small>
          </li>
          <li>
            <Shot name="citrus" />
            <b>Sunday diary</b>
            <small>What left the pass</small>
          </li>
        </ul>
        <footer>Singapore · adacho.example</footer>
      </div>
    </Frame>
  );
}

function KineticMock() {
  return (
    <Frame domain="riomori.example" className="mock-kinetic">
      <div className="mv-kinetic">
        <header>
          <b>Rio Mori</b>
          <nav>
            <span className="on">Work</span>
            <span>About</span>
            <span>Note</span>
          </nav>
        </header>
        <p className="mv-giant">
          Rio Mori
          <small>Art director · Singapore</small>
        </p>
        <ol>
          <li>
            <Shot name="market" />
            <div>
              <b>Night market</b>
              <em>Campaign for a three-night residency · 2026</em>
            </div>
            <small>01</small>
          </li>
          <li>
            <Shot name="redroom" />
            <div>
              <b>Red room</b>
              <em>Identity for a twelve-seat dining room · 2025</em>
            </div>
            <small>02</small>
          </li>
          <li>
            <Shot name="chrome" />
            <div>
              <b>Chrome fruit</b>
              <em>Stills for a pastry studio · 2025</em>
            </div>
            <small>03</small>
          </li>
        </ol>
        <p className="mv-kicker">Selected work, 2019–2026. Write with a project in mind.</p>
      </div>
    </Frame>
  );
}

function BrokenMock() {
  return (
    <Frame domain="junepark.example" className="mock-broken">
      <div className="mv-broken">
        <header>
          <b>June Park</b>
          <span>Photographs · rooms, hands, the pass</span>
        </header>
        <figure className="bk-hero">
          <Shot name="room" />
          <figcaption>
            <b>The spare room</b>
            <em>Tiong Bahru, morning light · 2026</em>
          </figcaption>
        </figure>
        <figure className="bk-side">
          <Shot name="hands" />
          <figcaption>
            <b>Service</b>
            <em>Hands at the pass</em>
          </figcaption>
        </figure>
        <figure className="bk-low">
          <Shot name="portrait" />
          <figcaption>
            <b>Blue hour</b>
            <em>Portrait, after close</em>
          </figcaption>
        </figure>
        <p className="bk-note">Commissions open for dining rooms and cooks. Based in Singapore.</p>
      </div>
    </Frame>
  );
}

function GlassMock() {
  return (
    <Frame domain="mirasol.example" className="mock-glass">
      <div className="mv-glass">
        <div className="glass-scene" aria-hidden="true">
          <span className="cake cake-a" />
          <span className="cake cake-b" />
          <span className="cake cake-c" />
        </div>
        <header>
          <b>Mira Sol</b>
          <nav>
            <span className="on">Work</span>
            <span>The book</span>
            <span>Visit</span>
          </nav>
        </header>
        <section>
          <p>Pastry studio · Tiong Bahru</p>
          <h3>Cakes, tarts, and a small book of plates.</h3>
        </section>
        <div className="glass-cards">
          <article>
            <Shot name="tart" />
            <b>Olive oil tart</b>
            <em>Citrus · on the counter this month</em>
          </article>
          <article>
            <Shot name="glaze" />
            <b>Mirror glaze</b>
            <em>Fruit · studio menu, 2025</em>
          </article>
          <article>
            <Shot name="book" />
            <b>The book</b>
            <em>Forty plates · softcover</em>
          </article>
        </div>
      </div>
    </Frame>
  );
}

function RetroMock() {
  return (
    <Frame domain="novakei.example" className="mock-retro">
      <div className="mv-retro">
        <header>
          <b>Nova Kei</b>
          <span>Motion · reel</span>
        </header>
        <figure className="reel">
          <Shot name="title" />
          <figcaption>
            <span className="play" aria-hidden="true" />
            <span className="track" aria-hidden="true">
              <i />
            </span>
            <em>00:42 / 01:10</em>
          </figcaption>
        </figure>
        <ul>
          <li>
            <b>01</b>
            <span>Opening titles</span>
            <em>Short film · 2026</em>
          </li>
          <li>
            <b>02</b>
            <span>Club identity</span>
            <em>Nightlife · 2025</em>
          </li>
          <li>
            <b>03</b>
            <span>Night bus</span>
            <em>Music video · 2025</em>
          </li>
        </ul>
      </div>
    </Frame>
  );
}

function DarkMock() {
  return (
    <Frame domain="ellisward.example" className="mock-dark">
      <div className="mv-dark">
        <header>
          <b>Ellis Ward</b>
          <nav>
            <span className="on">Menu</span>
            <span>Room</span>
            <span>Visit</span>
          </nav>
        </header>
        <figure>
          <Shot name="dining" />
          <figcaption>The tasting room, after service · Keong Saik</figcaption>
        </figure>
        <ol>
          <li>
            <b>01</b>
            <span>The tasting</span>
            <em>Eight courses · dinner</em>
          </li>
          <li>
            <b>02</b>
            <span>The counter</span>
            <em>Eight seats · walk-in</em>
          </li>
          <li>
            <b>03</b>
            <span>Private dining</span>
            <em>Twelve seats · booked</em>
          </li>
          <li>
            <b>04</b>
            <span>The diary</span>
            <em>What changed this week</em>
          </li>
        </ol>
        <footer>Keong Saik · ellisward.example</footer>
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
