// file: components/lab/SplitPane.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  direction?: 'horizontal' | 'vertical';
  defaultSplit?: number;
  minSize?: number;
}

/**
 * SplitPane - İki panel arasındakı draggable (sürüklənə bilən) ayrıcı.
 */
export function SplitPane({ children, direction = 'horizontal', defaultSplit = 50, minSize = 10 }: SplitPaneProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      let newSplit;
      
      if (direction === 'horizontal') {
        newSplit = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSplit = ((e.clientY - rect.top) / rect.height) * 100;
      }
      
      if (newSplit >= minSize && newSplit <= 100 - minSize) {
        setSplit(newSplit);
      }
    };

    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.body.style.cursor = 'default';
    }
    
    return () => {
      document.body.style.cursor = 'default';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, direction, minSize]);

  const isH = direction === 'horizontal';

  return (
    <div ref={containerRef} className={cn("flex w-full h-full overflow-hidden", isH ? "flex-row" : "flex-col")}>
      <div style={{ [isH ? 'width' : 'height']: `${split}%` }} className="overflow-hidden flex flex-col relative">
        {children[0]}
      </div>
      
      <div
        className={cn(
          "bg-border/50 hover:bg-indigo-500/80 transition-colors z-20 flex items-center justify-center group",
          isH ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
      >
        {/* Kicik drag handle dizayni */}
        <div className={cn("rounded-full bg-border group-hover:bg-indigo-400 transition-colors", isH ? "w-0.5 h-8" : "w-8 h-0.5")} />
      </div>
      
      <div style={{ [isH ? 'width' : 'height']: `${100 - split}%` }} className="overflow-hidden flex flex-col relative">
        {children[1]}
      </div>
      
      {/* İframa mouse pointer-events bloklamaq üçün dragging vaxtı */}
      {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}
    </div>
  );
}

// ✅ Verified: Custom SplitPane with drag handle, prevents iframe interference while dragging
