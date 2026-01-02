'use client'

import React from 'react';
import { Code, Cpu, Terminal, User, Award, Play, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/navbar';
import { LeaderboardPreview } from '../components/leaderboard';
import { Footer } from '../components/footer';
import { SectionHeader } from '../components/SectionHeader';
import { Hero } from '../components/hero';







const WhatIs = () => (
  <section className="py-24 px-6 bg-[#121212]">
    <SectionHeader
      title={<>What is <span className="text-orange-500">Code Gladiator Battle?</span></>}
      subtitle="A premier platform for competitive programming, where developers from around the globe face off in skill-based, timed coding challenges. Prove your prowess, climb the ranks, and earn your place among the best."
    />
  </section>
);

const HowItWorks = () => {
  const steps = [
    { title: "1. Sign Up & Login", description: "Create your gladiator profile to enter the arena.", icon: User },
    { title: "2. Choose Battle", description: "Select a tournament or live challenge that fits your skill.", icon: Play },
    { title: "3. Code Under Pressure", description: "Solve complex problems within the time limit.", icon: Code },
    { title: "4. Get Ranked", description: "Your performance determines your gladiator rank.", icon: Award },
  ];
  return (
    <section className="py-24 px-6 bg-[#0a0a0a] relative">
      <div className="absolute inset-0 bg-[url('/dark-grid.png')] bg-repeat opacity-10"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader title="How It Works" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#1a1a1a] p-8 rounded-2xl border border-orange-900/30 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-orange-500/10 relative group">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-orange-600 to-orange-400 w-14 h-14 rounded-2xl rotate-45 flex items-center justify-center shadow-md group-hover:shadow-orange-500/50 transition-all">
                <step.icon className="w-7 h-7 text-white -rotate-45" />
              </div>
              <h3 className="text-xl font-bold text-white mt-10 mb-4 tracking-tight">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-orange-500/30">
                  <ChevronRight className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CoreFeatures = () => {
  const features = [
    { title: "Real-time coding battles", icon: Terminal },
    { title: "Timed challenges", icon: Cpu },
    { title: "Multiple difficulty levels", icon: Award },
    { title: "Multi-language support", icon: Code },
  ];
  return (
    <section className="py-24 px-6 bg-[#121212]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Core Features" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#1a1a1a] p-8 rounded-2xl border border-orange-900/30 hover:border-orange-500/50 transition-all duration-300 flex flex-col items-center text-center hover:shadow-lg hover:shadow-orange-500/10 group">
              <div className="bg-orange-500/10 p-4 rounded-full mb-6 group-hover:bg-orange-500/20 transition-all">
                <feature.icon className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => (
  <section className="py-24 px-6 bg-[#0a0a0a] relative">
    <div className="absolute inset-0 bg-[url('/dark-grid.png')] bg-repeat opacity-10"></div>
    <div className="max-w-7xl mx-auto text-center relative z-10">
      <SectionHeader title="Why Join?" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          "Improve problem-solving speed & skills.",
          "Prepare effectively for interviews & contests.",
          "Compete head-to-head with top developers worldwide.",
          "Earn recognition, badges, and rewards for your prowess."
        ].map((benefit, index) => (
          <div key={index} className="bg-[#1a1a1a] p-6 rounded-2xl border border-orange-900/30 flex items-center text-left">
            <div className="mr-4">
              <Award className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-lg text-gray-400 leading-relaxed">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);






function App() {
  return (
    <div className="font-sans bg-[#0a0a0a] text-gray-100 overflow-x-hidden selection:bg-orange-500/30">
      <Navbar />
      <Hero />
      <WhatIs />
      <HowItWorks />
      <CoreFeatures />
      <Benefits />
      <LeaderboardPreview />
      <Footer />
    </div>
  );
}

export default App;