import { HydrateClient } from "@/trpc/server";
import FeaturesDetailed from "@/components/home/FeaturesDetailed";
import Footer from "@/components/home/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Hero from "@/components/home/Hero";

export default async function Home() {
	return (
		<HydrateClient>
			<main className="min-h-screen">
				<Hero />
				<FeaturesDetailed />
				<HowItWorks />
				<Footer />
			</main>
		</HydrateClient>
	);
}
