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
        border-violet-600
        text-violet-600
        hover:bg-violet-50
        hover:border-violet-700
        active:bg-violet-100
        focus:ring-violet-300
        disabled:bg-white disabled:border-gray-300 disabled:text-gray-400
      `
    : `
        bg-violet-600
        text-white
        hover:bg-violet-700
        active:bg-violet-800
        focus:ring-violet-400
        disabled:bg-violet-300
      `;
  if (!!href) {
    return (
      <Link
        href={href}
        className={`${bgClass} cursor-pointer
                    font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 transition
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
                    font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 transition
                    duration-150 ease-in-out shadow-md hover:shadow-lg active:bg-violet-800 active:shadow-xl
                `}
      >
        {label}
      </button>
    );
  }
};
