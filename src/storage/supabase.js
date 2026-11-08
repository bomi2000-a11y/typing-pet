// 서버 저장소: Supabase에 저장되어 PC와 휴대폰에서 같은 기록을 봅니다.
// 데이터베이스 열 이름(snake_case)과 앱 안의 이름(camelCase)을 서로 변환합니다.

const toRecord = (row) => ({
  id: row.id,
  date: row.created_at,
  type: row.type,
  speed: row.speed,
  accuracy: row.accuracy,
  xpGained: row.xp_gained,
  memo: row.memo || '',
  hidden: Boolean(row.hidden),
  practiceMs: row.practice_ms ?? null,
});

const toPet = (row) =>
  row && {
    name: row.name,
    species: row.species || 'chicken',
    xp: row.xp,
    fullness: row.fullness,
    lastFedAt: row.last_fed_at,
    createdAt: row.created_at,
  };

const toHall = (row) => ({
  id: row.id,
  name: row.name,
  species: row.species,
  xp: row.xp,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  recordCount: row.record_count,
  bestSpeed: row.best_speed,
});

export function createSupabaseAdapter(supabase) {
  // 지금 로그인한 사람의 id (기기에 저장된 로그인 정보에서 바로 읽어요)
  async function userId() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('로그인이 필요해요');
    return session.user.id;
  }

  return {
    // Supabase 는 한 번에 최대 1000행만 돌려주므로 1000개씩 나눠서 모두 불러와요
    async getRecords() {
      const PAGE = 1000;
      const rows = [];
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await supabase
          .from('records')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, from + PAGE - 1);
        if (error) throw error;
        rows.push(...data);
        if (data.length < PAGE) break;
      }
      return rows.map(toRecord);
    },
    async addRecord(r) {
      const { data, error } = await supabase
        .from('records')
        .insert({
          created_at: r.date,
          type: r.type,
          speed: r.speed,
          accuracy: r.accuracy,
          xp_gained: r.xpGained,
          memo: r.memo,
          practice_ms: r.practiceMs ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return toRecord(data);
    },
    async updateRecord(id, f) {
      const patch = {};
      if ('type' in f) patch.type = f.type;
      if ('speed' in f) patch.speed = f.speed;
      if ('accuracy' in f) patch.accuracy = f.accuracy;
      if ('memo' in f) patch.memo = f.memo;
      if ('xpGained' in f) patch.xp_gained = f.xpGained;
      if ('hidden' in f) patch.hidden = f.hidden;
      const { data, error } = await supabase.from('records').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return toRecord(data);
    },
    async getPet() {
      const { data, error } = await supabase.from('pets').select('*').maybeSingle();
      if (error) throw error;
      return toPet(data);
    },
    async savePet(pet) {
      const { error } = await supabase.from('pets').upsert({
        user_id: await userId(),
        name: pet.name,
        species: pet.species,
        xp: pet.xp,
        fullness: pet.fullness,
        last_fed_at: pet.lastFedAt,
        created_at: pet.createdAt,
      });
      if (error) throw error;
      return pet;
    },
    async clearPet() {
      const { error } = await supabase.from('pets').delete().eq('user_id', await userId());
      if (error) throw error;
    },
    async getHallOfFame() {
      const { data, error } = await supabase
        .from('hall_of_fame')
        .select('*')
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data.map(toHall);
    },
    async addToHallOfFame(e) {
      const { data, error } = await supabase
        .from('hall_of_fame')
        .insert({
          name: e.name,
          species: e.species,
          xp: e.xp,
          started_at: e.startedAt,
          completed_at: e.completedAt,
          record_count: e.recordCount,
          best_speed: e.bestSpeed,
        })
        .select()
        .single();
      if (error) throw error;
      return toHall(data);
    },
  };
}
