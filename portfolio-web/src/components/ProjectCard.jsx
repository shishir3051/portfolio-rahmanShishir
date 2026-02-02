import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, User } from 'lucide-react';

const ProjectCard = ({ title, description, tag, date, role, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass p-8 flex flex-col h-full group relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-5 h-5 text-accent" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
          {tag}
        </span>
      </div>

      <h4 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{title}</h4>
      <p className="text-muted text-sm line-clamp-3 mb-6 flex-grow">{description}</p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted2 border-t border-stroke pt-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{role}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
