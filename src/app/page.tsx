import { HydrateClient } from "@/trpc/server";
import FeaturesDetailed from "@/components/home/FeaturesDetailed";
import Footer from "@/components/home/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";

export default async function Home() {
	return (
		<HydrateClient>
			<main className="min-h-screen">
				<Navbar />
				<Hero />
				<div id="features">
					<FeaturesDetailed />
				</div>
				<div id="how-it-works">
					<HowItWorks />
				</div>
				<Footer />
			</main>
		</HydrateClient>
	);
}
