import { animate, motion, useMotionValue } from "framer-motion";
import React, { useRef } from "react";

interface TiltableProps extends React.HTMLAttributes<HTMLDivElement> {
	maxTilt?: number; // degrees, default 30
	children: React.ReactNode;

	onTilt?: (x: number, y: number) => void; // callback for tilt changes
	onTiltEnd?: (x: number, y: number) => void; // callback for tilt changes
}

export default function Tiltable({
	onTilt,
	maxTilt = 30,
	children,
	onTiltEnd,
	...props
}: TiltableProps) {
	const tiltX = useMotionValue(0);
	const tiltY = useMotionValue(0);

	const cardRef = useRef<HTMLDivElement>(null);

	const dragStartY = useRef<number | null>(null);
	const dragStartX = useRef<number | null>(null);
	const resetInterval = useRef<ReturnType<typeof setInterval> | null>(null);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		dragStartX.current = e.clientX;
		dragStartY.current = e.clientY;
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const rect = cardRef.current?.getBoundingClientRect();
		if (!rect) return;

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		// Map [-center, center] to [-maxTilt, maxTilt]
		let tiltXVal = ((x - centerX) / centerX) * maxTilt;
		let tiltYVal = -((y - centerY) / centerY) * maxTilt;

		// Clamp to maxTilt
		tiltXVal = Math.max(-maxTilt, Math.min(maxTilt, tiltXVal));
		tiltYVal = Math.max(-maxTilt, Math.min(maxTilt, tiltYVal));

		tiltX.set(tiltXVal);
		tiltY.set(tiltYVal);

		onTilt?.(tiltXVal, tiltYVal);
	};

	const resetTilt = () => {
		if (resetInterval.current) {
			clearInterval(resetInterval.current);
			resetInterval.current = null;
		}

		resetInterval.current = setTimeout(() => {
			dragStartX.current = null;
			dragStartY.current = null;
			animate(tiltX, 0, { type: "spring", stiffness: 100, damping: 10 });
			animate(tiltY, 0, { type: "spring", stiffness: 100, damping: 10 });
			onTiltEnd?.(0, 0); // reset tilt callback
			resetInterval.current = null;
		}, 1000); // reset tilt after 1 second of inactivity
	};

	const handlePointerUp = () => {
		resetTilt();
	};

	const handlePointerLeave = () => {
		resetTilt();
	};

	return (
		<motion.div
			ref={cardRef}
			className="w-full h-full"
			style={{
				...props.style,
				rotateY: tiltX,
				rotateX: tiltY,
				willChange: "transform",
				touchAction: "none"
			}}
			onMouseEnter={handlePointerDown}
			onMouseMove={handlePointerMove}
			onMouseUp={handlePointerUp}
			onMouseLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerLeave}
			// {...props}
		>
			{children}
		</motion.div>
	);
}
