import { teamContent } from "@/lib/content";

/* ─── 조직도(팀 소개) 섹션 ───────────────────────────────────
   [대표님 확인] 실제 직원 사진이 준비되면 이니셜 원형 대신
   next/image로 교체한다. 지금은 이름·직책만 표기.
──────────────────────────────────────────────────────────── */
function Member({ name, role, size = "md" }: { name: string; role: string; size?: "lg" | "md" }) {
  const dim = size === "lg" ? "w-16 h-16 text-xl" : "w-12 h-12 text-base";
  return (
    <div className="flex flex-col items-center text-center gap-2.5">
      <div
        className={`${dim} flex items-center justify-center rounded-full bg-ink text-white font-serif`}
      >
        {name.slice(0, 1)}
      </div>
      <div>
        <p className="font-sans text-sm font-medium text-ink">{name}</p>
        <p className="font-sans text-xs text-concrete">{role}</p>
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-[880px] mx-auto px-5 lg:px-10">
        <p className="label-en mb-4 text-concrete text-center">Team</p>
        <h2 className="font-serif text-2xl lg:text-4xl font-light text-ink text-center tracking-wide mb-5">
          {teamContent.title}
        </h2>
        <p className="font-sans text-sm lg:text-base text-concrete text-center leading-relaxed mb-14 lg:mb-16">
          {teamContent.subtitle}
        </p>

        <div className="flex justify-center mb-14">
          <Member name={teamContent.lead.name} role={teamContent.lead.role} size="lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-14">
          {teamContent.units.map((unit) => (
            <div key={unit.name}>
              <p className="font-sans text-sm font-medium text-ink text-center mb-6 pb-3 border-b border-concrete/15">
                {unit.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-7">
                {unit.members.map((m) => (
                  <Member key={m.name} name={m.name} role={m.role} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
