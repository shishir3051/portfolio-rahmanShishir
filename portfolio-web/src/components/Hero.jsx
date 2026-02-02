import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, Code, Database, Bug, Briefcase, GraduationCap, Globe } from 'lucide-react';

const Hero = ({ name, headline }) => {
  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to center of screen
      const { innerWidth, innerHeight } = window;
      const x = e.clientX - innerWidth / 2;
      const y = e.clientY - innerHeight / 2;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const springConfig = { stiffness: 100, damping: 30 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform values for different layers (parallax effect)
  const bgX = useTransform(x, (val) => val / 40); // Background moves slightly opposite
  const bgY = useTransform(y, (val) => val / 40);

  const imgX = useTransform(x, (val) => val / -20); // Image moves slightly
  const imgY = useTransform(y, (val) => val / -20);

  const badgeX = useTransform(x, (val) => val / -15); // Badge moves more
  const badgeY = useTransform(y, (val) => val / -15);
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
          className="lg:col-span-7 relative z-10 order-2 lg:order-1 pt-10 lg:pt-0"
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
        >
          <motion.div className="mb-6 lg:mb-10" variants={itemVars}>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-panel/20 backdrop-blur-xl text-xs md:text-sm text-text font-bold uppercase tracking-[0.2em]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
              Available for Partnership
            </div>
          </motion.div>

          <motion.h1
            className="text-[3.5rem] leading-[1] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem] font-black tracking-tighter mb-8"
            variants={itemVars}
          >
            <span className="block text-stroke-light text-transparent mb-[-0.2em]">I AM</span>
            <span className="block bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              {name ? name.split(' ')[0].toUpperCase() : "RAHMAN"}
            </span>
            <span className="block text-accent">
              {name ? name.split(' ').slice(1).join(' ').toUpperCase() : "SHISHIR"}
            </span>
          </motion.h1>

          <motion.div
            className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12"
            variants={itemVars}
          >
            <div className="h-px w-20 bg-accent hidden md:block"></div>
            <p className="text-muted text-lg md:text-xl max-w-[40ch] leading-relaxed font-light">
              {headline || "Enterprise-grade engineering with a security-first mindset. Specializing in Java Full-Stack development."}
            </p>
          </motion.div>

          <motion.div className="flex flex-wrap gap-6" variants={itemVars}>
            <a href="#projects" className="group relative px-10 py-5 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 overflow-hidden flex items-center gap-3">
              VIEW WORK
              <span className="bg-black text-white rounded-full p-1 group-hover:rotate-45 transition-transform duration-300">
                <Code className="w-4 h-4" />
              </span>
            </a>
            <a href="#contact" className="px-10 py-5 border border-white/20 hover:border-white hover:bg-white/5 rounded-full font-bold transition-all flex items-center gap-3 text-white uppercase tracking-widest text-xs">
              Contact Me
            </a>
          </motion.div>

          {/* Integrated Snapshots - Horizontal Bar on Desktop */}
          <motion.div
            className="hidden lg:grid grid-cols-4 gap-8 mt-24 border-t border-white/10 pt-8"
            variants={itemVars}
          >
            {snapshotItems.map((item, i) => {
              const Content = (
                <div className="flex flex-col gap-1 cursor-pointer group/stat">
                  <span className="text-xs text-muted uppercase tracking-widest group-hover/stat:text-accent transition-colors">{item.label}</span>
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    {item.value}
                    {React.cloneElement(item.icon, { className: `w-4 h-4 ${item.color} opacity-80 group-hover/stat:scale-110 transition-transform` })}
                  </div>
                </div>
              );

              if (item.link) {
                return <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">{Content}</a>;
              }
              return <div key={i}>{Content}</div>;
            })}
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5 relative order-1 lg:order-2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ x: imgX, y: imgY }}
        >
          <div className="relative z-10">
            {/* Abstract Background Elements */}
            <motion.div
              style={{ x: bgX, y: bgY }}
              className="absolute -top-20 -right-20 w-[140%] h-[140%] bg-gradient-radial from-accent/20 to-transparent blur-[80px] -z-10"
            ></motion.div>

            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm max-w-[400px] mx-auto lg:ml-auto group">
              <motion.img
                src="/assets/profile2.png"
                alt={name}
                className="w-full h-auto object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />

              {/* Mobile/Tablet Snapshot Grid Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 lg:hidden">
                <div className="grid grid-cols-2 gap-4">
                  {snapshotItems.map((item, i) => {
                    const Content = (
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">{item.label}</span>
                        <span className="text-sm font-bold text-white block">{item.value}</span>
                      </div>
                    );

                    if (item.link) {
                      return <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">{Content}</a>;
                    }
                    return <div key={i}>{Content}</div>;
                  })}
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute top-10 -left-10 hidden lg:flex items-center gap-4 bg-panel border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md z-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ x: badgeX, y: badgeY }}
            >
              <div className="bg-accent/20 p-3 rounded-xl text-accent">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-muted font-bold uppercase tracking-wider">Software</div>
                <div className="text-sm font-bold text-white">Engineer</div>
              </div>
            </motion.div>
          </div>
        </motion.div>      </div>
    </section>
  );
};


export default Hero;
