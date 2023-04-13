<template>
    <main>
        <div class="flex justify-between items-center">
            <h1 class="text-5xl font-bold underline">Emma's Math Extravaganza</h1>

            <div class="flex items-center" v-if="[Stages.PROBLEM, Stages.SOLUTION].includes(stage)">
                <div class="text-3xl">Round {{ round }}</div>
                <CountDown :total-seconds="roundDuration" @timer-finished="finishRound" />
            </div>
        </div>
        <div v-if="stage === Stages.PROBLEM">
            <div class="mx-10 my-20 flex justify-between p-5 items-center">
                <span v-for="(bit, i) in expression" class="px-2 text-3xl" :key="i">
                    {{ bit }}
                </span>
                <span class="px-2 text-3xl"> = </span>

                <input
                    type="text"
                    size="4"
                    class="border-zinc-600 rounded-lg border p-1.5"
                    v-model="myAnswer"
                />

                <button @click="checkAnswer" class="btn">Check!</button>
            </div>
        </div>

        <div v-if="stage === Stages.SOLUTION">
            <div v-if="checkMath()" class="mx-10 my-20 flex items-center justify-between p-5">
                <div class="text-5xl">Correct!</div>

                <div
                    class="inline-flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-200 bg-green-400"
                >
                    <span class="text-5xl font-medium leading-none text-white">{{ answer }}</span>
                </div>
                <button @click="createProblem" class="btn">Next Problem!</button>
            </div>

            <div v-else class="mx-10 my-20 flex items-center justify-between p-5">
                <div class="text-5xl">Nope!</div>

                <div
                    class="border-red-200 bg-red-400 inline-flex h-24 w-24 items-center justify-center rounded-full border-4"
                >
                    <span class="text-5xl font-medium leading-none text-white">{{ answer }}</span>
                </div>
                <button @click="createProblem" class="btn">Next Problem!</button>
            </div>
        </div>

        <div v-if="[Stages.PROBLEM, Stages.SOLUTION].includes(stage)" class="flex justify-between">
            <div class="text-2xl">
                Incorrect:
                <div
                    class="border-red-200 bg-red-400 inline-flex h-8 w-8 items-center justify-center rounded-full border-4"
                >
                    <span class="text-xl font-medium leading-none text-white">{{
                        score.incorrect
                    }}</span>
                </div>
            </div>
            <div class="text-2xl">
                Correct:
                <div
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border-4 border-green-200 bg-green-400"
                >
                    <span class="text-xl font-medium leading-none text-white">{{
                        score.correct
                    }}</span>
                </div>
            </div>
        </div>

        <div v-if="stage === Stages.ROUND_END" class="flex justify-between items-center mt-10">
            <div class="text-4xl ml-10">
                <div>Round {{ round }} completed!</div>
                <div>You got {{ score.correct }} correct!</div>
                <div>Round points: {{ scoring.getPoints(SUBJECT) }}</div>
                <div>Total points: {{ scoring.getPoints() }}</div>
            </div>
            <button @click="nextRound(null)" class="btn">Next Round!</button>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import CountDown from '@/components/CountDown.vue';
import { useScoreStore } from '@/stores/score';

enum Stages {
    PROBLEM,
    SOLUTION,
    ROUND_END,
}

const myAnswer = ref('');
const round = ref(0);
const roundDuration = 30;

const stage = ref(Stages.PROBLEM);

const nums = ref<number[]>([]);
const ops = ref<string[]>([]);

const SUBJECT = 'math';
const scoring = useScoreStore();

function rndInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const score = computed(() => scoring.getRound(SUBJECT, round.value));
const expression = computed(() => {
    return nums.value
        .reduce(function (arr: (string | number)[], val: number, i: number) {
            arr.push(val);
            arr.push(ops.value[i]);
            return arr;
        }, [])
        .slice(0, -1);
});

const answer = computed((): number => {
    let lastOp: number = 0;
    return expression.value.reduce((t: number, bit) => {
        switch (bit) {
            case '+':
                lastOp = 1;
                break;
            case '-':
                lastOp = -1;
                break;
            default:
                if (lastOp !== 0) {
                    const num: number = typeof bit === 'number' ? bit : parseInt(bit);
                    t = t + lastOp * num;
                    lastOp = 0;
                } else {
                    const num = typeof bit === 'number' ? bit : parseInt(bit);
                    t = num;
                }
        }
        // console.log(bit, t);
        return t;
    }, 0);
});

function nextRound(forceRound: number | null) {
    round.value = forceRound ? forceRound : round.value + 1;
    createProblem();
}

function finishRound() {
    stage.value = Stages.ROUND_END;
}

function createProblem() {
    stage.value = Stages.PROBLEM;
    const numCount = rndInt(2, 4);
    nums.value = Array.from({ length: numCount }, () => rndInt(0, 21));
    ops.value = Array.from({ length: numCount - 1 }, () => (rndInt(0, 2) === 0 ? '-' : '+'));
    myAnswer.value = '';
    console.log({ expression, answer: answer.value });
}

function checkMath(): boolean {
    return parseInt(myAnswer.value) === answer.value;
}
function checkAnswer() {
    stage.value = Stages.SOLUTION;
    scoring.increment(SUBJECT, round.value, checkMath());
}

onMounted(() => {
    nextRound(scoring.getCurrentRound(SUBJECT));
});
</script>

<style>
.btn {
    @apply border-zinc-600 bg-zinc-300 rounded-md border py-0.5 px-1 text-xl hover:bg-green-300;
}
</style>
