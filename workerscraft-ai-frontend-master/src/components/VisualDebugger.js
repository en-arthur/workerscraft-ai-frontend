'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * VisualDebugger component provides interactive overlay for element-specific fix requests
 * 
 * @param {Object} props
 * @param {boolean} props.enabled - Whether the debugger is active
 * @param {Function} props.onFixRequest - Callback when user requests a fix (element, description) => Promise<void>
 */
export default function VisualDebugger({ enabled, onFixRequest }) {
  const [hoveredElement, setHoveredElement] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showFixPrompt, setShowFixPrompt] = useState(false);
  const [fixDescription, setFixDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setHoveredElement(null);
      setSelectedElement(null);
      setShowFixPrompt(false);
      return;
    }

    const handleMouseMove = (e) => {
      if (showFixPrompt) return; // Don't update hover when prompt is open

      // Get element under cursor
      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      // Skip if it's the overlay itself or fix prompt
      if (!element || element === overlayRef.current || overlayRef.current?.contains(element)) {
        setHoveredElement(null);
        return;
      }

      // Capture element information
      const rect = element.getBoundingClientRect();
      const computedStyles = window.getComputedStyle(element);
      
      // Build CSS selector path
      const path = getElementPath(element);
      
      setHoveredElement({
        element,
        rect,
        path,
        tagName: element.tagName.toLowerCase(),
        className: typeof element.className === 'string' ? element.className : (element.className?.baseVal || ''),
        styles: {
          color: computedStyles.color,
          backgroundColor: computedStyles.backgroundColor,
          fontSize: computedStyles.fontSize,
          fontWeight: computedStyles.fontWeight,
          padding: computedStyles.padding,
          margin: computedStyles.margin,
          border: computedStyles.border,
          display: computedStyles.display,
          position: computedStyles.position,
        }
      });
    };

    const handleClick = (e) => {
      if (showFixPrompt) return; // Don't handle clicks when prompt is open
      
      e.preventDefault();
      e.stopPropagation();
      
      if (hoveredElement) {
        setSelectedElement(hoveredElement);
        setShowFixPrompt(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
    };
  }, [enabled, hoveredElement, showFixPrompt]);

  const getElementPath = (element) => {
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break; // ID is unique, stop here
      } else if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).filter(c => c);
        if (classes.length > 0) {
          selector += `.${classes.join('.')}`;
        }
      }
      
      // Add nth-child if needed for specificity
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          child => child.tagName === current.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          selector += `:nth-child(${index})`;
        }
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  };

  const handleFixSubmit = async () => {
    if (!fixDescription.trim() || !selectedElement) return;
    
    setIsSubmitting(true);
    
    try {
      await onFixRequest(
        {
          path: selectedElement.path,
          tag_name: selectedElement.tagName,
          class_name: selectedElement.className,
          styles: selectedElement.styles
        },
        fixDescription
      );
      
      // Close prompt and reset
      setShowFixPrompt(false);
      setFixDescription('');
      setSelectedElement(null);
    } catch (error) {
      console.error('Failed to submit fix request:', error);
      alert('Failed to submit fix request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowFixPrompt(false);
    setFixDescription('');
    setSelectedElement(null);
  };

  if (!enabled) return null;

  return (
    <>
      {/* Transparent overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      >
        {/* Element highlight */}
        {hoveredElement && !showFixPrompt && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 pointer-events-none"
            style={{
              left: `${hoveredElement.rect.left}px`,
              top: `${hoveredElement.rect.top}px`,
              width: `${hoveredElement.rect.width}px`,
              height: `${hoveredElement.rect.height}px`,
            }}
          >
            {/* Element info tooltip */}
            <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {hoveredElement.tagName}
              {hoveredElement.className && typeof hoveredElement.className === 'string' && hoveredElement.className.trim() && `.${hoveredElement.className.split(' ')[0]}`}
            </div>
          </div>
        )}

        {/* Selected element highlight with "Fix This" button */}
        {selectedElement && showFixPrompt && (
          <div
            className="absolute border-2 border-green-500 bg-green-500 bg-opacity-10 pointer-events-none"
            style={{
              left: `${selectedElement.rect.left}px`,
              top: `${selectedElement.rect.top}px`,
              width: `${selectedElement.rect.width}px`,
              height: `${selectedElement.rect.height}px`,
            }}
          />
        )}
      </div>

      {/* Fix prompt modal */}
      {showFixPrompt && selectedElement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Fix This Element</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
              <div className="text-gray-600 mb-1">
                <span className="font-medium">Element:</span> {selectedElement.tagName}
              </div>
              {selectedElement.className && (
                <div className="text-gray-600 mb-1">
                  <span className="font-medium">Classes:</span> {selectedElement.className}
                </div>
              )}
              <div className="text-gray-600 text-xs mt-2 truncate" title={selectedElement.path}>
                <span className="font-medium">Path:</span> {selectedElement.path}
              </div>
            </div>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Describe the fix you want:
            </label>
            <textarea
              value={fixDescription}
              onChange={(e) => setFixDescription(e.target.value)}
              placeholder="E.g., 'Make the text larger and bold' or 'Change background color to blue'"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              autoFocus
              disabled={isSubmitting}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleFixSubmit}
                disabled={!fixDescription.trim() || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Apply Fix'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
