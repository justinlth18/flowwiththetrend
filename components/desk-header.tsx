"use client";

export function DeskHeader({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  async function logout() {
    await fetch("/api/desk/logout", { method: "POST" });
    window.location.assign("/desk");
  }

  return (
    <header className="desk-top">
      <div>
        <p className="kicker">studio desk</p>
        <h1 className="plain-title">{title}</h1>
      </div>
      <div className="desk-actions">
        {action ? (
          <a className="btn btn-green" href={action.href}>
            {action.label}
          </a>
        ) : null}
        <button className="btn" type="button" onClick={() => void logout()}>
          lock the desk
        </button>
      </div>
    </header>
  );
}
