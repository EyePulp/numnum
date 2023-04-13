<template>
    <!-- Circle -->
    <div class="inline-flex items-center justify-center overflow-hidden rounded-full">
        <!-- Building a Progress Ring: https://css-tricks.com/building-progress-ring-quickly/ -->
        <svg class="w-20 h-20">
            <circle
                class="text-gray-300"
                stroke-width="5"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
            />
            <circle
                class="text-blue-600"
                stroke-width="5"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference - (percent / 100) * circumference"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
            />
        </svg>
        <span class="absolute text-xl text-blue-700">{{ remainingSeconds }}s</span>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
const emit = defineEmits(['timerFinished']);
const props = defineProps<{
    totalSeconds: number;
}>();

const remainingSeconds = ref(props.totalSeconds);
const percent = computed(() => Math.round((remainingSeconds.value / props.totalSeconds) * 100));
const circumference = ref(30 * 2 * Math.PI);

let interval: number;
function startCountdown() {
    interval = window.setInterval(() => {
        if (remainingSeconds.value > 0) {
            remainingSeconds.value -= 1;
        } else {
            emit('timerFinished');
            clearInterval(interval);
        }
    }, 1000);
}
onMounted(async () => {
    startCountdown();
});
</script>

<style scoped></style>
