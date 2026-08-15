import { supabase, publicUrl } from "@/lib/supabase";
import { defaultWorld, type Person, type PersonSlug } from "@/lib/world";

export type UserRow = {
  id: string;
  name: string;
  username: PersonSlug;
  profile_photo: string | null;
  last_opened_at: string | null;
  is_online: boolean;
};

type ProfileRow = {
  user_id: string;
  status: string | null;
  current_thought: string | null;
  mood: string | null;
  breakfast: string | null;
  lunch: string | null;
  snack: string | null;
  dinner: string | null;
  current_location: string | null;
  location_enabled: boolean;
  music: string | null;
  updated_at: string | null;
};

type SnapRow = {
  id: string;
  sender_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};

type MessageRow = {
  id: string;
  message: string;
  created_at: string;
};

type MissYouRow = {
  id: string;
  created_at: string;
};

type MoodRow = {
  id: string;
  mood: string;
  note: string | null;
  created_at: string;
};

type DiaryRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string;
};

type PhotoRow = {
  id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};

type SurpriseRow = {
  id: string;
  title: string;
  message: string | null;
  unlock_at: string | null;
  opened_at: string | null;
};

type ActivityRow = {
  id: string;
  activity_type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const MOOD_ICON: Record<string, string> = {
  "In love": "mood-inlove",
  Great: "mood-great",
  Okay: "mood-okay",
  Meh: "mood-meh",
  Low: "mood-low",
  Tired: "mood-tired",
};

const ACTIVITY_ICON: Record<string, string> = {
  mood: "mood-okay",
  meal: "coffee",
  miss_you: "heart",
  snap: "camera",
  message: "mail",
  location: "pin",
  diary: "note",
  update: "pencil",
};

const ACTIVITY_LABEL: Record<string, string> = {
  mood: "Updated mood",
  meal: "Updated meals",
  miss_you: "Missed you",
  snap: "Sent a snap",
  message: "Left you a message",
  location: "Updated location",
  diary: "Wrote in their diary",
  update: "Updated their info",
};

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    month: "long",
    day: "numeric",
  });
}

export function formatDay(iso: string): string {
  const d = new Date(iso);
  const isToday = today() === iso.slice(0, 10);
  if (isToday) return "Today";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

const userCache = new Map<PersonSlug, UserRow>();

async function usersByUsername(): Promise<Map<string, UserRow>> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  const map = new Map<string, UserRow>();
  for (const u of (data ?? []) as UserRow[]) map.set(u.username, u);
  return map;
}

export async function ensureUser(slug: PersonSlug): Promise<UserRow> {
  const cached = userCache.get(slug);
  if (cached) return cached;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`No user row for "${slug}"`);
  const row = data as UserRow;
  userCache.set(slug, row);
  return row;
}

