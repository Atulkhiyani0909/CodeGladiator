export const SectionHeader = ({ title, subtitle }:any) => (
  <div className="max-w-7xl mx-auto text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);