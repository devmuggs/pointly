import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import * as MdIcons from "react-icons/md";
import { CreateToast, Status } from "../core/toasts/toast-store";

const icons = Object.entries(MdIcons).map(([name, Icon]) => ({
	name,
	component: Icon
}));

export default function IconPicker({ onIconSelect }: { onIconSelect: (icon: string) => void }) {
	const [options, setOptions] = useState({
		search: "",
		filteredIcons: icons,
		page: 1,
		pageSize: 50
	});

	const [staggerCoordinate, setStaggerCoordinate] = useState<[number, number] | null>(null);
	const [staggerPulse, setStaggerPulse] = useState(false);

	const handleIconSelect = (icon: string) => {
		navigator.clipboard
			.writeText(icon)
			.then(() => {
				console.log(`Icon name '${icon}' copied to clipboard.`);
				onIconSelect(icon);

				CreateToast({
					title: `Icon name '${icon}' copied to clipboard.`,
					duration: 3000,
					status: Status.Success
				});
			})
			.catch((err) => {
				console.error("Failed to copy icon name:", err);
				CreateToast({
					title: "Failed to copy icon name.",
					description: "Please try again.",
					duration: 3000,
					status: Status.Error
				});
			});
	};

	const staggerGrid = useRef<Set<[number, number]>>(new Set());
	const triggerStagger = (coordinate: [number, number]) => {
		setStaggerCoordinate(coordinate);
		setStaggerPulse(true);

		const [row, col] = coordinate;

		staggerGrid.current = new Set<[number, number]>([
			// Direct neighbors
			[row - 1, col],
			[row + 1, col],
			[row, col - 1],
			[row, col + 1],
			// Diagonal neighbors
			[row - 1, col - 1],
			[row - 1, col + 1],
			[row + 1, col - 1],
			[row + 1, col + 1]
		]);

		setTimeout(() => {
			setStaggerPulse(false);
			setStaggerCoordinate(null);
			staggerGrid.current.clear();
		}, 400); // pulse duration
	};

	const filteredIconsPage = useMemo(() => {
		const start = (options.page - 1) * options.pageSize;
		const end = start + options.pageSize;
		return options.filteredIcons.slice(start, end);
	}, [options.filteredIcons, options.page, options.pageSize]);

	const buttonGrid = useMemo(() => {
		const rows = Math.ceil(filteredIconsPage.length / 10);
		const grid = Array.from({ length: rows }, (_, rowIndex) =>
			filteredIconsPage.slice(rowIndex * 10, (rowIndex + 1) * 10)
		);
		return grid;
	}, [filteredIconsPage]);

	return (
		<div className="flex flex-col justify-center w-3xl p-4">
			<h2 className="text-xl mt-8 mb-4">Icon Library</h2>
			<div className="border px-2 py-1 text-sm rounded-md w-full mb-4 flex items-center gap-1">
				<MdIcons.MdSearch size={12} className="inline mr-2" />
				<input
					type="text"
					placeholder="Search icons..."
					value={options.search}
					className="w-full bg-transparent outline-none"
					onChange={(e) => {
						const search = e.target.value;
						if (search === "") {
							return setOptions({
								...options,
								search: "",
								filteredIcons: icons,
								page: 1
							});
						}

						const searchLower = search.toLowerCase().replace(/\s+/g, " ");

						const filteredIcons = icons.filter((icon) =>
							icon.name.toLowerCase().includes(searchLower)
						);

						setOptions({ ...options, search, filteredIcons, page: 1 });
					}}
				/>
			</div>

			<div className="flex flex-row flex-wrap gap-2 w-full mb-4">
				{options.filteredIcons.length === 0 && (
					<p className="text-neutral-500 text-sm italic w-full text-center">
						No icons found matching "{options.search}"
					</p>
				)}

				{buttonGrid.map((row, rowIndex) => (
					<div key={rowIndex} className="flex flex-row gap-2 w-full">
						{row.map(({ name, component: Icon }, colIndex) => {
							// Calculate delay based on distance from the clicked coordinate
							let delay = 0;
							if (staggerPulse && staggerCoordinate) {
								const [clickedRow, clickedCol] = staggerCoordinate;
								const distance =
									Math.abs(rowIndex - clickedRow) +
									Math.abs(colIndex - clickedCol);
								delay = distance * 60; // 60ms per "step" away
							}

							return (
								<motion.button
									key={name}
									className="flex items-center justify-center border p-2 rounded-md cursor-pointer relative"
									onClick={() => {
										handleIconSelect(name);
										triggerStagger([rowIndex, colIndex]);
									}}
									title={name}
									initial={{
										scale: 1,
										color: "#737373",
										backgroundColor: "transparent"
									}}
									whileFocus={{ scale: 1.05 }}
									whileHover={{
										scale: 1.1,
										boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)"
									}}
									whileTap={{
										scale: 0.9,
										backgroundColor: "oklch(59.6% 0.145 163.225)"
									}}
									animate={
										staggerPulse && staggerCoordinate
											? {
													scale: [1, 1.2, 1],
													transition: {
														delay: delay / 1000,
														duration: 0.3
													}
											  }
											: {}
									}
								>
									<div className="flex flex-col items-center justify-center">
										<Icon size={48} className="text-neutral-200" />
										<div className="text-xs text-neutral-200 mt-1">
											{rowIndex},{colIndex}
										</div>
									</div>
									<motion.span
										className="absolute inset-0 bg-neutral-800 rounded-md opacity-0 pointer-events-none"
										transition={{ duration: 0.3 }}
										animate={
											staggerPulse && staggerCoordinate
												? {
														opacity: [0, 0.2, 0],
														transition: {
															delay: delay / 1000,
															duration: 0.3
														}
												  }
												: {}
										}
									/>
								</motion.button>
							);
						})}
					</div>
				))}

				<div className="w-full flex items-center mb-2 gap-2 justify-end">
					<motion.button
						disabled={options.page <= 1}
						className="disabled:opacity-50 flex items-center justify-center border px-2 py-1 rounded-md hover:bg-neutral-500 bg-neutral-800 cursor-pointer"
						onClick={() =>
							setOptions({ ...options, page: Math.max(1, options.page - 1) })
						}
						whileHover={{ scale: 1.1, boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)" }}
						whileTap={{ scale: 0.9 }}
					>
						<MdIcons.MdArrowBackIosNew size={12} className="text-neutral-200" />
					</motion.button>

					<motion.button
						disabled={
							options.page * options.pageSize >= options.filteredIcons.length ||
							options.filteredIcons.length === 0
						}
						className="disabled:opacity-50 flex items-center justify-center border px-2 py-1 rounded-md hover:bg-neutral-500 bg-neutral-800 cursor-pointer"
						onClick={() =>
							setOptions({
								...options,
								page: Math.min(
									Math.ceil(icons.length / options.pageSize),
									options.page + 1
								)
							})
						}
						whileHover={{ scale: 1.1, boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)" }}
						whileTap={{ scale: 0.9 }}
					>
						<MdIcons.MdArrowForwardIos size={12} className="text-neutral-200" />
					</motion.button>
				</div>
			</div>
		</div>
	);
}
