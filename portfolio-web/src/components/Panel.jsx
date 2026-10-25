// Frosted-glass panel with an optional title bar (label on the left, meta on the right).
// Used by the blog, uses and policy pages, the sign-in card and the admin dashboard.
const Panel = ({ title, meta, children, className = '', bodyClassName = '', as = 'div', ...rest }) => {
  const Tag = as;
  return (
    <Tag className={`glass overflow-hidden ${className}`} {...rest}>
      {(title || meta) && (
        <div className="panel-head">
          {/* div (not span) so a title may contain a heading element */}
          <div className="flex min-w-0 items-center gap-2.5 truncate">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, var(--aurora-1), var(--aurora-2))', boxShadow: '0 0 8px var(--glow)' }}
              aria-hidden="true"
            />
            {title}
          </div>
          {meta && <span className="shrink-0">{meta}</span>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
};

export default Panel;
