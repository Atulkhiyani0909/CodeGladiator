export const Footer = () => (
  <footer className="bg-[#0a0a0a] py-16 px-6 relative border-t border-orange-900/30">
    <div className="absolute inset-0 bg-[url('/dark-grid.png')] bg-repeat opacity-5"></div>
    <div className="max-w-7xl mx-auto text-center relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">Ready to Prove Your Logic?</h2>
      <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">The arena awaits. Join the battle and claim your victory.</p>
      <button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-4 px-12 rounded-lg transition transform hover:scale-105 shadow-lg shadow-orange-500/30 text-lg uppercase tracking-wider">
        Prove Your Skills
      </button>
      <div className="mt-16 pt-8 border-t border-orange-900/10 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Code Gladiator Battle. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-orange-500 transition">Terms</a>
          <a href="#" className="hover:text-orange-500 transition">Privacy</a>
          <a href="#" className="hover:text-orange-500 transition">Contact</a>
        </div>
      </div>
    </div>
  </footer>
);