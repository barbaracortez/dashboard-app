import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({ label, value, icon: Icon, change, hint, loading }) {
  const hasChange = typeof change === "number" && Number.isFinite(change);
  const up = hasChange && change >= 0;

  return (
    <div className="card stat-card">
      <div className="stat-head">
        <span className="stat-label">{label}</span>
        {Icon && (
          <span className="stat-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}
      </div>
      {loading ? (
        <div className="skeleton skeleton-value" />
      ) : (
        <div className="stat-value">{value}</div>
      )}
      <div className="stat-foot">
        {hasChange && !loading && (
          <span className={`stat-change ${up ? "up" : "down"}`}>
            {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
    </div>
  );
}
