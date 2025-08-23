import { Brain, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-card border-t border-border">
			<div className="container mx-auto px-4 py-12">
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
								<Brain className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold">AlzheimCare</span>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Empowering families and healthcare providers with precision
							cognitive care through innovative technology and compassionate
							design.
						</p>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold">Platform</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									Cognitive Games
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									Alzheimer Score
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									Caregiver Tools
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									MRI Analysis
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold">Support</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									Help Center
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									Clinical Resources
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									Family Guides
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors">
									Privacy Policy
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold">Contact</h4>
						<div className="space-y-3 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Mail className="w-4 h-4" />
								<span>support@alzheimcare.com</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Phone className="w-4 h-4" />
								<span>1-800-CARE-NOW</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin className="w-4 h-4" />
								<span>Available nationwide</span>
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-border mt-8 pt-8 text-center">
					<p className="text-sm text-muted-foreground">
						© 2024 AlzheimCare. All rights reserved. | HIPAA Compliant | FDA
						Registered
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
