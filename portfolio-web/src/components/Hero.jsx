import React from 'react';

const Hero = ({ name, headline }) => {
  return (
    <section id="home" className="min-h-[calc(100vh-80px)] flex items-center py-20">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal active">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-stroke bg-panel text-muted mb-6">
            <span className="w-2 h-2 rounded-full bg-accent2 animate-pulse"></span>
            Available for <b className="text-text">Partnership</b>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6">
            I'm <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">{name || "Rahman Shishir"}</span><br />
            Software Engineer
          </h1>
          <p className="text-muted text-lg max-w-[60ch] mb-8 leading-relaxed">
            B.Sc in SWE (Major in Cybersecurity) | Ethical Hacker Essential (E|HE) | Java Full-Stack Developer. Specialize in secure, high-performance engineering.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a href="#projects" className="px-8 py-4 bg-gradient-to-br from-accent to-accent2 rounded-xl font-bold shadow-xl shadow-accent/20 hover:shadow-accent/40 active:translate-y-px transition-all flex items-center justify-center">
              View Projects
            </a>
            <a href="#contact" className="px-8 py-4 border border-accent/40 rounded-xl font-bold hover:bg-accent/10 transition-all">
              Connect Now
            </a>
          </div>
        </div>

        <div className="relative group reveal active">
          <div className="bg-panel border border-stroke rounded-[32px] p-8 shadow-2xl backdrop-blur-xl relative z-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Professional Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-stroke bg-panel/50 hover:bg-panel transition-all text-center">
                <b className="text-2xl font-bold text-accent">1.5+</b>
                <span className="block text-xs text-muted2 mt-1 uppercase font-bold tracking-wider">Years Exp.</span>
              </div>
              <div className="p-5 rounded-2xl border border-stroke bg-panel/50 hover:bg-panel transition-all text-center">
                <b className="text-2xl font-bold text-accent2">10+</b>
                <span className="block text-xs text-muted2 mt-1 uppercase font-bold tracking-wider">Projects</span>
              </div>
              <div className="p-5 rounded-2xl border border-stroke bg-panel/50 hover:bg-panel transition-all text-center">
                <b className="text-2xl font-bold text-text">B.Sc</b>
                <span className="block text-xs text-muted2 mt-1 uppercase font-bold tracking-wider">SWE Degree</span>
              </div>
           <div className="p-5 rounded-2xl border border-stroke bg-panel/50 hover:bg-panel transition-all text-center">
  <a
    href="https://naztech.io/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-2xl font-bold text-text hover:underline"
  >
    naztech
  </a>
  <span className="block text-xs text-muted2 mt-1 uppercase font-bold tracking-wider">
    Company
  </span>
</div>

            </div>
          </div>
          <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full -z-10 translate-y-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
