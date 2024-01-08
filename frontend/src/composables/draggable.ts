import { useDraggable, useElementSize, useWindowSize } from '@vueuse/core'
import { ref, onUnmounted, onMounted, watchEffect, computed } from 'vue'

export function useRestrictedDraggable(options?: {
  top?: number
  bottom?: number
  left?: number
  right?: number
}) {
  const element = ref<HTMLElement | null>(null)
  const { width, height } = useWindowSize()
  const { width: w, height: h } = useElementSize(element)
  const { x, y, style } = useDraggable(element)
  const minX = options?.left ?? options?.right ?? 0
  const minY = options?.top ?? options?.bottom ?? 0
  const maxX = computed(() => width.value - w.value - minX)
  const maxY = computed(() => height.value - h.value - minY)
  
  onMounted(() => {
    x.value = options?.left ?? (options?.right ? maxX.value : minX)
    y.value = options?.top ?? (options?.bottom ? maxY.value : minY)
  })

  watchEffect(() => {
    x.value = Math.max(Math.min(x.value, maxX.value), minX)
    y.value = Math.max(Math.min(y.value, maxY.value), minY)
  })

  return {
    element,
    style
  }
}
