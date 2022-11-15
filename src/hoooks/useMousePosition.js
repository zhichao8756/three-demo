import { ref, onMounted, onUnmounted } from 'vue'
export function useMousePosition () {
  const x = ref(0)
  const y = ref(0)
  function update (e) {
    x.value = e.clientX / window.innerWidth - 0.5
    y.value = e.clientY / window.innerWidth - 0.5
  }
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  return { x, y }
}
