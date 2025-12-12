import { ExternalLink, Github, Star } from "lucide-react"

const PROJECTS = [
  {
    name: "Chaos Quest",
    description: "Diese Website hier. Meta, oder?",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    status: "Live",
    stars: 42,
  },
  {
    name: "Geheimes Projekt X",
    description: "Kann ich nicht drüber reden...",
    tech: ["[ZENSIERT]"],
    status: "In Entwicklung",
    stars: null,
  },
  {
    name: "CLI Tools Collection",
    description: "Sammlung von nützlichen Terminal-Tools",
    tech: ["Rust", "Go"],
    status: "Open Source",
    stars: 128,
  },
]

export function ProjectsApp() {
  return (
    <div className="h-full bg-transparent p-4 overflow-y-auto">
      <div className="space-y-4">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="bg-card rounded-lg border border-border p-4 hover:border-terminal-pink/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{project.name}</h3>
              <div className="flex items-center gap-2">
                {project.stars && (
                  <span className="flex items-center gap-1 text-xs text-terminal-yellow">
                    <Star className="w-3 h-3" />
                    {project.stars}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    project.status === "Live"
                      ? "bg-terminal-green/20 text-terminal-green"
                      : project.status === "Open Source"
                        ? "bg-terminal-cyan/20 text-terminal-cyan"
                        : "bg-terminal-yellow/20 text-terminal-yellow"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-secondary rounded text-terminal-dim">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-secondary rounded transition-colors">
                  <Github className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 hover:bg-secondary rounded transition-colors">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
