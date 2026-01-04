import {
  FaLinkedin,
  FaGithub,
  FaGoogle,
  FaAmazon,
  FaMicrosoft,
  FaApple,
} from "react-icons/fa";
import { MdLink } from "react-icons/md";

const WEBSITE_CONFIG = {
  linkedin: {
    icon: FaLinkedin,
    color: "#0A66C2",
    hoverColor: "#054399",
    name: "LinkedIn",
  },
  github: {
    icon: FaGithub,
    color: "#171515",
    hoverColor: "#0D0D0D",
    name: "GitHub",
  },
  google: {
    icon: FaGoogle,
    color: "#EA4335",
    hoverColor: "#C5221F",
    name: "Google",
  },
  amazon: {
    icon: FaAmazon,
    color: "#FF9900",
    hoverColor: "#FF7C1F",
    name: "Amazon",
  },
  microsoft: {
    icon: FaMicrosoft,
    color: "#00A4EF",
    hoverColor: "#0078D4",
    name: "Microsoft",
  },
  apple: {
    icon: FaApple,
    color: "#000000",
    hoverColor: "#333333",
    name: "Apple",
  },
  indeed: {
    icon: MdLink,
    color: "#2D68F8",
    hoverColor: "#1A4BBF",
    name: "Indeed",
  },
  glassdoor: {
    icon: MdLink,
    color: "#00A699",
    hoverColor: "#007A7A",
    name: "Glassdoor",
  },
  default: {
    icon: MdLink,
    color: "#6366F1",
    hoverColor: "#4F46E5",
    name: "Job Posting",
  },
};

export default function JobPostingButton({ url }) {
  if (!url) {
    return (
      <button
        disabled
        className="px-3 py-2 rounded-lg bg-zinc-700 text-zinc-400 text-xs font-medium cursor-not-allowed opacity-50"
      >
        No URL
      </button>
    );
  }

  // Extract domain name from URL
  const extractDomain = (urlString) => {
    try {
      const urlObj = new URL(
        urlString.startsWith("http") ? urlString : `https://${urlString}`
      );
      const hostname = urlObj.hostname.toLowerCase();
      // Remove www. prefix
      const domain = hostname.replace("www.", "");
      // Extract main domain (before first dot for subdomains)
      const mainDomain = domain.split(".")[0];
      return mainDomain;
    } catch {
      return "link";
    }
  };

  const domain = extractDomain(url);
  const config = WEBSITE_CONFIG[domain] || WEBSITE_CONFIG.default;
  const Icon = config.icon;

  const handleClick = () => {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-medium transition-all duration-200 shadow-lg shadow-black/40 hover:shadow-lg hover:shadow-black/60"
      style={{
        backgroundColor: config.color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = config.hoverColor;
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = config.color;
        e.currentTarget.style.transform = "scale(1)";
      }}
      title={`Open ${config.name}`}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{config.name}</span>
    </button>
  );
}
