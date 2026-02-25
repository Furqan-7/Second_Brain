interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: any;
  endIcon?: any;
  onClick: () => void;
}

export const Button = (prop: ButtonProps) => {
  const ButtonVariant = {
    "primary":
      "flex justify-center items-center bg-[#5146e4] gap-1.5   text-[#fdfdfe]  rounded-[5px]",
    "secondary":
      "flex justify-center items-center bg-[#e0e7ff] gap-1.5  text-[#4f47ba] rounded-[5px]",
  };

  const ButtonSize = {
    "sm": "text-sm p-2",
    "md": "text-base p-2",
    "lg": "text-lg p-2",
  };

  const Iconsize = {
      "sm":16,
      "md":20,
      "lg":24,
  }

  return (
    <button
      className={`hover:cursor-pointer ${ButtonVariant[prop.variant]} ${ButtonSize[prop.size]}`}
      onClick={prop.onClick}
    >
      {<img src={prop.startIcon} alt="Plus Icon " width={Iconsize[prop.size]}></img>} {prop.text}
    </button>
  );
};