async function loadPerson(user: UserRow): Promise<Partial<Person>> {
  const [
    { data: profileData },
    { data: moodRows },
    { data: snaps },
    { data: messages },
    { data: missRows },
    { data: diaryRows },
    { data: photoRows },
    { data: surpriseRows },
    { data: activityRows },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("mood_updates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("snaps")
      .select("*")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("messages")
      .select("*")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("miss_you")
      .select("*")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("visibility", "shared")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("photos")
      .select("*")
      .eq("uploaded_by", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("surprises")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("activity_log")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const profile = profileData as ProfileRow | null;
  const out: Partial<Person> = {};

  if (user.last_opened_at) out.activeAgo = timeAgo(user.last_opened_at);
  if (profile?.status) out.status = profile.status;
  if (profile?.current_thought) out.thought = profile.current_thought;

  if (profile?.music) {
    const defaultMusic = defaultWorld[user.username].music;
    out.music = { ...defaultMusic, song: profile.music };
  }

  if (profile?.current_location) {
    const defaultLocation = defaultWorld[user.username].location;
    out.location = {
      ...defaultLocation,
      place: profile.current_location,
      sharing: profile.location_enabled,
      updated: profile.updated_at ? timeAgo(profile.updated_at) : "just now",
    };
  }

  const latestMood = (moodRows as MoodRow[] | null)?.[0];
  if (latestMood?.mood) {
    const defaultMood = defaultWorld[user.username].mood;
    out.mood = {
      icon: MOOD_ICON[latestMood.mood] ?? defaultMood.icon,
      label: latestMood.mood,
      note: latestMood.note ?? defaultMood.note,
      updated: timeAgo(latestMood.created_at),
    };
  }

  const breakfast = profile?.breakfast;
  const lunch = profile?.lunch;
  const dinner = profile?.dinner;
  if (breakfast || lunch || dinner) {
    const defaultMeals = defaultWorld[user.username].meals;
    out.meals = defaultMeals.map((m) => {
      if (m.key === "breakfast" && breakfast) return { ...m, item: breakfast };
      if (m.key === "lunch" && lunch) return { ...m, item: lunch };
      if (m.key === "dinner" && dinner) return { ...m, item: dinner };
      return m;
    });
  }

  const latestSnap = (snaps as SnapRow[] | null)?.[0];
  if (latestSnap) {
    out.snap = {
      caption: latestSnap.caption ?? "",
      time: formatTime(latestSnap.created_at),
      image: publicUrl("snaps", latestSnap.storage_path),
    };
  }

  const messageRows = (messages as MessageRow[] | null) ?? [];
  if (messageRows.length > 0) {
    out.messages = messageRows.map((m) => ({
      text: m.message,
      time: formatTime(m.created_at),
    }));
  }

  const missRowsToday = (missRows as MissYouRow[] | null) ?? [];
  const missCountToday = missRowsToday.filter((m) => m.created_at.slice(0, 10) === today()).length;
  const lastMiss = missRowsToday[0];
  if (missCountToday > 0 && lastMiss) {
    const defaultMiss = defaultWorld[user.username].missYou;
    out.missYou = {
      count: missCountToday,
      last: formatTime(lastMiss.created_at),
      note: defaultMiss.note,
    };
  }

  const latestDiary = (diaryRows as DiaryRow[] | null)?.[0];
  if (latestDiary?.content) {
    out.diary = {
      date: formatDate(latestDiary.created_at),
      text: latestDiary.content,
      time: formatTime(latestDiary.created_at),
    };
  }

  const photoRowsAll = (photoRows as PhotoRow[] | null) ?? [];
  if (photoRowsAll.length > 0) {
    const items = photoRowsAll.map((ph) => ({
      src: publicUrl("photos", ph.storage_path),
      caption: ph.caption ?? "",
    }));
    out.photos = [
      {
        day: formatDay(photoRowsAll[0]?.created_at ?? ""),
        items,
      },
    ];
  }

  const surpriseRowsAll = (surpriseRows as SurpriseRow[] | null) ?? [];
  if (surpriseRowsAll.length > 0) {
    out.surprises = surpriseRowsAll.map((s) => ({
      title: s.title,
      sub: s.opened_at ? "Opened" : "Locked",
      locked: !s.opened_at,
    }));
  }

  const activityRowsAll = (activityRows as ActivityRow[] | null) ?? [];
  if (activityRowsAll.length > 0) {
    out.activity = activityRowsAll.map((a) => ({
      icon: ACTIVITY_ICON[a.activity_type] ?? "heart",
      text: ACTIVITY_LABEL[a.activity_type] ?? a.activity_type,
      ago: timeAgo(a.created_at),
    }));
    out.timeline = activityRowsAll.map((a) => ({
      icon: ACTIVITY_ICON[a.activity_type] ?? "heart",
      time: formatTime(a.created_at),
      title: ACTIVITY_LABEL[a.activity_type] ?? a.activity_type,
    }));
  }

  return out;
}

export async function loadWorld(): Promise<Record<PersonSlug, Partial<Person>>> {
  const byUsername = await usersByUsername();
  const parts: [PersonSlug, Partial<Person>][] = await Promise.all(
    ["krishna", "varshini"].map(async (slug) => {
      const user = byUsername.get(slug);
      return [slug as PersonSlug, user ? await loadPerson(user) : {}];
    }),
  );
  return Object.fromEntries(parts) as Record<PersonSlug, Partial<Person>>;
}

export async function persistPerson(slug: PersonSlug, patch: Partial<Person>): Promise<void> {
  const user = await ensureUser(slug);
  const profile: Record<string, unknown> = {};
  const changed: string[] = [];

  if (patch.status !== undefined) {
    profile["status"] = patch.status;
    changed.push("status");
  }
  if (patch.thought !== undefined) {
    profile["current_thought"] = patch.thought;
    changed.push("thought");
  }
  if (patch.music?.song) {
    profile["music"] = patch.music.song;
    changed.push("music");
  }
  if (patch.location) {
    profile["current_location"] = patch.location.place;
    profile["location_enabled"] = patch.location.sharing;
    changed.push("location");
  }
  if (patch.mood?.label) {
    profile["mood"] = patch.mood.label;
    changed.push("mood");
  }
  if (patch.meals) {
    const byKey = new Map(patch.meals.map((m) => [m.key, m.item]));
    const put = (key: string) => {
      const v = byKey.get(key);
      if (v) profile[key] = v;
    };
    put("breakfast");
    put("lunch");
    put("snack");
    put("dinner");
  }

  if (Object.keys(profile).length > 0) {
    const { error } = await supabase.from("user_profiles").update(profile).eq("user_id", user.id);
    if (error) throw error;
  }

  if (patch.mood?.label) {
    const { error } = await supabase.from("mood_updates").insert({
      user_id: user.id,
      mood: patch.mood.label,
      note: patch.mood.note || null,
    });
    if (error) throw error;
  }

  if (patch.location?.place) {
    const { error } = await supabase.from("location_updates").insert({
      user_id: user.id,
      location_name: `${patch.location.place}${
        patch.location.city ? `, ${patch.location.city}` : ""
      }`,
    });
    if (error) throw error;
  }

  const daily: Record<string, unknown> = {};
  if (patch.meals) {
    const byKey = new Map(patch.meals.map((m) => [m.key, m.item]));
    const put = (key: string) => {
      const v = byKey.get(key);
      if (v) daily[key] = v;
    };
    put("breakfast");
    put("lunch");
    put("snack");
    put("dinner");
  }
  if (patch.thought) daily["thought"] = patch.thought;
  if (Object.keys(daily).length > 0) {
    const { error } = await supabase
      .from("daily_updates")
      .upsert({ user_id: user.id, date: today(), ...daily }, { onConflict: "user_id,date" });
    if (error) throw error;
  }

  await logActivity(user.id, "update", { fields: changed });
}

export async function sendMissYou(fromSlug: PersonSlug, toSlug: PersonSlug): Promise<void> {
  const sender = await ensureUser(fromSlug);
  const receiver = await ensureUser(toSlug);
  const { error } = await supabase.from("miss_you").insert({
    sender_id: sender.id,
    receiver_id: receiver.id,
  });
  if (error) throw error;
  await logActivity(sender.id, "miss_you", { to: receiver.id });
}

export async function sendMessage(
  fromSlug: PersonSlug,
  toSlug: PersonSlug,
  text: string,
): Promise<void> {
  const sender = await ensureUser(fromSlug);
  const receiver = await ensureUser(toSlug);
  const { error } = await supabase.from("messages").insert({
    sender_id: sender.id,
    receiver_id: receiver.id,
    message: text,
    message_type: "normal",
  });
  if (error) throw error;
  await logActivity(sender.id, "message", { to: receiver.id });
}

export async function sendSnap(
  fromSlug: PersonSlug,
  toSlug: PersonSlug,
  blob: Blob,
  caption?: string,
): Promise<string> {
  const sender = await ensureUser(fromSlug);
  const receiver = await ensureUser(toSlug);
  const path = `snaps/${sender.username}/${crypto.randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("snaps")
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (uploadError) throw uploadError;
  const { error: insertError } = await supabase.from("snaps").insert({
    sender_id: sender.id,
    receiver_id: receiver.id,
    storage_path: path,
    caption: caption ?? null,
  });
  if (insertError) throw insertError;
  await logActivity(sender.id, "snap", { to: receiver.id });
  return path;
}

export async function mySnaps(slug: PersonSlug): Promise<SnapRow[]> {
  const user = await ensureUser(slug);
  const { data, error } = await supabase
    .from("snaps")
    .select("*")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return (data as SnapRow[]) ?? [];
}

export async function markPhoneOpen(slug: PersonSlug): Promise<void> {
  const user = await ensureUser(slug);
  await supabase
    .from("users")
    .update({ last_opened_at: new Date().toISOString(), is_online: true })
    .eq("id", user.id);
}

export async function logActivity(
  userId: string,
  type: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from("activity_log").insert({
    user_id: userId,
    activity_type: type,
    metadata: metadata ?? null,
  });
  if (error) throw error;
}
