import { useMotionValue } from "motion/react";

export const Direction = {
	LEFT: "left",
	RIGHT: "right",
	UP: "up",
	DOWN: "down"
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];

export const useDraggable = ({
	dragXThreshold = 50,
	dragYThreshold = 50,
	onDragStart,
	onDragEnd
}: {
	dragXThreshold?: number;
	dragYThreshold?: number;
	onDragStart?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onDragMove?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onDragEnd?: (direction: Direction, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
	const dragStart = { x: useMotionValue(0), y: useMotionValue(0) };
	const dragEnd = { x: useMotionValue(0), y: useMotionValue(0) };
	const dragDistance = { x: useMotionValue(0), y: useMotionValue(0) };

	const handleDragStart = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		// Set the initial drag start positions relative to the element
		const rect = event.currentTarget.getBoundingClientRect();
		dragStart.x.set(event.clientX - rect.left);
		dragStart.y.set(event.clientY - rect.top);
		onDragStart?.(event);
		dragDistance.x.set(0);
		dragDistance.y.set(0);
	};

	const handleDragMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		dragDistance.x.set(event.clientX - rect.left - dragStart.x.get());
		dragDistance.y.set(event.clientY - rect.top - dragStart.y.get());
	};

	const handleDragEnd = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.preventDefault();
		event.stopPropagation();

		// calculate the primary direction of the drag
		const xDistance = dragDistance.x.get();
		const yDistance = dragDistance.y.get();

		const absX = Math.abs(xDistance);
		const absY = Math.abs(yDistance);

		let direction: Direction | null = null;
		if (absX > dragXThreshold || absY > dragYThreshold) {
			if (absX > absY) {
				direction = xDistance > 0 ? Direction.RIGHT : Direction.LEFT;
			} else {
				direction = yDistance > 0 ? Direction.DOWN : Direction.UP;
			}
		}

		if (direction) {
			onDragEnd?.(direction, event);
		}

		dragStart.x.set(0);
		dragStart.y.set(0);
		dragDistance.x.set(0);
		dragDistance.y.set(0);
	};

	return {
		dragStart,
		dragEnd,
		dragDistance,
		handleDragMove,
		handleDragStart,
		handleDragEnd
	};
};
