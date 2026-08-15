import { useCallback, useEffect, useState } from "react";
import { loadWorld, persistPerson } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import snapImg from "@/assets/snap.jpg";
import album from "@/assets/album.jpg";

export type PersonSlug = "krishna" | "varshini";

export type Person = {
  slug: PersonSlug;
  name: string;
  pronoun: "his" | "her";
  icon: string;
  status: string;
  activeAgo: string;
  mood: { icon: string; label: string; note: string; updated: string };
  location: { place: string; city: string; updated: string; sharing: boolean };
  thought: string;
  music: { song: string; artist: string; note: string; progress: number };
  meals: { key: string; label: string; icon: string; item: string; time: string }[];
  sleep: { asleep: string; awake: string; duration: string; note: string };
  missYou: { count: number; last: string; note: string };
  messages: { text: string; time: string }[];
  diary: { date: string; text: string; time: string };
  snap: { caption: string; time: string; image: string };
  photos: { day: string; items: { src: string; caption: string }[] }[];
  surprises: { title: string; sub: string; locked: boolean }[];
  activity: { icon: string; text: string; ago: string }[];
  timeline: { icon: string; time: string; title: string; detail?: string }[];
};

const shared = {
  music: { progress: 42 },
};

const krishna: Person = {
  slug: "krishna",
  name: "Krishna",
  pronoun: "his",
  icon: "person",
  status: "Working",
  activeAgo: "2m ago",
  mood: { icon: "mood-okay", label: "Okay", note: "Long day, but thinking of you.", updated: "12m ago" },
  location: { place: "Office", city: "Hyderabad", updated: "6 minutes ago", sharing: true },
  thought: "Counting hours till we talk tonight.",
  music: { song: "Tum Se Hi", artist: "Mohit Chauhan", note: "Our Song", progress: shared.music.progress },
  meals: [
    { key: "breakfast", label: "Breakfast", icon: "sun", item: "Idli + Coffee", time: "7:40 AM" },
    { key: "lunch", label: "Lunch", icon: "bento", item: "Curd rice", time: "1:30 PM" },
    { key: "snack", label: "Snack", icon: "cake-slice", item: "", time: "" },
    { key: "dinner", label: "Dinner", icon: "utensils", item: "", time: "" },
  ],
  sleep: { asleep: "12:40 AM", awake: "7:10 AM", duration: "6h 30m", note: "Stayed up texting you" },
  missYou: { count: 21, last: "1:48 PM", note: "Wish I could just show up there." },
  messages: [
    { text: "Eat properly today, I mean it", time: "9:12 AM" },
    { text: "Saw a dog that looked exactly like you", time: "11:40 AM" },
  ],
  diary: {
    date: "August 15",
    text: "Work was loud and messy today. I kept catching myself smiling at my phone like an idiot.",
    time: "9:58 PM",
  },
  snap: { caption: "Desk chaos, send help", time: "10:20 AM", image: snapImg },
  photos: [
    { day: "Today", items: [{ src: photo1, caption: "Morning coffee" }, { src: photo2, caption: "Missing this" }] },
    { day: "Yesterday", items: [{ src: photo3, caption: "Sky for you" }] },
  ],
  surprises: [
    { title: "Open when you can't sleep", sub: "Locked", locked: true },
    { title: "Anniversary", sub: "24 days left", locked: false },
  ],
  activity: [
    { icon: "coffee", text: "Updated lunch", ago: "18 minutes ago" },
    { icon: "heart", text: "Missed you", ago: "34 minutes ago" },
    { icon: "camera", text: "Sent a snap", ago: "2 hours ago" },
  ],
  timeline: [
    { icon: "sun", time: "7:10 AM", title: "Woke up" },
    { icon: "coffee", time: "7:40 AM", title: "Breakfast", detail: "Idli + Coffee" },
    { icon: "camera", time: "10:20 AM", title: "Sent a snap" },
    { icon: "heart", time: "11:12 AM", title: "Missed Varshini" },
    { icon: "bento", time: "1:30 PM", title: "Lunch", detail: "Curd rice" },
  ],
};

