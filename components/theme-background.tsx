import { Spark } from "@/components/art";

const stars = [
  { className: "bg-star bg-star-a", color: "#fff200" },
  { className: "bg-star bg-star-b", color: "#ff3d92" },
  { className: "bg-star bg-star-c", color: "#37e85c" },
  { className: "bg-star bg-star-d", color: "#7fd4ff" },
  { className: "bg-star bg-star-e", color: "#c77dff" },
  { className: "bg-star bg-star-f", color: "#fff200" },
  { className: "bg-star bg-star-g", color: "#ff3d92" },
  { className: "bg-star bg-star-h", color: "#37e85c" },
  { className: "bg-star bg-star-i", color: "#fff200" },
  { className: "bg-star bg-star-j", color: "#7fd4ff" },
  { className: "bg-star bg-star-k", color: "#ff3d92" },
  { className: "bg-star bg-star-l", color: "#c77dff" },
];

export function ThemeBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      {stars.map((star) => (
        <Spark key={star.className} className={star.className} color={star.color} />
      ))}
    </div>
  );
}
