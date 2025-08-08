// src/components/MultiRingWheel.jsx
import React, { memo, useState, useEffect } from 'react';

const MultiRingWheel = memo(function MultiRingWheel({ data, size = 320, onSelect }) {
  const cx = size / 2;
  const cy = size / 2;
  const coreR = size * 0.16;
  const midR = size * 0.30;
  const outerR = size * 0.44;
  const [activeLayer, setActiveLayer] = useState('all');
  const [zoomed, setZoomed] = useState(null);

  const toXY = (angle, r) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  
  // تحديد طبقات المشاعر
  const emotionLayers = [
    { id: 'all', label: 'الكل', color: '#9CA3AF' },
    { id: 'core', label: 'الأساسية', color: '#EF4444' },
    { id: 'middle', label: 'المتوسطة', color: '#3B82F6' },
    { id: 'outer', label: 'الفرعية', color: '#10B981' },
  ];

  useEffect(() => {
    if (zoomed) {
      const timer = setTimeout(() => setZoomed(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [zoomed]);

  const renderSlices = () => {
    const slices = [];
    const coreAngle = (2 * Math.PI) / data.length;

    data.forEach((sector, i) => {
      const start = -Math.PI / 2 + i * coreAngle;
      const end = start + coreAngle;

      // Core slices - المشاعر الأساسية
      if (activeLayer === 'all' || activeLayer === 'core' || zoomed === sector.core) {
        const midAngle = start + coreAngle / 2;
        const [lx, ly] = toXY(midAngle, coreR * 0.6);
        slices.push(
          <Slice 
            key={`core-${i}`} 
            cx={cx} cy={cy} r1={0} r2={coreR} 
            start={start} end={end}
            fill={sector.color + (zoomed === sector.core ? 'FF' : 'CC')}
            label={sector.core}
            lx={lx} ly={ly} 
            fontSize={size * 0.022}
            opacity={zoomed && zoomed !== sector.core ? 0.3 : 1}
            onClick={() => {
              onSelect({ 
                name: sector.core, 
                desc: sector.desc, 
                coping: sector.coping,
                core: sector.core,
                coreColor: sector.color
              });
              setZoomed(sector.core);
            }}
          />
        );
      }

      // Middle slices - المشاعر المتوسطة
      const midPer = coreAngle / sector.middle.length;
      sector.middle.forEach((m, j) => {
        const mS = start + j * midPer;
        const mE = mS + midPer;
        const midAngle = mS + midPer / 2;

        if (activeLayer === 'all' || activeLayer === 'middle' || zoomed === sector.core) {
          const [lx, ly] = toXY(midAngle, (coreR + midR) / 2);
          slices.push(
            <Slice 
              key={`mid-${i}-${j}`} 
              cx={cx} cy={cy} r1={coreR} r2={midR} 
              start={mS} end={mE}
              fill={sector.color + (zoomed === sector.core ? 'EE' : 'AA')}
              label={m.name}
              lx={lx} ly={ly} 
              fontSize={size * 0.018}
              opacity={zoomed && zoomed !== sector.core ? 0.3 : 1}
              onClick={() => {
                onSelect({ 
                  name: m.name, 
                  desc: sector.desc, 
                  coping: sector.coping,
                  core: sector.core,
                  coreColor: sector.color,
                  middleName: m.name
                });
                setZoomed(sector.core);
              }}
            />
          );
        }

        // Outer slices - المشاعر الفرعية
        const outPer = midPer / m.outer.length;
        m.outer.forEach((o, k) => {
          const oS = mS + k * outPer;
          const oE = oS + outPer;
          const outAngle = oS + outPer / 2;
          const [lx, ly] = toXY(outAngle, (midR + outerR) / 2);

          if (activeLayer === 'all' || activeLayer === 'outer' || zoomed === sector.core) {
            slices.push(
              <Slice 
                key={`out-${i}-${j}-${k}`} 
                cx={cx} cy={cy} r1={midR} r2={outerR} 
                start={oS} end={oE}
                fill={sector.color + (zoomed === sector.core ? 'DD' : '88')}
                label={o}
                lx={lx} ly={ly} 
                fontSize={size * 0.014}
                opacity={zoomed && zoomed !== sector.core ? 0.3 : 1}
                onClick={() => {
                  onSelect({ 
                    name: o, 
                    desc: sector.desc, 
                    coping: sector.coping,
                    core: sector.core,
                    coreColor: sector.color,
                    middleName: m.name
                  });
                  setZoomed(sector.core);
                }}
              />
            );
          }
        });
      });
    });
    
    return slices;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* طبقات الفلترة */}
      <div className="flex justify-center  space-x-2">
        {emotionLayers.map(layer => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeLayer === layer.id 
                ? `text-white` 
                : 'text-gray-700 bg-gray-100'
            }`}
            style={{
              backgroundColor: activeLayer === layer.id ? layer.color : '',
              border: activeLayer === layer.id ? 'none' : '1px solid #E5E7EB'
            }}
          >
            {layer.label}
          </button>
        ))}
      </div>
      
      {/* العجلة */}
      <div 
        className="relative rounded-full shadow-xl border-8 border-white bg-white transition-all duration-500"
        style={{ 
          width: size * (zoomed ? 1.2 : 1) + 'px', 
          height: size * (zoomed ? 1.2 : 1) + 'px',
          transform: zoomed ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
          {renderSlices()}
        </svg>
        
        {zoomed && (
          <button
            onClick={() => setZoomed(null)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

export default MultiRingWheel;

/* ---------------- Slice Helper ---------------- */
function Slice({ cx, cy, r1, r2, start, end, fill, label, lx, ly, onClick, fontSize = 10, opacity = 1 }) {
  const large = end - start > Math.PI ? 1 : 0;
  
  // حساب نقاط المسار بدقة
  const p = (angle, radius) => {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x},${y}`;
  };

  // إنشاء مسار القطاع
  const pathD = [
    `M ${p(start, r2)}`,
    `A ${r2} ${r2} 0 ${large} 1 ${p(end, r2)}`,
    `L ${p(end, r1)}`,
    `A ${r1} ${r1} 0 ${large} 0 ${p(start, r1)}`,
    'Z',
  ].join(' ');

  return (
    <g className="cursor-pointer transition-opacity" onClick={onClick} style={{ opacity }}>
      <path 
        d={pathD} 
        fill={fill} 
        stroke="#fff" 
        strokeWidth="2" 
        className="transition-all duration-300 hover:stroke-[3px]"
      />
      <text 
        x={lx} 
        y={ly} 
        fontSize={fontSize} 
        fill="#0e1b15"
        fontWeight="600"
        textAnchor="middle" 
        alignmentBaseline="middle"
        className="pointer-events-none select-none"
        style={{
          textShadow: '0 0 4px white, 0 0 4px white',
          letterSpacing: '0.3px',
          fontFamily: "'Noto Sans Arabic', sans-serif",
          opacity: fontSize > 12 ? 1 : 0.9
        }}
      >
        {label}
      </text>
    </g>
  );
}