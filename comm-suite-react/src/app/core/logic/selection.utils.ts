import { useCallback, useState } from 'react'

export function useSelectionSet() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set())
    setSelectAll(false)
  }, [])

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (selectAll) {
        next.clear()
        setSelectAll(false)
        return next
      }

      ids.forEach((id) => next.add(id))
      setSelectAll(true)
      return next
    })
  }, [selectAll])

  const toggleItem = useCallback((id: string, allIds: string[]) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      setSelectAll(next.size > 0 && next.size === allIds.length)
      return next
    })
  }, [])

  return {
    selectedItems,
    selectAll,
    setSelectedItems,
    setSelectAll,
    clearSelection,
    toggleSelectAll,
    toggleItem,
  }
}
