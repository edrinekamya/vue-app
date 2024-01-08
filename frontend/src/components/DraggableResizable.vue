<script setup lang="ts">
import { ref } from 'vue';
const isResizing = ref(false);
const isDragging = ref(false);
let previousX = 0;
let previousY = 0;
let previousWidth = 0;
let previousHeight = 0;

const mouseDown = (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  const rect = element.getBoundingClientRect();
  const edgeSize = 10; // Adjust this value to control the size of the edge area

  // Check if the mouse is near the edges for resizing
  if (
    event.clientX - rect.left < edgeSize || // Left edge
    rect.right - event.clientX < edgeSize || // Right edge
    event.clientY - rect.top < edgeSize || // Top edge
    rect.bottom - event.clientY < edgeSize // Bottom edge
  ) {
    isResizing.value = true;
    previousWidth = event.clientX;
    previousHeight = event.clientY;
  } else {
    isDragging.value = true;
    previousX = event.clientX;
    previousY = event.clientY;
  }
};

const mouseMove = (event: MouseEvent) => {
  event.currentTarget
  const element = document.getElementById('resizable-draggable');
  if (!element) return;

  if (isResizing.value) {
    const dx = event.clientX - previousWidth;
    const dy = event.clientY - previousHeight;
    element.style.width = `${element.offsetWidth + dx}px`;
    element.style.height = `${element.offsetHeight + dy}px`;
    previousWidth = event.clientX;
    previousHeight = event.clientY;
  } else if (isDragging.value) {
    const dx = event.clientX - previousX;
    const dy = event.clientY - previousY;
    element.style.left = `${element.offsetLeft + dx}px`;
    element.style.top = `${element.offsetTop + dy}px`;
    previousX = event.clientX;
    previousY = event.clientY;
  }
};

const mouseUp = () => {
  isResizing.value = false;
  isDragging.value = false;
};

const mouseLeave = () => {
  isResizing.value = false;
  isDragging.value = false;
};

</script>

<template>
  <div id="resizable-draggable" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @mouseleave="mouseLeave">
    <slot></slot>
  </div>
</template>


<style scoped>
#resizable-draggable {
  position: absolute;
  cursor: move;
}
</style>
