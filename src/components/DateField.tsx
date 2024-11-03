const DateField = ({ date }: { date: Date }) => {
	return (
		<span className="font-bold text-xs">
			{date.toLocaleDateString(undefined, { dateStyle: "short" })}
		</span>
	);
};

export default DateField;
