import Link from "next/link";

interface Props {
  label: string;
  onClick?: () => void;
  href?: string;
  inverted?: boolean;
}

export const Button_Generic = ({
  label = "Submit",
  onClick,
  href,
  inverted = false,
}: Props) => {
  const bgClass = inverted
    ? `
        bg-white
        border
        border-cyan-600
        text-cyan-600
        hover:bg-cyan-50
        hover:border-cyan-700
        active:bg-cyan-100
        focus:ring-cyan-300
        disabled:bg-white disabled:border-gray-300 disabled:text-gray-400
      `
    : `
        bg-cyan-600
        text-white
        hover:bg-cyan-700
        active:bg-cyan-800
        focus:ring-cyan-400
        disabled:bg-cyan-300
      `;
  if (!!href) {
    return (
      <Link
        href={href}
        className={`${bgClass} cursor-pointer
                    font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition
                    duration-150 ease-in-out shadow-md hover:shadow-lg active:shadow-xl
                `}
      >
        {label}
      </Link>
    );
  } else {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${bgClass} cursor-pointer
                    font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition
                    duration-150 ease-in-out shadow-md hover:shadow-lg active:bg-cyan-800 active:shadow-xl
                `}
      >
        {label}
      </button>
    );
  }
};
