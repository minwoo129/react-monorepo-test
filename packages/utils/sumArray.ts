// packages/utils/sumArray.ts
export function sumArray(numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
}