import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Footer } from "@/components/layout/footer";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col">
			<Navbar />
			<Hero />
			<ServicesGrid />
			<div className="flex-1">
				{/* Other sections will go here */}
			</div>
			<Footer />
		</main>
	);
}
