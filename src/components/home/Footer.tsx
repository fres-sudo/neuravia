import { Brain, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, ArrowRight } from "lucide-react";
import Link from "next/link";

const Footer = () => {
	const footerSections = [
		{
			title: "Platform",
			links: [
				{ label: "Cognitive Games", href: "#" },
				{ label: "Alzheimer Score", href: "#" },
				{ label: "Caregiver Tools", href: "#" },
				{ label: "MRI Analysis", href: "#" },
			]
		},
		{
			title: "Support", 
			links: [
				{ label: "Help Center", href: "#" },
				{ label: "Clinical Resources", href: "#" },
				{ label: "Family Guides", href: "#" },
				{ label: "API Documentation", href: "#" },
			]
		},
		{
			title: "Company",
			links: [
				{ label: "About Us", href: "#" },
				{ label: "Careers", href: "#" },
				{ label: "Press Kit", href: "#" },
				{ label: "Contact", href: "#" },
			]
		}
	];

	const socialLinks = [
		{ icon: Twitter, href: "#", label: "Twitter" },
		{ icon: Linkedin, href: "#", label: "LinkedIn" },
		{ icon: Facebook, href: "#", label: "Facebook" }
	];

	const contactInfo = [
		{ icon: Mail, label: "support@neuravia.com", href: "mailto:support@neuravia.com" },
		{ icon: Phone, label: "+1 (555) 123-4567", href: "tel:+15551234567" },
		{ icon: MapPin, label: "San Francisco, CA", href: "#" }
	];

	return (
		<footer className="bg-gray-900 text-white relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
			<div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
			
			<div className="max-w-7xl mx-auto px-4 py-16 relative">
				{/* Main Footer Content */}
				<div className="grid lg:grid-cols-4 gap-12 mb-12">
					{/* Brand Section */}
					<div className="lg:col-span-1 space-y-6">
						<div className="flex items-center gap-3 group">
							<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
								<Brain className="w-6 h-6 text-white" />
							</div>
							<div className="flex flex-col">
								<span className="text-2xl font-bold">Boost</span>
								<span className="text-sm text-gray-400">Cognitive Care</span>
							</div>
						</div>
						
						<p className="text-gray-300 leading-relaxed">
							Empowering families and healthcare providers with precision cognitive care through innovative technology and compassionate design.
						</p>

						{/* Contact Info */}
						<div className="space-y-3">
							{contactInfo.map((contact, index) => (
								<a 
									key={index}
									href={contact.href}
									className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
								>
									<contact.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
									<span className="text-sm">{contact.label}</span>
								</a>
							))}
						</div>

						{/* Social Links */}
						<div className="flex items-center gap-4">
							{socialLinks.map((social, index) => (
								<a
									key={index}
									href={social.href}
									aria-label={social.label}
									className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
								>
									<social.icon className="w-4 h-4" />
								</a>
							))}
						</div>
					</div>

					{/* Links Sections */}
					{footerSections.map((section, index) => (
						<div key={index} className="space-y-6">
							<h4 className="font-bold text-lg text-white">{section.title}</h4>
							<ul className="space-y-3">
								{section.links.map((link, linkIndex) => (
									<li key={linkIndex}>
										<a
											href={link.href}
											className="text-gray-300 hover:text-white transition-colors text-sm font-medium group flex items-center"
										>
											{link.label}
											<ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Newsletter Section */}
				<div className="bg-gray-800 rounded-2xl p-8 mb-12 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
					<div className="relative">
						<div className="max-w-2xl">
							<h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
							<p className="text-gray-300 mb-6">Get the latest updates on cognitive care research and platform improvements.</p>
							
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									placeholder="Enter your email address"
									className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
								<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group">
									Subscribe
									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="border-t border-gray-800 pt-8">
					<div className="flex flex-col lg:flex-row justify-between items-center gap-4">
						<div className="flex flex-col sm:flex-row items-center gap-6 text-gray-400 text-sm">
							<span>&copy; 2024 Boost. All rights reserved.</span>
							<div className="flex items-center gap-6">
								<Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
								<Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
								<Link href="#" className="hover:text-white transition-colors">Security</Link>
							</div>
						</div>
						
						<div className="flex items-center gap-4 text-gray-400 text-sm">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
								<span>All systems operational</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
