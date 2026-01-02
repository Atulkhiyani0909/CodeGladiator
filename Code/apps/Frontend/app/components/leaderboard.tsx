import { SectionHeader } from "./SectionHeader";

export const LeaderboardPreview = () => (
  <section className="py-24 px-6 bg-[#121212]">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Top Gladiators"
        subtitle="Join a community-driven arena. Rivalry fuels improvement."
      />
      <div className="overflow-hidden rounded-2xl border border-orange-900/30 shadow-2xl bg-[#1a1a1a]">
        <table className="w-full text-left text-gray-400">
          <thead className="bg-[#0a0a0a] text-orange-500 uppercase text-sm tracking-wider">
            <tr>
              <th className="py-5 px-6 font-bold">Rank</th>
              <th className="py-5 px-6 font-bold">Gladiator</th>
              <th className="py-5 px-6 font-bold text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-orange-900/10 hover:bg-orange-500/5 transition-all">
                <td className="py-5 px-6 font-bold text-white">#{i + 1}</td>
                <td className="py-5 px-6 flex items-center">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full mr-3"></div>
                  Gladiator_{i + 1}
                </td>
                <td className="py-5 px-6 text-orange-400 font-bold text-right">{9000 - (i * 500)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);