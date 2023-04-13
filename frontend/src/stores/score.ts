import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';

export interface RoundScore {
    correct: number;
    incorrect: number;
    points?: number;
}

interface Scores {
    [subject: string]: {
        [round: number]: RoundScore;
    };
}

export const useScoreStore = defineStore('score', () => {
    const scores = reactive(<Scores>{});

    // initialize the round scores if none yet recorded
    function roundInit(subject: string, round: number) {
        if (!scores[subject]) {
            scores[subject] = { [round]: { correct: 0, incorrect: 0 } };
        }
        if (!scores[subject][round]) {
            scores[subject][round] = { correct: 0, incorrect: 0 };
        }
    }

    function increment(subject: string, round: number, correct: boolean) {
        roundInit(subject, round);
        const _correct: number = correct ? 1 : 0;
        const _incorrect: number = correct ? 0 : 1;
        scores[subject][round].correct += _correct;
        scores[subject][round].incorrect += _incorrect;
    }

    function calcPoints(round: number, correct: number) {
        return round * correct;
    }

    function getRound(subject: string, round: number): RoundScore {
        const rScore = scores?.[subject]?.[round] || { correct: 0, incorrect: 0 };
        return { ...rScore, points: calcPoints(round, rScore.correct || 0) };
    }

    function getCurrentRound(subject: string): number {
        return Math.max(Object.keys(scores?.[subject] || { 0: null }).map(parseInt));
    }

    function getPoints(subject?: string, round?: number) {
        return Object.entries(scores).reduce((acc: number, [subj, rounds]) => {
            // console.log({ subject, subj, rounds });
            if (!subject || subject === subj) {
                acc += Object.entries(rounds).reduce((a2, [r, { correct }]) => {
                    const rInt = parseInt(r);
                    console.log(rInt, correct);
                    if (!round || round === rInt) {
                        a2 += calcPoints(rInt, correct);
                    }
                    return a2;
                }, 0);
            }
            return acc;
        }, 0);
    }

    return { increment, scores, getRound, getCurrentRound, getPoints, roundInit };
});
