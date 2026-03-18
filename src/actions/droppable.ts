export function droppable(node: HTMLElement, slotType: /* item.s */ number): { destroy(): void } {
  function onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function onDragEnter(e: DragEvent): void {
    if (e.target.classList.contains('icon')) {
      e.target.parentElement.classList.add('over');
    }
  }

  function onDragLeave(e: DragEvent): void {
    if (e.target.classList.contains('icon')) {
      e.target.parentElement.classList.remove('over');
    }
  }

  function onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    const id = e.dataTransfer.getData('text/plain');

    node.dispatchEvent(
      new CustomEvent('item-dropped', {
        detail: { id, slotType }
      })
    );

    if (e.target.classList.contains('icon')) {
      e.target.parentElement.classList.remove('over');
    }
  }

  node.addEventListener('dragover', onDragOver);
  node.addEventListener('dragenter', onDragEnter);
  node.addEventListener('dragleave', onDragLeave);
  node.addEventListener('drop', onDrop);

  return {
    destroy() {
      node.removeEventListener('dragover', onDragOver);
      node.removeEventListener('dragenter', onDragEnter);
      node.removeEventListener('dragleave', onDragLeave);
      node.removeEventListener('drop', onDrop);
    }
  };
}
