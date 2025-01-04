import { CheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  isTooltip?: boolean;
  tooltip?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  isTooltip = false,
  tooltip,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="appearance-none w-5 h-5 border-2 border-gray rounded 
            checked:bg-primary checked:border-primary cursor-pointer"
        />
        {checked && (
          <CheckIcon
            className="absolute h-4 w-4 text-white pointer-events-none"
            strokeWidth={2.5}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className="text-sm text-textDefault cursor-pointer select-none leading-5"
        >
          {label}
        </label>
        {isTooltip && tooltip && (
          <div className="group relative inline-block">
            <InformationCircleIcon className="h-5 w-5 text-gray hover:text-primary cursor-help" />
            <span className="pointer-events-none absolute whitespace-normal opacity-0 transition-opacity group-hover:opacity-100 bg-background text-textDefault text-sm py-1 px-2 rounded shadow-lg border border-gray/20
              sm:min-w-[200px]
              max-sm:-top-2 max-sm:left-6 min-w-[100px]
              md:top-6 md:-left-80 md:translate-x-1/2">
              {tooltip}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
