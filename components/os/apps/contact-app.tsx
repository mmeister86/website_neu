import { Mail, Github, Linkedin, Twitter } from "lucide-react"

const CONTACTS = [
  { icon: Mail, label: "E-Mail", value: "hallo@matthias.lol", href: "mailto:hallo@matthias.lol" },
  { icon: Github, label: "GitHub", value: "github.com/matthias", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", value: "/in/matthias", href: "https://linkedin.com" },
  { icon: Twitter, label: "X/Twitter", value: "@matthias", href: "https://x.com" },
]

export function ContactApp() {
  return (
    <div className="h-full bg-background p-4 overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Kontakt</h2>
        <p className="text-sm text-terminal-dim">Antwortzeit: 24-48h</p>
        <p className="text-xs text-terminal-dim">(außer ich debugge gerade)</p>
      </div>

      <div className="space-y-3">
        {CONTACTS.map((contact) => {
          const Icon = contact.icon
          return (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:border-terminal-pink/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-terminal-pink/20 transition-colors">
                <Icon className="w-5 h-5 text-terminal-pink" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{contact.label}</p>
                <p className="text-xs text-muted-foreground">{contact.value}</p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
