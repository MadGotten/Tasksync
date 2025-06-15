import { Ordering } from "@/utils/ordering";

export function useItemDragHandler() {
  const handleItemDragEnd = (activeId: number, overId: number, items: any[], columnId?: number) => {
    let needsReordering = false;

    const itemsArray = items
      .filter((item) => item.column_id === columnId && { ...item })
      .sort((a, b) => a.position - b.position);

    const activeIndex = itemsArray.findIndex((col) => col.id === activeId);
    const overIndex = itemsArray.findIndex((col) => col.id === overId);

    if (activeIndex === -1 || overIndex === -1)
      return { updatedItems: items, itemToUpdate: null, needsReordering };

    if (activeIndex < overIndex) {
      needsReordering = handleDragRight(activeIndex, overIndex, itemsArray);
    } else if (activeIndex > overIndex) {
      needsReordering = handleDragLeft(activeIndex, overIndex, itemsArray);
    }

    // Return the sorted tasks and the task that needs to be updated on the server
    const updatedItems = [...itemsArray].sort((a, b) => a.position - b.position);

    const itemToUpdate = itemsArray[activeIndex];

    return { updatedItems, itemToUpdate, needsReordering };
  };

  const handleDragRight = (activeIndex: number, overIndex: number, itemsArray: any[]) => {
    let reorder = false;
    // Moving rightwards: dragged item comes from left of the target.

    if (overIndex >= itemsArray.length - 1) {
      // If the items is dropped on the end add constant base value
      itemsArray[activeIndex].position = Ordering.positionAfter(itemsArray[overIndex].position);
    } else {
      const hasGap = Ordering.isValidPosition(
        Ordering.comparePositions(
          itemsArray[overIndex + 1].position,
          itemsArray[overIndex].position
        )
      );

      if (!hasGap) {
        // No gap available, reorder all items
        reorderAll(itemsArray);
        reorder = true;
      }

      // Set position between the two items
      itemsArray[activeIndex].position = Ordering.positionBetween(
        itemsArray[overIndex].position,
        itemsArray[overIndex + 1].position
      );
    }
    return reorder;
  };

  const handleDragLeft = (activeIndex: number, overIndex: number, itemsArray: any[]) => {
    let reorder = false;
    // Moving leftwards: dragged item comes from right of the target.

    if (overIndex <= 0) {
      // If the items is dropped on the start add divided by 2 position of dropped over item
      const overItem = itemsArray[overIndex].position;
      itemsArray[activeIndex].position = Ordering.positionBefore(itemsArray[overIndex].position);

      // If the item dropped over has position smaller than 1 reorder all items and set base value
      if (!Ordering.isValidPosition(overItem)) {
        reorderAll(itemsArray);
        reorder = true;
      }
    } else {
      const hasGap = Ordering.isValidPosition(
        Ordering.comparePositions(
          itemsArray[overIndex].position,
          itemsArray[overIndex - 1].position
        )
      );

      if (!hasGap) {
        // if there is no gap for item to be dropped reorder all items
        reorderAll(itemsArray);
        reorder = true;
        // Set the position of dropped item to be between the two items
        itemsArray[activeIndex].position = Ordering.positionBetween(
          itemsArray[overIndex].position,
          itemsArray[overIndex - 1].position
        );
      } else {
        // Set the position of dropped item to be between the two items

        itemsArray[activeIndex].position = Ordering.positionBetween(
          itemsArray[overIndex].position,
          itemsArray[overIndex - 1].position
        );
      }
    }
    return reorder;
  };

  const reorderAll = (itemsArray: any[]) => {
    itemsArray.forEach((col, index) => {
      if (index === 0) col.position = Ordering.BASE;
      else col.position = Ordering.BASE * (index + 1);
    });
  };

  return { handleItemDragEnd };
}
