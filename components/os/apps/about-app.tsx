export function AboutApp() {
  return (
    <div className="h-full bg-background p-6 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-terminal-pink to-terminal-cyan flex items-center justify-center text-4xl font-bold text-background mb-3">
            M
          </div>
          <h1 className="text-xl font-bold text-foreground">Matthias</h1>
          <p className="text-terminal-dim text-sm">Software Engineer</p>
        </div>

        {/* Bio */}
        <div className="space-y-4 text-sm">
          <div className="bg-card rounded-lg p-4 border border-border">
            <h2 className="text-terminal-pink font-semibold mb-2">Über mich</h2>
            <p className="text-muted-foreground leading-relaxed">
              Digitaler Chaosarchitekt aus Deutschland. Ich baue Dinge die (meistens) funktionieren und debugge am
              liebsten um 3 Uhr nachts.
            </p>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <h2 className="text-terminal-cyan font-semibold mb-2">Philosophie</h2>
            <p className="text-muted-foreground italic">&quot;Es kompiliert? Ship it.&quot;</p>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <h2 className="text-terminal-green font-semibold mb-2">Fun Facts</h2>
            <ul className="text-muted-foreground space-y-1">
              <li>• Tabs {`>`} Spaces</li>
              <li>• Erster Code auf C64 in BASIC</li>
              <li>• BTW I use Arch (manchmal)</li>
              <li>• Kaffee ist Treibstoff</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
