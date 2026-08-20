import { toJalaali as _toJalaali, toGregorian as _toGregorian } from "jalaali-js"

const JALALI_MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
]

const JALALI_DAY_NAMES = [
  "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه",
]

const JALALI_DAY_NAMES_SHORT = [
  "ی", "د", "س", "چ", "پ", "ج", "ش",
]

export function toJalali(dateString: string): { year: number; month: number; day: number } {
  const date = new Date(dateString)
  const j = _toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return { year: j.jy, month: j.jm, day: j.jd }
}

export function formatJalaliDate(dateString: string): string {
  const { year, month, day } = toJalali(dateString)
  return `${day} ${JALALI_MONTH_NAMES[month - 1]} ${year}`
}

export function formatJalaliShort(dateString: string): string {
  const { year, month, day } = toJalali(dateString)
  return `${day}/${month}/${year}`
}

export function getTodayIso(): string {
  const now = new Date()
  return now.toISOString().split("T")[0]
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): string {
  const g = _toGregorian(jy, jm, jd)
  return `${g.gy}-${String(g.gm).padStart(2, "0")}-${String(g.gd).padStart(2, "0")}`
}

export function getJalaliToday(): { year: number; month: number; day: number } {
  return toJalali(getTodayIso())
}

export function getJalaliMonthName(month: number): string {
  return JALALI_MONTH_NAMES[month - 1]
}

export function getJalaliDayName(dateString: string): string {
  const date = new Date(dateString + "T12:00:00")
  return JALALI_DAY_NAMES[date.getDay()]
}

export function getJalaliDayNameShort(dayOfWeek: number): string {
  return JALALI_DAY_NAMES_SHORT[dayOfWeek]
}

export function getDaysInJalaliMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  const gregorianFirstDay = _toGregorian(jy, jm, 1)
  const gregorianLastDay = _toGregorian(jy, jm + 1 > 12 ? 1 : jm + 1, 1)
  if (jm === 12) {
    const nextYear = _toGregorian(jy + 1, 1, 1)
    return daysBetween(gregorianFirstDay.gy, gregorianFirstDay.gm, gregorianFirstDay.gd, nextYear.gy, nextYear.gm, nextYear.gd)
  }
  return daysBetween(gregorianFirstDay.gy, gregorianFirstDay.gm, gregorianFirstDay.gd, gregorianLastDay.gy, gregorianLastDay.gm, gregorianLastDay.gd)
}

function daysBetween(gy1: number, gm1: number, gd1: number, gy2: number, gm2: number, gd2: number): number {
  const d1 = new Date(gy1, gm1 - 1, gd1)
  const d2 = new Date(gy2, gm2 - 1, gd2)
  return Math.round((d2.getTime() - d1.getTime()) / 86400000)
}

export function getJalaliMonthStartDayOfWeek(jy: number, jm: number): number {
  const g = _toGregorian(jy, jm, 1)
  const date = new Date(g.gy, g.gm - 1, g.gd)
  const day = date.getDay()
  return (day + 1) % 7
}

export function getIsoToJalaliDateKey(dateString: string): string {
  const { year, month, day } = toJalali(dateString)
  return `${year}-${month}-${day}`
}

export function getJalaliDateKey(jy: number, jm: number, jd: number): string {
  return `${jy}-${jm}-${jd}`
}
