import style from "./NetworkLinks.module.css";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/goITclub/",
    icon: "facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/goitclub/",
    icon: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/c/GoIT",
    icon: "youtube",
  },
];

export default function NetworkLinks() {
  return (
    <ul className={style.list} aria-label="Social media">
      {socials.map(({ label, href, icon }) => (
        <li key={label}>
          <a
            href={href}
            className={style.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <svg className={style.icon} aria-hidden="true">
              <use href={`${import.meta.env.BASE_URL}icons.svg#${icon}`} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
