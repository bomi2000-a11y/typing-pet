// 타수 변화 그래프 (외부 라이브러리 없이 SVG로 직접 그림)
const PAD = { top: 20, right: 16, bottom: 28, left: 44 };

// width: PC는 넓게(640), 휴대폰은 좁게(360) 그려야 글자가 너무 작아지지 않아요.
export default function SpeedChart({ records, width = 640 }) {
  const W = width;
  const H = width > 400 ? 220 : 200;
  const data = records.slice(0, 30).reverse(); // 최근 30개, 오래된 것부터
  if (data.length < 2) {
    return <p className="empty-chart">2번 연습하면 타수 그래프가 생겨요.</p>;
  }

  const speeds = data.map((r) => r.speed);
  const max = Math.max(...speeds);
  const min = Math.min(...speeds);
  const top = Math.ceil((max + 20) / 50) * 50;
  const bottom = Math.max(0, Math.floor((min - 20) / 50) * 50);
  const x = (i) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v) => PAD.top + (1 - (v - bottom) / (top - bottom)) * (H - PAD.top - PAD.bottom);
  const path = data.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r.speed).toFixed(1)}`).join(' ');
  const bestIndex = speeds.lastIndexOf(max);
  const ticks = [bottom, Math.round((bottom + top) / 2), top];
  const first = new Date(data[0].date);
  const last = new Date(data[data.length - 1].date);
  const short = (d) => `${d.getMonth() + 1}/${d.getDate()}`;

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`최근 ${data.length}회 타수 변화, 최고 ${max}타`}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="chart-label" x={PAD.left - 8} y={y(t) + 4} textAnchor="end">{t}</text>
          </g>
        ))}
        <path className="chart-line" d={path} />
        {data.map((r, i) => (
          <circle key={r.id} className={i === bestIndex ? 'chart-dot best' : 'chart-dot'} cx={x(i)} cy={y(r.speed)} r={i === bestIndex ? 6 : 3.5}>
            <title>{`${short(new Date(r.date))} ${r.type} ${r.speed}타`}</title>
          </circle>
        ))}
        <text
          className="chart-best"
          x={Math.min(Math.max(x(bestIndex), PAD.left + 30), W - PAD.right)}
          y={y(max) - 12}
          textAnchor={x(bestIndex) > W - PAD.right - 30 ? 'end' : 'middle'}
        >
          최고 {max}
        </text>
        <text className="chart-label" x={PAD.left} y={H - 6}>{short(first)}</text>
        <text className="chart-label" x={W - PAD.right} y={H - 6} textAnchor="end">{short(last)}</text>
      </svg>
    </figure>
  );
}
