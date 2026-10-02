export function RoomVisual({
  kind,
  className = "",
}: {
  kind?: string | null;
  className?: string;
}) {
  const k = kind ?? "lime";
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      {k === "kitchen" ? <Kitchen /> : k === "study" ? <Study /> : <Lime />}
    </div>
  );
}

function Lime() {
  return (
    <div className="absolute inset-0 bg-[#d7d2c4]">
      <div className="absolute inset-x-[12%] top-[14%] bottom-[22%] bg-[#c5cbb0]" />
      <div className="absolute inset-x-[18%] top-[22%] h-[38%] bg-[#e7e4d8]/70" />
      <div className="absolute bottom-[22%] left-[12%] right-[12%] h-px bg-[#9a7b52]/40" />
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[#b7a48a]" />
      <div className="absolute left-[22%] top-[30%] h-[28%] w-[18%] bg-[#8a9580]/35" />
      <div className="absolute right-[20%] top-[28%] h-[32%] w-[10%] bg-[#f5f4f1]/50" />
    </div>
  );
}

function Kitchen() {
  return (
    <div className="absolute inset-0 bg-[#efe6d8]">
      <div className="absolute inset-x-[8%] top-[18%] bottom-[30%] bg-[#e4d3bc]" />
      <div className="absolute inset-x-[8%] bottom-[30%] h-[12%] bg-[#6f5840]" />
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[#cbb79a]" />
      <div className="absolute left-[14%] top-[26%] h-[22%] w-[28%] bg-[#f7f1e6]" />
      <div className="absolute right-[16%] top-[24%] bottom-[42%] w-[8%] bg-[#c4a37a]/50" />
    </div>
  );
}

function Study() {
  return (
    <div className="absolute inset-0 bg-[#1c1c1f]">
      <div className="absolute inset-x-[10%] top-[12%] bottom-[28%] bg-[#2a2a30]" />
      <div className="absolute left-[16%] right-[16%] top-[18%] h-[42%] bg-[#ece8df]/15" />
      <div className="absolute inset-x-[10%] bottom-[28%] h-[10%] bg-[#c4a37a]/25" />
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[#121214]" />
      <div className="absolute left-[18%] bottom-[28%] h-px w-[30%] bg-[#c4a37a]" />
    </div>
  );
}
