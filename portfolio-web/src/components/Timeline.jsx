import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const TimelineItem = ({ item, index, isEducation }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative pl-8 md:pl-0 md:grid md:grid-cols-9 gap-4 mb-12"
        >
            {/* Date for Desktop (Left) */}
            <div className="hidden md:flex md:col-span-4 justify-end items-start text-right">
                <div className="bg-accent/5 border border-accent/20 px-4 py-2 rounded-xl">
                    <span className="text-sm font-bold text-accent font-mono">{item.date || item.year}</span>
                </div>
            </div>

            {/* Center Line and Icon */}
            <div className="absolute left-0 md:relative md:left-auto md:col-span-1 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-panel border-2 border-stroke flex items-center justify-center z-10 shadow-xl group-hover:border-accent transition-colors">
                    {isEducation ? <GraduationCap className="w-5 h-5 text-accent2" /> : <Briefcase className="w-5 h-5 text-accent" />}
                </div>
                <div className="w-px h-full bg-gradient-to-b from-stroke via-stroke/50 to-transparent absolute top-10"></div>
            </div>

            {/* Content (Right) */}
            <div className="md:col-span-4 group">
                <div className="glass p-6 hover:border-accent/40 transition-all">
                    <div className="md:hidden mb-2 inline-block bg-accent/5 border border-accent/20 px-3 py-1 rounded-lg">
                        <span className="text-xs font-bold text-accent font-mono">{item.date || item.year}</span>
                    </div>

                    <h4 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">{item.title}</h4>

                    <div className="flex flex-wrap gap-3 text-sm text-muted2 mb-4">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.location}</span>
                        </div>
                    </div>

                    {item.tasks && (
                        <ul className="space-y-3">
                            {item.tasks.map((task, i) => (
                                <li key={i} className="text-muted text-sm leading-relaxed flex gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0"></span>
                                    {task}
                                </li>
                            ))}
                        </ul>
                    )}

                    {item.desc && <p className="text-muted text-sm leading-relaxed">{item.desc}</p>}
                </div>
            </div>
        </motion.div>
    );
};

const Timeline = ({ items, type = "experience" }) => {
    return (
        <div className="relative py-8">
            {items.map((item, index) => (
                <TimelineItem
                    key={index}
                    item={item}
                    index={index}
                    isEducation={type === "education"}
                />
            ))}
        </div>
    );
};

export default Timeline;
