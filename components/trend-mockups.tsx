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
    <Frame domain="adacho.example" className="mock-vibrant">
      <div className="mv-vibrant">
        <header>
          <b>Ada Cho</b>
          <nav>
            <span>Plates</span>
            <span>Pop-ups</span>
            <span>Diary</span>
          </nav>
        </header>
        <div className="mv-hero">
          <div>
            <p>Chef portfolio</p>
            <strong>Plates with the volume up.</strong>
            <em>Selected menus, pop-ups, and the diary from the pass.</em>
          </div>
          <figure>
            <span className="shot shot-plate" />
            <figcaption>Citrus, olive oil · 2026</figcaption>
          </figure>
        </div>
        <ul>
          <li>
            <span className="shot shot-night" />
            <b>Night market</b>
            <small>Three nights in Kampong Glam</small>
          </li>
          <li>
            <span className="shot shot-bowl" />
            <b>The red room</b>
            <small>Private dining, twelve seats</small>
          </li>
          <li>
            <span className="shot shot-citrus" />
            <b>Sunday diary</b>
            <small>What left the pass</small>
          </li>
        </ul>
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
            <span>Work</span>
            <span>About</span>
            <span>Note</span>
          </nav>
        </header>
        <p className="mv-giant">
          RIO
          <small>art direction</small>
        </p>
        <ol>
          <li>
            <span className="shot shot-market" />
            <div>
              <b>01 Night market</b>
              <em>Campaign · 2026</em>
            </div>
          </li>
          <li>
            <span className="shot shot-redroom" />
            <div>
              <b>02 Red room</b>
              <em>Set · 2025</em>
            </div>
          </li>
          <li>
            <span className="shot shot-chrome" />
            <div>
              <b>03 Chrome fruit</b>
              <em>Stills · 2025</em>
            </div>
          </li>
        </ol>
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
          <span>Photographs</span>
        </header>
        <figure className="bk-hero">
          <span className="shot shot-room" />
          <figcaption>The spare room, morning</figcaption>
        </figure>
        <figure className="bk-side">
          <span className="shot shot-hands" />
          <figcaption>Hands at the pass</figcaption>
        </figure>
        <figure className="bk-low">
          <span className="shot shot-portrait" />
          <figcaption>Portrait, blue hour</figcaption>
        </figure>
        <p className="bk-name">
          Off the
          <br />
          grid.
        </p>
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
            <span>Work</span>
            <span>The book</span>
            <span>Visit</span>
          </nav>
        </header>
        <section>
          <p>Pastry studio</p>
          <h3>Sweet work, held up to the light.</h3>
        </section>
        <div>
          <article>
            <span className="shot shot-tart" />
            <b>Olive oil tart</b>
            <em>Citrus, 2026</em>
          </article>
          <article>
            <span className="shot shot-glaze" />
            <b>Mirror glaze</b>
            <em>Fruit, 2025</em>
          </article>
          <article>
            <span className="shot shot-book" />
            <b>The book</b>
            <em>Forty plates</em>
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
          <span>Motion reel</span>
        </header>
        <figure>
          <span className="shot shot-title" />
          <figcaption>
            <strong>NOVA</strong>
            <em>Title sequence · 00:42</em>
          </figcaption>
        </figure>
        <ul>
          <li>
            <b>01</b>
            <span>Opening titles</span>
            <em>2026</em>
          </li>
          <li>
            <b>02</b>
            <span>Club identity</span>
            <em>2025</em>
          </li>
          <li>
            <b>03</b>
            <span>Night bus</span>
            <em>2025</em>
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
            <span>Menu</span>
            <span>Room</span>
            <span>Visit</span>
          </nav>
        </header>
        <figure>
          <span className="shot shot-dining" />
          <figcaption>The tasting room, after service</figcaption>
        </figure>
        <ol>
          <li>
            <b>01</b>
            <span>The tasting</span>
            <em>Eight courses</em>
          </li>
          <li>
            <b>02</b>
            <span>Private dining</span>
            <em>Twelve seats</em>
          </li>
          <li>
            <b>03</b>
            <span>The diary</span>
            <em>What changed</em>
          </li>
        </ol>
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
