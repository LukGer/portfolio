import { LightbulbIcon } from "lucide-react";

const HitMeUp = ({ jobsLength }: { jobsLength: number }) => {
	return (
		<div
			className="fade-in-up flex flex-row items-center group"
			style={{ animationDelay: `${jobsLength * 0.2 + 0.5}s;` }}
		>
			<div className="rounded-full p-4 border-gray-300 group-hover:border-yellow-400 border-2 me-8 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]">
				<LightbulbIcon
					size={20}
					className="group-hover:text-yellow-400 transition-colors duration-300"
				/>
			</div>

			<div className="flex flex-col gap-1 text-gray-600">
				<span>Do you have an idea and want to expand that list? </span>
				<a
					href="mailto:lukger1999@gmail.com?subject=Hey,%20what's%20up?"
					className="text-primary font-bold"
				>
					Hit me up ;)
				</a>
			</div>
		</div>
	);
};

export default HitMeUp;
