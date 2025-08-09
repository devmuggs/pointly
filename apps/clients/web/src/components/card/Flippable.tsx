import clsx from "clsx";
import { motion, useMotionValue } from "motion/react";
import React, { type ReactNode, useRef, useState } from "react";
import { Direction, useDraggable } from "./useDraggable";

interface FlippableProps extends React.HTMLAttributes<HTMLDivElement> {
	isFlipped?: boolean;
	onFlip?: (flipped: boolean) => void;
}

export default function Flippable({
	isFlipped: isFlippedProp,
	onFlip,
	children,
	...props
}: FlippableProps) {
	// Internal state if not controlled
	const [internalFlipped, setInternalFlipped] = useState(false);
	const isControlled = isFlippedProp !== undefined;
	const isFlipped = isControlled ? isFlippedProp : internalFlipped;

	const rotateY = useMotionValue(isFlipped ? 180 : 0);
	const rotateX = useMotionValue(0);

	const DirectionToCallback: Record<Direction, (direction: Direction) => void> = {
		[Direction.LEFT]: () => {
			rotateY.set(rotateY.get() - 180);
		},
		[Direction.RIGHT]: () => {
			rotateY.set(rotateY.get() + 180);
		},
		[Direction.UP]: () => {
			rotateX.set(rotateX.get() + 180);
		},
		[Direction.DOWN]: () => {
			rotateX.set(rotateX.get() - 180);
		}
	};

	const flip = (direction: Direction) => {
		console.log("Flipping card in direction:", direction);
		DirectionToCallback[direction]?.(direction);

		if (isControlled) {
			onFlip?.(!isFlipped);
		} else {
			setInternalFlipped((f) => {
				onFlip?.(!f);
				return !f;
			});
		}
	};

	const wasDragged = useRef(false);

	const draggable = useDraggable({
		onDragStart: () => (wasDragged.current = false),
		onDragEnd: (direction) => {
			wasDragged.current = true; // Mark as dragged
			flip(direction);
		}
	});

	// Handle click to flip
	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (wasDragged.current) {
			wasDragged.current = false; // reset for next time
			return; // Suppress click if drag occurred
		}
		const rect = e.currentTarget.getBoundingClientRect();
		const isLeftSide = e.clientX < rect.left + rect.width / 2;
		flip(isLeftSide ? Direction.LEFT : Direction.RIGHT);
	};

	const childrenArray = React.Children.toArray(children);

	if (!children || childrenArray.length > 2) {
		throw new Error("Flippable component must have exactly one Front and one Back child.");
	}

	const content = ({ children, isFront }: { children: ReactNode; isFront: boolean }) => (
		<motion.div
			className={clsx(
				"absolute w-full h-full flex items-center justify-center select-none",
				props.className
			)}
			style={{
				rotateY: isFront ? rotateY : rotateY.get() + 180,
				rotateX: isFront ? rotateX : rotateX.get(),
				transition: "transform 0.6s cubic-bezier(0.4,0.2,0.2,1)",
				backfaceVisibility: "hidden"
			}}
		>
			{children}
		</motion.div>
	);

	return (
		<>
			<motion.div
				className="w-full h-full cursor-pointer"
				style={{ perspective: 1200 }}
				onClick={handleClick}
				onMouseDown={draggable.handleDragStart}
				onMouseMove={draggable.handleDragMove}
				onMouseUp={draggable.handleDragEnd}
			>
				{content({ children: childrenArray[0], isFront: true })}
				{content({ children: childrenArray[1], isFront: false })}
			</motion.div>
		</>
	);
}

Flippable.Front = ({ children }: { children: React.ReactNode }) => <>{children}</>;
Flippable.Back = ({ children }: { children: React.ReactNode }) => <>{children}</>;
