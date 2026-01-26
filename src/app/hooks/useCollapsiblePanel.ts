import { useState, useCallback } from 'react';

interface UseCollapsiblePanelOptions {
  initialCollapsed?: boolean;
}

interface UseCollapsiblePanelReturn {
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  setIsCollapsed: (value: boolean) => void;
}

/**
 * Hook for managing collapsible panel state.
 * Provides consistent collapse/expand functionality across panels.
 *
 * @param options - Configuration options
 * @returns Object with collapse state and control functions
 */
export function useCollapsiblePanel(
  options: UseCollapsiblePanelOptions = {}
): UseCollapsiblePanelReturn {
  const { initialCollapsed = false } = options;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  return {
    isCollapsed,
    toggle,
    collapse,
    expand,
    setIsCollapsed,
  };
}
