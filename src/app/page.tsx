import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { Footer } from "@/components/layout/footer";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col">
			<Navbar />
			<Hero />
			<div className="flex-1">
				{/* Other sections will go here */}
			</div>
			<Footer />
		</main>
	);
}
