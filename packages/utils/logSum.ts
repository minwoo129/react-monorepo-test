// packages/utils/logSum.ts
import { sumArray } from "@utils/sumArray";

export function logSum(numbers: number[]): void {
    const result = sumArray(numbers);
    alert(`배열 [${numbers.join(", ")}]의 합은 ${result}입니다.`);
}