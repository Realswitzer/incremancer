export function draggable(node: HTMLElement, itemId: number): { destroy(): void } {
  node.draggable = true;

  function onDragStart(e: DragEvent): void {
    document.getElementById('champ-hold')?.classList.toggle('no-tooltip');

    e.dataTransfer.setData('text/plain', itemId as string);

    const rect = node.getBoundingClientRect();
    e.dataTransfer.setDragImage(node, rect.width / 2, rect.height / 2);

    node.dispatchEvent(new CustomEvent('drag-start', { detail: itemId }));

    node.style.opacity = '0.3';
  }

  function onDragEnd(): void {
    document.getElementById('champ-hold')?.classList.toggle('no-tooltip');

    node.style.opacity = '';
    node.dispatchEvent(new CustomEvent('drag-end', { detail: itemId }));
  }

  node.addEventListener('dragstart', onDragStart);
  node.addEventListener('dragend', onDragEnd);

  return {
    destroy() {
      node.removeEventListener('dragstart', onDragStart);
      node.removeEventListener('dragend', onDragEnd);
    }
  };
}
