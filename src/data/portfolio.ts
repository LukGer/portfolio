import raw from "./portfolio.json";

export interface TimelineRow {
	year: string;
	title: string;
	meta: string;
	href?: string;
	tag?: string;
}

export interface StackItem {
	lane: string;
	title: string;
	meta: string;
}

export interface OffScreenRow {
	cadence: string;
	title: string;
	meta: string;
	href?: string;
	tag?: string;
}

export type ContactEntry =
	| { kind: "email"; label: string; email: string }
	| { kind: "link"; label: string; line: string; href: string };

export interface PortfolioLists {
	work: TimelineRow[];
	projects: TimelineRow[];
	stack: StackItem[];
	offScreen: OffScreenRow[];
	contact: ContactEntry[];
}

export const portfolio = raw as PortfolioLists;
