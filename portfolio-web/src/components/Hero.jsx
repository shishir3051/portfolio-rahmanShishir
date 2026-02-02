import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Code, Database, Bug, Briefcase, GraduationCap, Globe } from 'lucide-react';

const Hero = ({ name, headline }) => {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const snapshotItems = [
    { label: "Experience", value: "1.5+ Years", icon: <Briefcase className="w-5 h-5" />, color: "text-accent" },
    { label: "Projects", value: "10+ Total", icon: <Code className="w-5 h-5" />, color: "text-accent2" },
    { label: "Education", value: "B.Sc SWE", icon: <GraduationCap className="w-5 h-5" />, color: "text-white" },
    { label: "Company", value: "naztech Inc", icon: <Globe className="w-5 h-5" />, color: "text-accent", link: "https://naztech.io/" },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center py-20 relative pt-32">
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          className="lg:col-span-7 relative z-10"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
        >
          <motion.div className="mb-8" variants={itemVars}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl border border-stroke bg-panel/30 backdrop-blur-md text-sm text-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
              </span>
              Available for <b className="text-text">Professional Partnership</b>
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8"
            variants={itemVars}
          >
            <span className="text-muted2">I'm</span> <span className="bg-gradient-to-r from-accent via-accent2 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-flow">{name || "Rahman Shishir"}</span><br />
            <span className="opacity-80">Software Engineer</span>
          </motion.h1>

          <motion.p
            className="text-muted text-xl max-w-[50ch] mb-10 leading-relaxed font-medium"
            variants={itemVars}
          >
            {headline || "Enterprise-grade engineering with a security-first mindset. Specializing in Java Full-Stack development and Cybersecurity auditing."}
          </motion.p>

          <motion.div className="flex flex-wrap gap-5 items-center" variants={itemVars}>
            <a href="#projects" className="group relative px-10 py-5 bg-text text-bg rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                VIEW PROJECTS
                <Code className="w-5 h-5" />
              </span>
            </a>
            <a href="#contact" className="px-10 py-5 border border-stroke bg-panel/30 hover:bg-panel rounded-2xl font-black backdrop-blur-sm transition-all flex items-center gap-2 text-sm uppercase tracking-widest">
              Connect
              <Shield className="w-5 h-5 text-accent" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5 relative mt-20 lg:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-4">
            {snapshotItems.map((item, i) => {
              const CardContent = (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-panel border border-stroke flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                    {React.cloneElement(item.icon, { className: "w-6 h-6 group-hover:text-white transition-colors" })}
                  </div>
                  <div>
                    <span className="block text-xs text-muted2 uppercase font-black tracking-[0.2em] mb-1">{item.label}</span>
                    <b className={`text-2xl font-black ${item.color}`}>{item.value}</b>
                  </div>
                </>
              );

              const cardClasses = `glass p-6 sm:p-8 flex flex-col justify-between aspect-square group ${i === 1 ? 'md:mt-8' : i === 2 ? 'md:-mt-8' : ''}`;

              if (item.link) {
                return (
                  <motion.a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={cardClasses}
                  >
                    {CardContent}
                  </motion.a>
                );
              }

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={cardClasses}
                >
                  {CardContent}
                </motion.div>
              );
            })}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/20 blur-[120px] rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
