import { useState } from "react";

const SEVERITY_STYLES = {
  critical: {
    border: "#E24B4A",
    bg: "#FCEBEB",
    iconBg: "#E24B4A",
    iconColor: "#fff",
    icon: "✕",
    ctaVariant: "filled",
    ctaColor: "#E24B4A",
  },
  warning: {
    border: "#EF9F27",
    bg: "#FAEEDA",
    iconBg: "#EF9F27",
    iconColor: "#fff",
    icon: "!",
    ctaVariant: "filled",
    ctaColor: "#854F0B",
  },
  info: {
    border: "#378ADD",
    bg: "#E6F1FB",
    iconBg: "#378ADD",
    iconColor: "#fff",
    icon: "i",
    ctaVariant: "ghost",
    ctaColor: "#185FA5",
  },
  nudge: {
    border: "#1D9E75",
    bg: "#E1F5EE",
    iconBg: "#1D9E75",
    iconColor: "#fff",
    icon: "↑",
    ctaVariant: "ghost",
    ctaColor: "#0F6E56",
  },
};

const TRUNCATE_AT = 120;

export default function InsightCard({ card, index = 0, onCTA }) {
  const [expanded, setExpanded] = useState(false);
  const style = SEVERITY_STYLES[card.severity] ?? SEVERITY_STYLES.info;
  const shouldTruncate = card.body.length > TRUNCATE_AT && !expanded;
  const bodyText = shouldTruncate
    ? card.body.slice(0, TRUNCATE_AT).trimEnd() + "…"
    : card.body;

  return (
    <div
      style={{
        background: style.bg,
        borderRadius: "12px",
        borderLeft: `4px solid ${style.border}`,
        padding: "16px 16px 16px 20px",
        display: "flex",
        gap: "14px",
        animation: `fadeSlideUp 0.4s ease both`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Severity icon */}
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: style.iconBg,
          color: style.iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "700",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          marginTop: "2px",
        }}
      >
        {style.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 6px",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "15px",
            fontWeight: "600",
            color: "#0F2D6B",
            lineHeight: "1.4",
          }}
        >
          {card.title}
        </p>
        <p
          style={{
            margin: "0 0 6px",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "14px",
            color: "#374151",
            lineHeight: "1.6",
          }}
        >
          {bodyText}
          {card.body.length > TRUNCATE_AT && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                background: "none",
                border: "none",
                padding: "0 0 0 4px",
                color: style.ctaColor,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {card.action && (
          <p
            style={{
              margin: "0 0 12px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: "13px",
              color: "#6B7280",
              lineHeight: "1.5",
            }}
          >
            {card.action}
          </p>
        )}

        <button
          onClick={() => onCTA?.(card.id)}
          style={{
            padding: style.ctaVariant === "filled" ? "8px 16px" : "6px 0",
            borderRadius: style.ctaVariant === "filled" ? "8px" : "0",
            background: style.ctaVariant === "filled" ? style.ctaColor : "transparent",
            color: style.ctaVariant === "filled" ? "#fff" : style.ctaColor,
            border: style.ctaVariant === "filled" ? "none" : "none",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            letterSpacing: "0.01em",
            textDecoration: style.ctaVariant === "ghost" ? "underline" : "none",
            textDecorationColor: style.ctaVariant === "ghost" ? `${style.ctaColor}60` : "none",
          }}
        >
          {card.cta}
        </button>
      </div>
    </div>
  );
}

/**
 * Usage:
 *
 * import InsightCard from '@/components/InsightCard'
 * import { generateInsights } from '@/engine/scorer'
 *
 * const insights = generateInsights(scoreResult)
 *
 * {insights.map((card, i) => (
 *   <InsightCard
 *     key={card.id}
 *     card={card}
 *     index={i}
 *     onCTA={(id) => {
 *       if (id === 'band-nudge') router.push('/check')
 *       else setAdvisorModalOpen(true)
 *     }}
 *   />
 * ))}
 *
 * Required global CSS (in globals.css):
 * @keyframes fadeSlideUp {
 *   from { opacity: 0; transform: translateY(10px); }
 *   to   { opacity: 1; transform: translateY(0); }
 * }
 */
