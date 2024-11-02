import {
	BriefcaseBusinessIcon,
	GraduationCapIcon,
	SquareArrowOutUpRightIcon,
} from "lucide-react";

const JobItem = ({
	from,
	to,
	title,
	description,
	type,
	url,
}: {
	from: string;
	to: string;
	title: string;
	description: string;
	type: "job" | "education";
	url?: string;
}) => {
	return (
		<div className="flex flex-row items-center">
			{type === "job" ? (
				<BriefcaseBusinessIcon size={20} />
			) : (
				<GraduationCapIcon size={20} />
			)}

			<span className="ml-4 w-40 items-center justify-center inline-flex px-4 py-2 rounded-full border-2 border-gray-500">
				{from} &rarr; {to}
			</span>
			<div className="h-1 bg-gray-500 w-4 rounded-e-full" />

			<div className="flex flex-col ml-4">
				<h3 className="text-2xl font-bold">{title}</h3>
				{url ? (
					<a
						href={url}
						target="_blank"
						rel="noreferrer"
						className="inline-flex flex-row items-center gap-2 text-gray-500 hover:text-primary transition-colors"
					>
						<span>{description}</span>
						<SquareArrowOutUpRightIcon size={14} />
					</a>
				) : (
					<p className="text-gray-500">{description}</p>
				)}
			</div>
		</div>
	);
};

export default JobItem;
