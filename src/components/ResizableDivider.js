'use client';

/**
 * ResizableDivider - Draggable divider between panels
 * 
 * @param {Object} props
 * @param {Function} props.onMouseDown - Mouse down handler to start dragging
 */
export default function ResizableDivider({ onMouseDown }) {
  return (
    <div
      className="
        relative w-1.5 bg-gray-800 cursor-col-resize
        hover:bg-gradient-to-b hover:from-blue-600 hover:to-cyan-600
        transition-all duration-200
        flex items-center justify-center
        group
      "
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
    >
      {/* Grip indicator (3 dots) */}
      <div className="
        absolute inset-y-0 left-1/2 transform -translate-x-1/2
        flex flex-col items-center justify-center gap-1
        opacity-0 group-hover:opacity-100 transition-opacity
      ">
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
      </div>
    </div>
  );
}
