<script setup lang="ts">
interface Project {
  text: string
  description: string
  href: string
  tags?: string[]
}

interface Props {
  projects: Project[]
}

defineProps<Props>()
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <a
      v-for="(project, idx) in projects"
      :key="idx"
      :href="project.href"
      class="block p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors no-underline"
    >
      <div class="flex items-start">
        <div class="flex-1 min-w-0">
          <!-- Title -->
          <h3 class="!m-0 text-lg font-semibold">
            {{ project.text }}
          </h3>

          <!-- Tags -->
          <div
            v-if="project.tags && project.tags.length > 0"
            class="flex flex-wrap gap-2 my-2"
          >
            <span
              v-for="(tag, tagIdx) in project.tags"
              :key="tagIdx"
              class="px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-xs rounded"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Description -->
          <p class="!m-0 text-sm op-70 line-clamp-5">
            {{ project.description }}
          </p>
        </div>
      </div>
    </a>
  </div>
</template>
