// 명예의 전당: 어른까지 다 자란 펫을 기록으로 남깁니다.
import { STAGES, getStage } from './pet.js';
import { bestSpeed } from './records.js';

const DAY = 86_400_000;
export const FINAL_STAGE = STAGES[STAGES.length - 1].key; // 'adult'

// 진화가 다 끝났는지 (마지막 단계에 도착했는지)
export function isFullyGrown(pet) {
  return getStage(pet.xp).key === FINAL_STAGE;
}

// 명예의 전당에 올릴 기록 만들기: 이 펫을 키우는 동안 남긴 타자 기록으로 통계를 냅니다.
export function makeHallEntry(pet, records, now = new Date()) {
  const started = new Date(pet.createdAt).getTime();
  const during = records.filter((r) => new Date(r.date).getTime() >= started);
  return {
    name: pet.name,
    species: pet.species,
    xp: pet.xp,
    startedAt: pet.createdAt,
    completedAt: now.toISOString(),
    recordCount: during.length,
    bestSpeed: bestSpeed(during),
  };
}

export function daysTaken(entry) {
  return Math.max(1, Math.ceil((new Date(entry.completedAt) - new Date(entry.startedAt)) / DAY));
}