const varshini: Person = {
  slug: "varshini",
  name: "Varshini",
  pronoun: "her",
  icon: "person",
  status: "Busy but happy",
  activeAgo: "4m ago",
  mood: { icon: "mood-inlove", label: "Happy", note: "Feeling really good today", updated: "20m ago" },
  location: { place: "Work", city: "Dubai", updated: "3 minutes ago", sharing: true },
  thought: "You'd love the sky here right now.",
  music: { song: "Kesariya", artist: "Arijit Singh", note: "Our Song", progress: 63 },
  meals: [
    { key: "breakfast", label: "Breakfast", icon: "sun", item: "Dosa + Coffee", time: "8:15 AM" },
    { key: "lunch", label: "Lunch", icon: "bento", item: "Biryani", time: "1:10 PM" },
    { key: "snack", label: "Snack", icon: "cake-slice", item: "Karak Tea", time: "5:20 PM" },
    { key: "dinner", label: "Dinner", icon: "utensils", item: "", time: "" },
  ],
  sleep: { asleep: "11:24 PM", awake: "7:12 AM", duration: "7h 48m", note: "Slept well" },
  missYou: { count: 17, last: "1:12 PM", note: "Wish you were here." },
  messages: [
    { text: "Don't forget to eat, please", time: "10:04 AM" },
    { text: "I miss you idiot", time: "2:20 PM" },
  ],
  diary: {
    date: "August 15",
    text: "Today was a busy day. I had so much work but kept thinking about Krishna.",
    time: "10:34 AM",
  },
  snap: { caption: "Look what I'm doing", time: "11:42 AM", image: snapImg },
  photos: [
    { day: "Today", items: [{ src: photo1, caption: "Karak break" }, { src: photo3, caption: "Dubai dusk" }] },
    { day: "Yesterday", items: [{ src: photo2, caption: "Almost your hand" }] },
  ],
  surprises: [
    { title: "Open when you miss me", sub: "Locked", locked: true },
    { title: "Anniversary", sub: "24 days left", locked: false },
  ],
  activity: [
    { icon: "camera", text: "Added a new photo", ago: "2 minutes ago" },
    { icon: "heart", text: "Missed you", ago: "8 minutes ago" },
    { icon: "mail", text: "Left you a message", ago: "21 minutes ago" },
    { icon: "pin", text: "Location updated", ago: "35 minutes ago" },
    { icon: "coffee", text: "Updated breakfast", ago: "2 hours ago" },
  ],
  timeline: [
    { icon: "sun", time: "7:12 AM", title: "Woke up" },
    { icon: "coffee", time: "8:15 AM", title: "Breakfast", detail: "Dosa + Coffee" },
    { icon: "pin", time: "9:02 AM", title: "Arrived at work" },
    { icon: "heart", time: "11:12 AM", title: "Missed Krishna" },
    { icon: "camera", time: "11:42 AM", title: "Sent a snap" },
    { icon: "bento", time: "1:10 PM", title: "Lunch", detail: "Biryani" },
    { icon: "mail", time: "2:20 PM", title: "Left Krishna a message" },
  ],
};

export const defaultWorld: Record<PersonSlug, Person> = { krishna, varshini };

export const albumArt = album;

export const other = (slug: PersonSlug): PersonSlug =>
  slug === "krishna" ? "varshini" : "krishna";

export const isPerson = (v: string): v is PersonSlug =>
  v === "krishna" || v === "varshini";

export type PhoneModel = "redmi9a" | "realme8" | "generic";

/** Which physical phone belongs to which person. */
export const PHONE_MODEL: Record<PersonSlug, PhoneModel> = {
  krishna: "realme8",
  varshini: "redmi9a",
};

/** Real-world specs shown on the Device screen for each phone model. */
export const PHONE_SPECS: Record<
  PhoneModel,
  { name: string; display: string; screen: string; screenCm: string }
> = {
  realme8: {
    name: "Realme 8",
    display: "1080 × 2400",
    screen: "6.4-inch",
    screenCm: "16.3 cm",
  },
  redmi9a: {
    name: "Redmi 9A",
    display: "720 × 1600",
    screen: "6.53-inch",
    screenCm: "16.6 cm",
  },
  generic: {
    name: "Smartphone",
    display: "20 : 9",
    screen: "long",
    screenCm: "",
  },
};

export function useWorld() {
  const [world, setWorld] = useState<Record<PersonSlug, Person>>(defaultWorld);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadTimer: number | undefined;

    const load = async () => {
      try {
        const data = await loadWorld();
        if (cancelled) return;
        setWorld((prev) => ({
          krishna: { ...defaultWorld.krishna, ...data.krishna },
          varshini: { ...defaultWorld.varshini, ...data.varshini },
        }));
        setHydrated(true);
      } catch (e) {
        console.error("Failed to load world from Supabase", e);
      }
    };

    const scheduleLoad = () => {
      if (loadTimer !== undefined) window.clearTimeout(loadTimer);
      loadTimer = window.setTimeout(() => {
        loadTimer = undefined;
        void load();
      }, 250);
    };

    void load();

    const channel = supabase
      .channel("between-us-world")
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
        scheduleLoad();
      })
      .subscribe();

    return () => {
      cancelled = true;
      if (loadTimer !== undefined) window.clearTimeout(loadTimer);
      void supabase.removeChannel(channel);
    };
  }, []);

  const save = useCallback((slug: PersonSlug, patch: Partial<Person>) => {
    setWorld((prev) => ({ ...prev, [slug]: { ...prev[slug], ...patch } }));
    persistPerson(slug, patch).catch((e) => console.error("Persist failed", e));
  }, []);

  return { world, save, hydrated };
}

export const moodOptions = [
  { icon: "mood-inlove", label: "In love" },
  { icon: "mood-great", label: "Great" },
  { icon: "mood-okay", label: "Okay" },
  { icon: "mood-meh", label: "Meh" },
  { icon: "mood-low", label: "Low" },
  { icon: "mood-tired", label: "Tired" },
];

export const phoneApps = [
  { slug: "photos", icon: "camera", label: "Photos" },
  { slug: "messages", icon: "mail", label: "Messages" },
  { slug: "location", icon: "pin", label: "Location" },
  { slug: "food", icon: "coffee", label: "Food" },
  { slug: "missyou", icon: "heart", label: "Miss You" },
  { slug: "music", icon: "music", label: "Music" },
  { slug: "mood", icon: "mood-okay", label: "Mood" },
  { slug: "diary", icon: "note", label: "Diary" },
  { slug: "surprises", icon: "gift", label: "Surprise" },
  { slug: "activity", icon: "clock", label: "Activity" },
  { slug: "sleep", icon: "sleep", label: "Sleep" },
  { slug: "calendar", icon: "calendar", label: "Calendar" },
  { slug: "device", icon: "smartphone", label: "Device" },
  { slug: "camera", icon: "camera", label: "Camera" },
] as const;
