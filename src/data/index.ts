export const SITE_TITLE = "Lumos Notes";
export const SITE_DESCRIPTION = "A internet space for Luke vZ";

export interface MenuItem {
	label: string;
	url: string;
}

export const menuItems: MenuItem[] = [
	{
		label: "home",
		url: "/",
	},
	{
		label: "writings",
		url: "/writings",
	},
	{
		label: "thoughts",
		url: "/thoughts",
	},
	{
		label: "bookshelf",
		url: "/bookshelf",
	},
	// {
	// 	label: "ships",
	// 	url: "/ships",
	// },
];

export const title = "Lumos Notes";
export const description = "A internet space for Luke vZ";
export const image = "/images/ogimage.png";
export const url = "https://sanju.sh";

export const ogImage = {
	src: "/images/ogimage.png",
	alt: "Lumos Notes",
};


export const products = [
	{
		name: "Launching",
		url: "/tags/launching",
		image: "🚀",
	},
	{
		name: "Orbiting",
		url: "/tags/orbiting",
		image: "🛰",
	},
	{
		name: "Beacon",
		url: "https://sticai.com",
		image: "🌠",
	},
];

export const socialLinks = [
	{
		label: "@x",
		url: "https://x.com/lukevz",
	},
	{
		label: "email",
		url: "mailto:luke@blueskylabs.io",
	},
	{
		label: "linkedin",
		url: "https://www.linkedin.com/in/lukevz",
	},
];
