import { forwardRef } from "react";
import "./StripDesigns.css";

export const templates = [
  { id: "classic", name: "Classic", caption: "THE GOOD TIMES", shade: "paper" },
  {
    id: "mono",
    name: "Monochrome",
    caption: "STAY IN THIS MOMENT",
    shade: "ink",
  },
  { id: "soft", name: "Soft Frame", caption: "made with love", shade: "soft" },
  {
    id: "rose",
    name: "Rosé",
    caption: "LA VIE EN ROSE",
    shade: "rose",
  },
  {
    id: "cherry",
    name: "Cherry Blossom",
    caption: "桜 SAKURA DREAMS",
    shade: "cherry",
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    caption: "SWEET LIKE CANDY",
    shade: "bubblegum",
  },
  {
    id: "vintage",
    name: "Vintage",
    caption: "ONCE UPON A TIME",
    shade: "vintage",
  },
  {
    id: "midnight",
    name: "Midnight",
    caption: "CITY LIGHTS",
    shade: "midnight",
  },
];

export const Strip = forwardRef(function Strip(
  { template, photos, mock = false },
  ref,
) {
  return (
    <div className={`photo-strip ${template.shade}`} ref={ref}>
      <div className="strip-head">
        RINJAY BOOTH <span>2026</span>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div className={`strip-photo ${mock ? "mock" : ""}`} key={i}>
          {photos[i] ? (
            <img src={photos[i]} alt={`Photo ${i + 1}`} />
          ) : mock ? (
            `PHOTO 0${i + 1}`
          ) : (
            <span>0{i + 1}</span>
          )}
        </div>
      ))}
      <div className="strip-caption">
        {template.caption}
        <small>JAKARTA, ID</small>
      </div>
    </div>
  );
});

