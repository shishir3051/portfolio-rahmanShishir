import React from 'react';

const ProjectCard = ({ title, description, tag, date }) => {
  return (
    <div className="group cursor-pointer min-h-[170px] bg-panel border border-stroke rounded-[20px] p-6 backdrop-blur-xl hover:bg-panel2 hover:-translate-y-1.5 transition-all">
      <div className="inline-block font-bold text-xs text-white/90 bg-accent/20 border border-accent/25 px-3 py-1.5 rounded-full mb-3">
        {tag}
      </div>
      <h4 className="text-xl font-bold tracking-tight mb-2 group-hover:text-accent transition-colors">{title}</h4>
      <p className="text-muted text-[0.95rem] line-clamp-2 mb-6">{description}</p>
      <div className="mt-auto flex justify-between items-center text-muted2 font-semibold text-sm">
        <span>View Details</span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
