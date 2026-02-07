<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  folder: string // e.g., "/projects/hcq-lms"
  images: string[] // Array of image filenames
  autoplay?: boolean
  autoplayInterval?: number
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  autoplayInterval: 5000,
  height: '500px',
})

// --- State ---
const index = ref(0)
const isPaused = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)
let autoplayTimer: NodeJS.Timeout | null = null

// --- Computed ---
const imageUrls = computed(() => {
  return props.images.map(img => `${props.folder}/${img}`)
})

const translateX = computed(() => {
  if (!containerRef.value)
    return 0
  const slideWidth = containerRef.value.offsetWidth
  return -index.value * slideWidth
})

const hasMultipleSlides = computed(() => imageUrls.value.length > 1)

// --- Methods ---
function nextSlide() {
  if (imageUrls.value.length === 0)
    return
  index.value = (index.value + 1) % imageUrls.value.length
}

function prevSlide() {
  if (imageUrls.value.length === 0)
    return
  if (index.value === 0) {
    index.value = imageUrls.value.length - 1
  }
  else {
    index.value = index.value - 1
  }
}

function goToSlide(slideIndex: number) {
  index.value = slideIndex
}

// --- Autoplay ---
function startAutoplay() {
  if (!props.autoplay || !hasMultipleSlides.value)
    return
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    if (!isPaused.value) {
      nextSlide()
    }
  }, props.autoplayInterval)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function handleMouseEnter() {
  isPaused.value = true
}

function handleMouseLeave() {
  isPaused.value = false
}

// --- Lifecycle ---
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

// Restart autoplay when autoplay prop changes
watch(() => props.autoplay, (newVal) => {
  if (newVal) {
    startAutoplay()
  }
  else {
    stopAutoplay()
  }
})
</script>

<template>
  <div class="w-full my-8">
    <div
      v-if="imageUrls.length > 0"
      ref="containerRef"
      class="relative overflow-hidden rounded-lg"
      :style="{ height }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Slides Container -->
      <Motion
        :animate="{ x: translateX }"
        :transition="{ type: 'spring', stiffness: 300, damping: 30 }"
        class="flex h-full"
      >
        <div
          v-for="(imageUrl, idx) in imageUrls"
          :key="idx"
          class="shrink-0 w-full h-full flex items-center justify-center"
        >
          <img
            :src="imageUrl"
            :alt="`Slide ${idx + 1}`"
            class="w-full h-auto max-h-full object-contain select-none"
            draggable="false"
          >
        </div>
      </Motion>

      <!-- Navigation Buttons -->
      <template v-if="hasMultipleSlides">
        <!-- Previous Button -->
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 hover:scale-110"
          aria-label="Previous slide"
          @click="prevSlide"
        >
          <div class="i-carbon-chevron-left text-2xl text-gray-800 dark:text-gray-200" />
        </button>

        <!-- Next Button -->
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 hover:scale-110"
          aria-label="Next slide"
          @click="nextSlide"
        >
          <div class="i-carbon-chevron-right text-2xl text-gray-800 dark:text-gray-200" />
        </button>
      </template>

      <!-- Indicators -->
      <div
        v-if="hasMultipleSlides"
        class="absolute !mt-4 bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
      >
        <button
          v-for="(_, idx) in imageUrls"
          :key="idx"
          class="w-2 h-2 rounded-full transition-all"
          :class="
            index === idx
              ? 'dark:bg-white bg-gray-800 w-8'
              : 'dark:bg-white/50 dark:hover:bg-white/75 bg-gray-800/50 hover:bg-gray-800/75'
          "
          :aria-label="`Go to slide ${idx + 1}`"
          @click="goToSlide(idx)"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="w-full rounded-lg flex items-center justify-center"
      :style="{ height }"
    >
      <p class="text-gray-500 dark:text-gray-400">
        No images available
      </p>
    </div>
  </div>
</template>
