<template>
    <main>
        <h1 class="text-5xl font-bold underline">Emma's Math Extravaganza</h1>
        <div v-if="!checked">
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

                <button
                    @click="checkAnswer"
                    class="border-zinc-600 bg-zinc-300 rounded-md border p-1 text-xl"
                >
                    Check!
                </button>
            </div>
        </div>

        <div v-else>
            <div v-if="checkMath()" class="mx-10 my-20 flex items-center justify-between p-5">
                <div class="text-5xl">Correct!</div>

                <div
                    class="inline-flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-200 bg-green-400"
                >
                    <span class="text-5xl font-medium leading-none text-white">{{ answer }}</span>
                </div>
                <button
                    @click="createProblem"
                    class="border-zinc-600 bg-zinc-300 rounded-md border p-0.5 text-xl"
                >
                    Next Problem!
                </button>
            </div>

            <div v-else class="mx-10 my-20 flex items-center justify-between p-5">
                <div class="text-5xl">Nope!</div>

                <div
                    class="border-red-200 bg-red-400 inline-flex h-24 w-24 items-center justify-center rounded-full border-4"
                >
                    <span class="text-5xl font-medium leading-none text-white">{{ answer }}</span>
                </div>
                <button
                    @click="createProblem"
                    class="border-zinc-600 bg-zinc-300 rounded-md border p-0.5 text-xl"
                >
                    Next Problem!
                </button>
            </div>
        </div>

        <div class="flex justify-between">
            <div class="text-2xl">
                Incorrect:
                <div
                    class="border-red-200 bg-red-400 inline-flex h-8 w-8 items-center justify-center rounded-full border-4"
                >
                    <span class="text-xl font-medium leading-none text-white">{{
                        totalWrong
                    }}</span>
                </div>
            </div>
            <div class="text-2xl">
                Correct:
                <div
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border-4 border-green-200 bg-green-400"
                >
                    <span class="text-xl font-medium leading-none text-white">{{
                        totalCorrect
                    }}</span>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

function rndInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const myAnswer = ref('');
const checked = ref(false);

const totalCorrect = ref<number>(0);
const totalWrong = ref<number>(0);
const nums = ref<number[]>([]);
const ops = ref<string[]>([]);

const expression = computed(() => {
    return nums.value
        .reduce(function (arr: (string | number)[], val: number, i: number) {
            arr.push(val);
            arr.push(ops.value[i]);
            return arr;
        }, [])
        .slice(0, -1);
});

const answer = computed(() => {
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

function createProblem() {
    const numCount = rndInt(2, 5);
    nums.value = Array.from({ length: numCount }, () => rndInt(0, 21));
    ops.value = Array.from({ length: numCount - 1 }, () => (rndInt(0, 2) === 0 ? '-' : '+'));

    myAnswer.value = '';
    checked.value = false;

    console.log({ expression, answer: answer.value });
}

function checkMath() {
    return parseInt(myAnswer.value) === answer.value;
}
function checkAnswer() {
    checked.value = true;
    if (checkMath()) {
        totalCorrect.value += 1;
    } else {
        totalWrong.value += 1;
    }
}

onMounted(async () => {
    createProblem();
    // await $store.dispatch('agent/getQlpPreferences');
    // if (activeDomains.value) {
    // 	choices.value = cloneDeep(activeDomains.value);
    // }
    // saving.value = false;
});
</script>

<style></style>
