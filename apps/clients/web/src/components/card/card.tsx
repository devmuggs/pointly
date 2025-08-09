import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useState } from "react";

import QRCode from "react-qr-code";
import Flippable from "./Flippable";
import JumbleText from "./JumbleText";
import Tiltable from "./Tiltable";

interface UserCardProps {
	name: string;
	balance: number;
	baseColour?: string;
}

export default function Card({ name, balance, baseColour }: UserCardProps) {
	// want to render the balance with commas, e.g. 1,958
	const formattedBalance = new Intl.NumberFormat().format(balance);
	const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(150);

	// Update the mouse position on mouse move
	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		// Calculate mouse position relative to the card
		mouseX.set(event.clientX - rect.left);
		mouseY.set(event.clientY - rect.top);
		mouseX.set(Math.max(0, Math.min(mouseX.get(), rect.width)));
		mouseY.set(Math.max(0, Math.min(mouseY.get(), rect.height)));
	};

	const backgroundColor = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.5))`;

	const triggerRipple = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setRipple({ x, y, key: Date.now() });
	};

	return (
		<div
			className="relative w-[300px] h-[200px] cursor-pointer"
			style={{ perspective: 1200 }}
			onClick={(e) => {
				triggerRipple(e);
			}}
			onMouseMove={handleMouseMove}
		>
			<Tiltable>
				<Flippable className="p-2">
					<Flippable.Front>
						<div className="flex justify-between items-start w-full h-full z-10 relative flex-col">
							<div className="flex flex-col items-start">
								<motion.span className="text-white/70 font-semibold text-sm -mb-2 select-none">
									Points Balance
								</motion.span>
								<span className="text-lg font-bold">{formattedBalance}</span>
							</div>

							<motion.div
								className="flex items-center justify-end ml-auto"
								whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
							>
								{name}
							</motion.div>
						</div>

						{/* Always want card number perfectly centered */}
						<motion.span className="text-white/70 text-xl font-light -mb-2 select-none text-center mx-auto absolute inset-x-0 z-10">
							<JumbleText target="4000 1234 5678 9010" duration={800} interval={30} />
						</motion.span>

						{/* Albedo Overlay for base colour */}
						<motion.div className={`absolute inset-0 rounded-md ${baseColour} z-0`} />

						{/* Radial Gradient Overlay, moves with mouse */}
						<motion.div
							className="absolute inset-0 rounded-md z-0"
							style={{
								background: backgroundColor
							}}
						/>
					</Flippable.Front>

					<Flippable.Back>
						<div className="flex justify-between items-start w-full h-full z-10 relative flex-col">
							<div className="flex flex-col items-start">
								<div className="flex flex-col items-start">
									<motion.span className="text-white/70 font-semibold text-sm -mb-2 select-none">
										Lifetime Points Accrual
									</motion.span>
									<span className="text-lg font-bold">{formattedBalance}</span>
								</div>

								<motion.span className="text-white/70 font-semibold text-sm -mb-2 select-none">
									Membership Tier
								</motion.span>
								<span className="text-lg font-bold">Platinum</span>
							</div>

							<div className="flex w-full items-center justify-between">
								<div className="flex flex-col grow w-full">
									<motion.span className="text-white/70 font-semibold  text-sm -mb-2 select-none ">
										Member Since
									</motion.span>
									<span className="text-lg font-bold">
										{new Date(Date.now() - 31536000000).toLocaleDateString(
											"en-GB"
										)}
									</span>
								</div>

								<motion.div
									className=""
									whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
								>
									<QRCode
										value={formattedBalance}
										size={48}
										className="rounded-xs backdrop-blur-2xl"
										bgColor="transparent"
										fgColor="rgba(255, 255, 255, 0.8)"
									/>
								</motion.div>
							</div>
						</div>

						{/* Albedo Overlay for base colour */}
						<motion.div className={`absolute inset-0 rounded-md ${baseColour} z-0`} />

						{/* Radial Gradient Overlay, moves with mouse */}
						<motion.div
							className="absolute inset-0 rounded-md z-0"
							style={{
								background: backgroundColor
							}}
						/>
					</Flippable.Back>
				</Flippable>
			</Tiltable>

			{ripple && (
				<>
					{/* Colored glow ripple */}
					<motion.span
						key={ripple.key + "-glow"}
						initial={{ scale: 0, opacity: 0.5 }}
						animate={{ scale: 7, opacity: 0 }}
						transition={{ duration: 0.9, ease: "easeOut" }}
						style={{
							position: "absolute",
							left: ripple.x,
							top: ripple.y,
							width: 90,
							height: 90,
							borderRadius: "50%",
							pointerEvents: "none",
							background:
								"radial-gradient(circle, rgba(120,90,255,0.35) 0%, rgba(0,212,255,0.18) 60%, rgba(120,90,255,0.05) 100%)",
							// filter: "blur(18px)",
							transform: "translate(-50%, -50%)",
							zIndex: 21,
							mixBlendMode: "screen"
						}}
						onAnimationComplete={() => setRipple(null)}
					/>
				</>
			)}
		</div>
	);
}
