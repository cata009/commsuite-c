import { useState, useCallback, useMemo } from 'react';

interface UseSelectionSetOptions<T> {
  items: T[];
  getId: (item: T) => string;
}

interface UseSelectionSetReturn {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  toggleAll: () => void;
  selectAll: () => void;
  clearAll: () => void;
  selectedCount: number;
}

/**
 * Hook for managing multi-select functionality with checkboxes.
 * Provides consistent selection behavior across list panels.
 *
 * @param options - Configuration with items array and getId function
 * @returns Object with selection state and control functions
 */
export function useSelectionSet<T>({
  items,
  getId,
}: UseSelectionSetOptions<T>): UseSelectionSetReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size]
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length) {
        return new Set();
      }
      return new Set(items.map(getId));
    });
  }, [items, getId]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(getId)));
  }, [items, getId]);

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    isAllSelected,
    isSelected,
    toggle,
    toggleAll,
    selectAll,
    clearAll,
    selectedCount: selectedIds.size,
  };
}
