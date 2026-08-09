<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'

interface TimeBlock {
  id: string
  period: string
  duration: string
  subject: string
  activity: string
  done: boolean
}

const appTitle = import.meta.env.VITE_APP_TITLE
const storageKey = import.meta.env.VITE_STORAGE_KEY
const resetDelay = Number(import.meta.env.VITE_RESET_DELAY)
const defaultBlocks: TimeBlock[] = JSON.parse(import.meta.env.VITE_TIME_BLOCKS).map((b: TimeBlock) => ({ ...b, done: false }))

const today = ref(new Date().toISOString().slice(0, 10))

function loadBlocks(): TimeBlock[] {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === today.value) {
        return data.blocks as TimeBlock[]
      }
    }
  } catch {}
  return defaultBlocks.map(b => ({ ...b }))
}

const blocks = ref<TimeBlock[]>(loadBlocks())

watch(blocks, (val) => {
  localStorage.setItem(storageKey, JSON.stringify({ date: today.value, blocks: val }))
}, { deep: true })

const doneCount = computed(() => blocks.value.filter(b => b.done).length)
const totalCount = computed(() => blocks.value.length)
const allDone = computed(() => doneCount.value === totalCount.value)
const subjectColors: Record<string, string> = {
  Java: 'text-orange-600',
  前端: 'text-blue-600',
}

function resetToday() {
  blocks.value = defaultBlocks.map(b => ({ ...b }))
  today.value = new Date().toISOString().slice(0, 10)
  localStorage.setItem(storageKey, JSON.stringify({ date: today.value, blocks: blocks.value }))
}

watch(allDone, (val) => {
  if (val) {
    setTimeout(() => {
      resetToday()
    }, resetDelay)
  }
})
</script>

<template>
  <div class="min-h-screen bg-white p-6 flex flex-col items-center gap-4 max-w-lg mx-auto">
    <h1 class="text-lg text-gray-900 mt-6">{{ appTitle }}</h1>
    <p class="text-gray-400 text-xs">{{ today }}</p>

    <div class="w-full border-t border-gray-100 mt-2">
      <div class="flex justify-between items-center py-3">
        <span class="text-xs text-gray-400">今日任务</span>
        <span class="text-xs text-gray-400">
          {{ doneCount }} / {{ totalCount }}
        </span>
      </div>

      <CheckboxRoot
        v-for="block in blocks"
        :key="block.id"
        v-model="block.done"
        class="flex items-center gap-3 py-3 border-b border-gray-50 transition-colors cursor-pointer w-full text-left"
        :class="block.done ? 'line-through text-gray-300' : 'hover:opacity-70'"
      >
        <span
          class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors"
          :class="block.done ? 'bg-gray-800 border-gray-800 text-white' : 'border-gray-300'"
        >
          <CheckboxIndicator>
            <span class="text-xs leading-none">✓</span>
          </CheckboxIndicator>
        </span>
        <div class="flex-1 min-w-0 flex items-baseline gap-2">
          <span class="text-xs text-gray-400 font-mono shrink-0">{{ block.period }} {{ block.duration }}</span>
          <span class="text-xs" :class="subjectColors[block.subject] ?? 'text-gray-600'">{{ block.subject }}</span>
          <p class="text-xs text-gray-400 truncate">{{ block.activity }}</p>
        </div>
      </CheckboxRoot>
    </div>

    <button
      class="text-xs text-gray-300 hover:text-gray-500 transition-colors mt-2"
      @click="resetToday"
    >
      重置今日
    </button>
  </div>
</template>
