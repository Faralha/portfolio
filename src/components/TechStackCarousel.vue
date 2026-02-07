<script setup lang="ts">
import { Motion } from 'motion-v'
import { onMounted, onUnmounted, ref } from 'vue'

interface TechStack {
  name: string
  icon: string
  color?: string
}

interface Props {
  items?: TechStack[]
  speed?: number // pixels per second
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  gap: 48,
  items: () => [
    { name: 'Vue.js', icon: 'i-simple-icons-vuedotjs', color: '#42b883' },
    { name: 'React', icon: 'i-simple-icons-react', color: '#61dafb' },
    { name: 'Astro', icon: 'i-simple-icons-astro', color: '#ff5d01' },
    { name: 'TypeScript', icon: 'i-simple-icons-typescript', color: '#3178c6' },
    { name: 'NestJS', icon: 'i-simple-icons-nestjs', color: '#e0234e' },
    { name: 'Node.js', icon: 'i-simple-icons-nodedotjs', color: '#339933' },
    { name: 'PostgreSQL', icon: 'i-simple-icons-postgresql', color: '#4169e1' },
    { name: 'MongoDB', icon: 'i-simple-icons-mongodb', color: '#47a248' },
    { name: 'Redis', icon: 'i-simple-icons-redis', color: '#dc382d' },
    { name: 'Docker', icon: 'i-simple-icons-docker', color: '#2496ed' },
    { name: 'Git', icon: 'i-simple-icons-git', color: '#f05032' },
    { name: 'GitHub', icon: 'i-simple-icons-github' },
    { name: 'Tailwind CSS', icon: 'i-simple-icons-tailwindcss', color: '#06b6d4' },
    { name: 'Nginx', icon: 'i-simple-icons-nginx', color: '#009639' },
  ],
})

// --- State ---
const translateX = ref(0)
const isPaused = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)
let animationFrame: number | null = null
let lastTime = 0

// Duplicate items for seamless loop
const duplicatedItems = [...props.items, ...props.items]

// --- Animation ---
function animate(currentTime: number) {
  if (!containerRef.value || isPaused.value) {
    lastTime = currentTime
    animationFrame = requestAnimationFrame(animate)
    return
  }

  const deltaTime = currentTime - lastTime
  lastTime = currentTime

  // Move to the left
  translateX.value -= (props.speed * deltaTime) / 1000

  // Calculate single set width (all items + gaps)
  const itemWidth = 120 // Approximate width per item
  const singleSetWidth = (itemWidth + props.gap) * props.items.length

  // Reset when first set is completely off-screen
  if (Math.abs(translateX.value) >= singleSetWidth) {
    translateX.value = 0
  }

  animationFrame = requestAnimationFrame(animate)
}

function handleMouseEnter() {
  isPaused.value = true
}

function handleMouseLeave() {
  isPaused.value = false
}

// --- Lifecycle ---
onMounted(() => {
  lastTime = performance.now()
  animationFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-full overflow-hidden py-8 cursor-pointer"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <Motion
      :animate="{ x: translateX }"
      :transition="{ type: 'tween', ease: 'linear', duration: 0 }"
      class="flex items-center"
      :style="{ gap: `${gap}px` }"
    >
      <div
        v-for="(item, idx) in duplicatedItems"
        :key="idx"
        class="flex flex-col items-center justify-center shrink-0 w-30 group"
      >
        <div
          class="text-5xl mb-2 transition-transform group-hover:scale-110"
          :class="item.icon"
          :style="{ color: item.color || 'currentColor' }"
        />
        <span class="text-sm text-center op-70 group-hover:op-100 transition-opacity whitespace-nowrap">
          {{ item.name }}
        </span>
      </div>
    </Motion>
  </div>
</template>
