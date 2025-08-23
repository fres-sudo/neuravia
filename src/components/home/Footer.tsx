"use client";

import { Brain, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

// Footer component
const Footer = () => {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim()) {
			setIsSubscribed(true);
			setEmail("");
			// Reset dopo 3 secondi
			setTimeout(() => setIsSubscribed(false), 3000);
		}
	};

	return (
		<footer className="bg-gray-900 text-white relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-green-600"></div>
			<div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
			
			<div className="max-w-7xl mx-auto px-4 py-16 relative">
				{/* Brand Section */}
				<div className="text-center mb-12">
					<div className="flex items-center justify-center gap-3 group mb-6">
						<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
							<Brain className="w-6 h-6 text-white" />
						</div>
						<div className="flex flex-col">
							<span className="text-2xl font-bold">Boost</span>
							<span className="text-sm text-gray-400">Cognitive Care</span>
						</div>
					</div>
					
					<p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
						Empowering families and healthcare providers with precision cognitive care through innovative technology and compassionate design.
					</p>
				</div>

				{/* Newsletter Section */}
				<div className="bg-gray-800 rounded-2xl p-8 mb-12 relative overflow-hidden max-w-2xl mx-auto">
					<div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
					<div className="relative text-center">
						<h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
						<p className="text-gray-300 mb-6">Get the latest updates on cognitive care research and platform improvements.</p>
						
						{isSubscribed ? (
							<div className="flex items-center justify-center gap-3 text-green-400 font-semibold">
								<CheckCircle className="w-5 h-5" />
								<span>Thank you for subscribing!</span>
							</div>
						) : (
							<form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email address"
									required
									className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
								<button 
									type="submit"
									className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
								>
									Subscribe
									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</button>
							</form>
						)}
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="text-center">
					<span className="text-gray-400 text-sm">&copy; 2024 Boost. All rights reserved.</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;