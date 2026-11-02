import type { HomePage } from "@/types";

const STATIONS = [1, 9, 18, 27, 36];

type ProjectsBandProps = Pick<HomePage, "projectsTitle" | "projectsText" | "stationsTitle" | "stationsText">;

export function ProjectsBand({ projectsTitle, projectsText, stationsTitle, stationsText }: ProjectsBandProps) {
  return (
    <section className="band proj-band" id="projeler" aria-labelledby="pH">
      <div className="wrap proj">
        <div className="proj-copy">
          <h2 id="pH">{projectsTitle}</h2>
          {projectsText
            ?.split(/\n\s*\n/)
            .filter(Boolean)
            .map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <div className="stations">
          <h3>{stationsTitle}</h3>
          {stationsText && <p>{stationsText}</p>}
          <div className="st-row">
            {STATIONS.map((n) => (
              <div className="st" key={n}>
                <span className="st-dots" style={{ gridTemplateColumns: `repeat(${Math.min(n, 6)}, auto)` }}>
                  {Array.from({ length: n }, (_, i) => (
                    <i key={i} />
                  ))}
                </span>
                <b>{n}</b>
                <small>{n === 1 ? "tekli kaset" : "lamba"}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
