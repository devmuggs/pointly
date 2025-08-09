import { animate, motion, useMotionValue } from "framer-motion";
import React, { useRef } from "react";

interface TiltableProps extends React.HTMLAttributes<HTMLDivElement> {
	maxTilt?: number; // degrees, default 30
	children: React.ReactNode;
}

export default function Tiltable({ maxTilt = 30, children, ...props }: TiltableProps) {
	const tiltX = useMotionValue(0);
	const tiltY = useMotionValue(0);

	const dragStartY = useRef<number | null>(null);
	const dragStartX = useRef<number | null>(null);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		dragStartX.current = e.clientX;
		dragStartY.current = e.clientY;
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (dragStartX.current !== null) {
			const delta = e.clientX - dragStartX.current;
			tiltX.set(Math.max(-maxTilt, Math.min(maxTilt, delta / 3)));
		}

		if (dragStartY.current !== null) {
			const delta = e.clientY - dragStartY.current;
			tiltY.set(Math.max(-maxTilt, Math.min(maxTilt, -delta / 3))); // negative for natural tilt
		}
	};

	const resetTilt = () => {
		dragStartX.current = null;
		dragStartY.current = null;
		animate(tiltX, 0, { type: "spring", stiffness: 300, damping: 30 });
		animate(tiltY, 0, { type: "spring", stiffness: 300, damping: 30 });
	};

	const handlePointerUp = () => {
		resetTilt();
	};

	const handlePointerLeave = () => {
		resetTilt();
	};

	return (
		<motion.div
			className="w-full h-full"
			style={{
				...props.style,
				rotateY: tiltX,
				rotateX: tiltY,
				willChange: "transform"
			}}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerLeave}
		>
			{children}
		</motion.div>
	);
}
