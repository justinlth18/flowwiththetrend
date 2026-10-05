import type { Project } from "@/lib/content";

export function MiniSite({ project }: { project: Project }) {
  return (
    <div className="browser" style={{ background: project.canvas, color: project.ink }}>
      <div className="browser-bar">
        <i />
        <i />
        <i />
        <span>{project.domain}</span>
      </div>
      <div className="browser-body">
        <p className="browser-kicker">{project.kind}</p>
        <strong>{project.name}</strong>
        <em>{project.tagline}</em>
        <ul>
          {project.highlights.map((item) => (
            <li key={item} style={{ background: project.accent, color: "#161616" }}>
              {item}
            </li>
          ))}
        </ul>
        <span className="browser-btn" style={{ background: project.ink, color: project.canvas }}>
          {project.kind === "Restaurant" ? "book a table" : "view the work"}
        </span>
      </div>
    </div>
  );
}
