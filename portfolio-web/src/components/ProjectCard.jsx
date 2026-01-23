import React from 'react';

const ProjectCard = ({ title, description, tag, date, role, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer min-h-[200px] bg-panel border border-stroke rounded-[24px] p-8 backdrop-blur-xl hover:bg-panel2 hover:-translate-y-1.5 transition-all flex flex-col"
    >
      <div className="flex justify-start mb-6">
        <span className="px-5 py-2 rounded-full bg-accent/15 border border-accent/20 text-xs font-bold text-accent/90">
          {tag}
        </span>
      </div>
      
      <h4 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-accent transition-colors">
        {title}
      </h4>
      
      <p className="text-muted text-[1.05rem] leading-relaxed line-clamp-3 mb-8">
        {description}
      </p>
      
      <div className="mt-auto flex justify-between items-center text-sm font-bold">
        <span className="text-muted2">{date}</span>
        <span className="text-muted2">{role || "Lead Developer"}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
