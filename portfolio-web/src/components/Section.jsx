import React from 'react';

const Section = ({ id, title, subtitle, children, className = "" }) => {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="mb-12 reveal active">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
          {subtitle && <p className="text-muted max-w-[70ch] leading-relaxed">{subtitle}</p>}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-stroke to-transparent mt-6 mb-8"></div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;
