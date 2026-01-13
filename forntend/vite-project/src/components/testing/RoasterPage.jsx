export const convertTo24Hour = (time12h) => {
  if (!time12h || typeof time12h !== "string") return "00:00";
  const parts = time12h.trim().split(" ");
  if (parts.length !== 2) return "00:00";
  const [time, rawModifier] = parts;
  const modifier = rawModifier.toUpperCase();
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

export default function RosterPages() {
  
}