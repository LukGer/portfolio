import { CalendarIcon } from "lucide-react";

const DateField = ({ date }: { date: Date }) => {
	return (
		<div className="self-end flex flex-row items-center gap-2">
			<CalendarIcon size={14} />

			<span className="font-bold text-xs">
				{date.toLocaleDateString(undefined, { dateStyle: "short" })}
			</span>
		</div>
	);
};

export default DateField;
