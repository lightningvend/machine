interface RoundedButtonProps {
  onClick: () => void;
  title: string;
}

export const RoundedButton: React.FC<RoundedButtonProps> = ({
  onClick,
  title,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="m-4 flex h-10 max-w-xs items-center justify-center rounded-full rounded-xl border border border-black/[.08] border-gray-200 border-solid p-6 px-4 text-left text-inherit text-sm transition-colors transition-colors hover:border-blue-600 hover:border-transparent hover:bg-[#f2f2f2] hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 active:border-blue-600 active:text-blue-600cursor-pointer sm:h-12 sm:min-w-44 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
  >
    {title}
  </button>
);
