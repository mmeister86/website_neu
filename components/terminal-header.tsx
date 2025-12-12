export function TerminalHeader() {
  return (
    <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-t-md border border-b-0 border-border">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
      </div>
      <div className="flex-1 text-center">
        <span className="text-muted-foreground text-sm">matthias@chaos-quest: ~</span>
      </div>
      <div className="text-muted-foreground text-xs">zsh</div>
    </div>
  )
}
