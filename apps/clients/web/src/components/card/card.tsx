import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import { BsFire } from "react-icons/bs";
import QRCode from "react-qr-code";
import Flippable from "./flippable";
import JumbleText from "./jumble-text";
import Tiltable from "./tiltable";

interface UserCardProps {
	name: string;
	balance: number;
	baseColour?: string;
}

const BlendMode = {
	normal: "normal",
	overlay: "overlay",
	multiply: "multiply",
	screen: "screen",
	darken: "darken",
	lighten: "lighten"
} as const;
type BlendMode = (typeof BlendMode)[keyof typeof BlendMode];

const calculateAnimationDuration = (increment: number) => {
	const minimumDurationSeconds = 0.5;
	return Math.min(minimumDurationSeconds + increment / 100, 5);
};

export default function Card({ name, balance, baseColour }: UserCardProps) {
	// want to render the balance with commas, e.g. 1,958

	const tiltY = useMotionValue(0);
	const tiltX = useMotionValue(0);

	const animatedBalance = useMotionValue(balance);
	const formattedBalance = useTransform(animatedBalance, (v) =>
		new Intl.NumberFormat().format(Math.round(v))
	);

	const [particles, setParticles] = useState<{ x: number; y: number; key: number }[]>([]);

	const triggerParticles = () => {
		// Generate 12 particles at random angles
		const newParticles = Array.from({ length: 12 }).map((_, i) => ({
			x: 0,
			y: 0,
			key: Date.now() + i,
			angle: (i / 12) * 2 * Math.PI,
			distance: 80 + Math.random() * 40
		}));
		setParticles(newParticles);
		setTimeout(() => setParticles([]), 700); // Remove after animation
	};

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

	const cardWidth = 300;
	const cardHeight = 200;
	const maxTilt = 15;

	const tiltToX = useTransform(
		tiltX,
		(t) => cardWidth / 2 + (t / maxTilt) * (cardWidth / 2 - maxTilt)
	);
	const tiltToY = useTransform(
		tiltY,
		(t) => cardHeight / 2 + (t / maxTilt) * (cardHeight / 2 - maxTilt)
	);

	const backgroundColor = useMotionTemplate`radial-gradient(circle at ${tiltToX}px ${tiltToY}px, rgba(255,255,255,0.1), rgba(0,0,0,0.5))`;
	const triggerRipple = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setRipple({ x, y, key: Date.now() });
	};

	useEffect(() => {
		const controls = animate(animatedBalance, balance, {
			duration: calculateAnimationDuration(balance),
			onComplete: () => {
				triggerParticles(); // trigger particles
			}
		});

		return controls.stop;
	}, [animatedBalance, balance]);

	const tiltMagnitude = useTransform(
		[tiltX, tiltY],
		([x, y]) => Math.sqrt(x * x + y * y) / maxTilt // 0 (center) to 1 (max tilt)
	);

	const glitterOpacity = useTransform(tiltMagnitude, (t) => 0.3 + 0.6 * t); // 0.2 to 0.7 based on tilt
	const fresnelOpacity = useTransform(tiltMagnitude, (t) => 0.7 + 0.8 * t);

	const parallaxFactor = 5; // px per max tilt, tweak for more/less effect

	const parallaxX = useTransform(tiltX, (t) => t * (parallaxFactor / maxTilt));
	const parallaxY = useTransform(tiltY, (t) => t * (parallaxFactor / maxTilt));

	return (
		<motion.div
			className="relative w-[300px] h-[200px] cursor-pointer"
			style={{ perspective: 1200 }}
			onClick={(e) => {
				triggerRipple(e);
			}}
			onMouseMove={handleMouseMove}
		>
			<Tiltable
				maxTilt={maxTilt}
				onTilt={(x, y) => {
					animate(tiltX, x, { type: "spring", stiffness: 200, damping: 30 });
					animate(tiltY, y, { type: "spring", stiffness: 200, damping: 30 });
				}}
			>
				<Flippable className="p-2">
					<Flippable.Front>
						<motion.div
							className="flex justify-between items-start w-full h-full z-10 relative flex-col"
							style={{
								perspective: 1200,
								transform: `translate(${parallaxX}px, ${parallaxY}px)`
							}}
						>
							<div className="flex flex-col items-start">
								<motion.span
									className="text-white font-semibold text-sm -mb-2 select-none"
									style={{ mixBlendMode: "color-burn" }}
								>
									Points Balance
								</motion.span>
								<motion.span className="text-lg font-bold">
									{formattedBalance}
								</motion.span>
							</div>

							<div className="flex justify-between w-full">
								<BsFire
									size={32}
									className="text-2xl text-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out"
								/>
								<div className="text-2xl text-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out">
									{name}
								</div>
							</div>
						</motion.div>

						{/* Always want card number perfectly centered */}
						<motion.span className="text-white/80 text-shadow-sm text-shadow-black/80 text-xl font-light -mb-2 select-none text-center mx-auto absolute inset-x-0 z-50">
							<JumbleText target="4000 1234 5678 9010" duration={800} interval={30} />
						</motion.span>

						{/* Albedo Overlay */}
						<motion.div
							className="absolute inset-0 rounded-md pointer-events-none"
							style={{ background: baseColour }}
						/>
						{/* Radial Gradient Overlay */}
						<motion.div
							className="absolute inset-0 rounded-md pointer-events-none"
							style={{ background: backgroundColor }}
						/>
						{/* Fresnel Texture */}
						<motion.div
							className="absolute inset-0 rounded-md pointer-events-none"
							style={{
								backgroundImage: "url('/textures/fresnel.jpg')",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								mixBlendMode: BlendMode.multiply,
								opacity: fresnelOpacity,
								filter: "contrast(1.2) brightness(1.1)"
							}}
							transition={{
								duration: 10,
								ease: "linear",
								repeat: Infinity
							}}
						/>
						{/* Glitter Texture */}
						<motion.div
							className="absolute inset-0 rounded-md pointer-events-none"
							style={{
								backgroundImage: "url('/textures/glitter-normal.jpg')",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								mixBlendMode: BlendMode.multiply,
								opacity: glitterOpacity,
								filter: "grayscale(1) contrast(1.2)"
							}}
							transition={{
								duration: 14,
								ease: "linear",
								repeat: Infinity
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
									<motion.span className="text-lg font-bold">
										{formattedBalance}
									</motion.span>
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

								<div className="flex items-center justify-center relative group">
									{/* Main QR code */}
									<motion.div
										whileHover={{ y: -12, zIndex: 2 }}
										transition={{ type: "spring", stiffness: 300, damping: 24 }}
										className="relative z-10"
									>
										<QRCode
											value={formattedBalance.get()}
											size={48}
											className="rounded-xs backdrop-blur-2xl opacity-80"
											bgColor="transparent"
											fgColor="rgba(255, 255, 255)"
											style={{ mixBlendMode: "screen" }}
										/>
									</motion.div>

									{/* Shadow QR code */}
									<motion.div
										className="absolute top-0 left-0"
										initial={{ filter: "blur(12px)", opacity: 0.3, scale: 1 }}
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
										style={{ zIndex: 1 }}
									>
										<QRCode
											value={formattedBalance.get()}
											size={46}
											bgColor="transparent"
											fgColor="black"
											className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out blur-[1px]"
										/>
									</motion.div>
								</div>
							</div>
						</div>

						{/* Albedo Overlay */}
						<motion.div
							className={`absolute inset-0 rounded-md z-0`}
							style={{ background: baseColour }}
						/>

						{/* Radial Gradient Overlay, moves with mouse */}
						<motion.div
							className="absolute inset-0 rounded-md z-0"
							style={{
								background: backgroundColor
							}}
						/>
					</Flippable.Back>
				</Flippable>

				{/* shadow */}
				<motion.div
					className="absolute left-0 right-0 -bottom-[20px] h-[20px] rounded-md shadow-lg -z-10"
					style={{
						background: "rgba(0, 0, 0, 0.5)",
						filter: "blur(12px)"
					}}
				/>
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
							background: `radial-gradient(circle, ${baseColour} 0%, rgba(255, 255, 255, 0) 100%)`,
							transform: "translate(-50%, -50%)",
							zIndex: 21,
							mixBlendMode: "screen"
						}}
						onAnimationComplete={() => setRipple(null)}
					/>
				</>
			)}

			{particles.map((p) => (
				<motion.span
					key={p.key}
					initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
					animate={{
						x: Math.cos(p.angle) * p.distance,
						y: Math.sin(p.angle) * p.distance,
						opacity: 0,
						scale: 0.5 + Math.random() * 0.7
					}}
					transition={{ duration: 0.7, ease: "easeOut" }}
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						width: 12,
						height: 12,
						borderRadius: "50%",
						background: "rgba(255,255,255,0.8)",
						pointerEvents: "none",
						zIndex: 30,
						mixBlendMode: "screen"
					}}
				/>
			))}
		</motion.div>
	);
}
