<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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

function toggleBlock(id: string) {
  const block = blocks.value.find(b => b.id === id)
  if (block) {
    block.done = !block.done
  }
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
  <div class="min-h-screen bg-gray-50 p-6 flex flex-col items-center gap-6">
    <h1 class="text-3xl font-bold text-gray-800 mt-4">{{ appTitle }}</h1>
    <p class="text-gray-500 text-sm">{{ today }}</p>

    <div class="w-full max-w-lg bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-700">今日任务</span>
        <span class="text-sm text-gray-400" :class="{ 'text-green-500 font-bold': allDone }">
          {{ doneCount }} / {{ totalCount }}
          <span v-if="allDone"> ✅ 全部完成！</span>
        </span>
      </div>

      <div
        v-for="block in blocks"
        :key="block.id"
        class="flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer"
        :class="block.done ? 'bg-green-50 line-through text-gray-400' : 'bg-gray-50 hover:bg-gray-100'"
        @click="toggleBlock(block.id)"
      >
        <div
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
          :class="block.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'"
        >
          <span v-if="block.done" class="text-xs">✓</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-2">
            <span class="text-xs font-mono text-gray-400">{{ block.period }} {{ block.duration }}</span>
            <span class="font-semibold text-sm" :class="subjectColors[block.subject] ?? 'text-gray-600'">{{ block.subject }}</span>
          </div>
          <p class="text-sm text-gray-600 truncate">{{ block.activity }}</p>
        </div>
      </div>
    </div>

    <button
      class="px-6 py-2 bg-gray-200 rounded-full text-sm text-gray-500 hover:bg-gray-300 transition-colors"
      @click="resetToday"
    >
      重置今日
    </button>
  </div>
</template>
