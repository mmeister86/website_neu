const SKILLS = [
  { name: "TypeScript", level: 95, color: "bg-terminal-cyan" },
  { name: "JavaScript", level: 92, color: "bg-terminal-yellow" },
  { name: "React/Next.js", level: 90, color: "bg-terminal-pink" },
  { name: "Node.js", level: 85, color: "bg-terminal-green" },
  { name: "Python", level: 75, color: "bg-blue-500" },
  { name: "PostgreSQL", level: 70, color: "bg-purple-500" },
  { name: "Docker", level: 68, color: "bg-cyan-500" },
  { name: "Rust", level: 50, color: "bg-orange-500" },
]

export function SkillsApp() {
  return (
    <div className="h-full bg-transparent p-4 overflow-y-auto">
      <div className="space-y-1 mb-4 font-mono text-xs text-terminal-dim">
        <p>$ cat /proc/skills</p>
      </div>

      <div className="space-y-3">
        {SKILLS.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground font-medium">{skill.name}</span>
              <span className="text-terminal-dim">{skill.level}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${skill.color} transition-all duration-500`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-card rounded-lg border border-border">
        <p className="text-xs text-terminal-dim font-mono">
          // Weitere Skills: Git, Linux, AWS, GraphQL, Redis, Kubernetes (learning)
        </p>
      </div>
    </div>
  )
}
