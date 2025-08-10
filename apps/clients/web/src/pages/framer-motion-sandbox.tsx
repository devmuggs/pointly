// This file is to muck around with framer-motion

import { useRef, useState } from "react";
import Card from "../components/card/card";
import IconPicker from "../components/icons/icon-picker";

function randomColour() {
	return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
}

function randomCreditCardNumber() {
	const parts = [];
	for (let i = 0; i < 4; i++) {
		parts.push(Math.floor(Math.random() * 9000 + 1000));
	}

	return parts.join(" ");
}

const groups = [
	{
		id: "1",
		name: "Personal Cards",
		theme: "rgba(80, 80, 255, 0.9)",
		cards: [
			{
				id: randomCreditCardNumber(),
				name: "ルービー",
				balance: 100,
				baseColour: "rgb(239, 68, 68)",
				sigil: "/textures/albedo/groudon.webp"
			},
			{
				id: randomCreditCardNumber(),
				name: "エメラルド",
				balance: 200,
				baseColour: "rgb(34, 197, 94)",
				sigil: "/textures/albedo/rayquaza.webp"
			},
			{
				id: randomCreditCardNumber(),
				name: "サファイア",
				balance: 300,
				baseColour: "rgb(37, 99, 235)",
				sigil: "/textures/albedo/kyogre.webp"
			}
		]
	},
	{
		id: "2",
		name: "Business Cards",
		theme: "rgba(10, 10, 10, 1)",
		cards: [
			{
				id: randomCreditCardNumber(),
				name: "Card 3",
				balance: 300,
				baseColour: randomColour(),
				sigil: ""
			},
			{
				id: randomCreditCardNumber(),
				name: "Card 4",
				balance: 400,
				baseColour: randomColour(),
				sigil: ""
			}
		]
	}
];

import { AnimatePresence, motion, type Variants } from "framer-motion";

export default function FramerMotionSandbox() {
	const [balance, setBalance] = useState(1958);
	const [balanceIncrement, setBalanceIncrement] = useState(1);
	const [baseColour, setBaseColour] = useState("rgb(239, 68, 68)");

	const [activeGroupIndx, setActiveGroupIndx] = useState(0);

	const prevIndex = useRef(activeGroupIndx);
	const handleTabClick = (index: number) => {
		prevIndex.current = activeGroupIndx;
		setActiveGroupIndx(index);
	};

	const direction = activeGroupIndx > prevIndex.current ? 1 : -1;

	const variants = {
		enter: (dir: number) => ({
			opacity: 0,
			x: dir * 40
		}),
		center: {
			opacity: 1,
			x: 0
		},
		exit: (dir: number) => ({
			opacity: 0,
			x: dir * 40 // same as enter
		})
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 ">
			{/* Tab Content */}
			<div className="grow p-4 space-y-8">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeGroupIndx}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: 0.2 }}
						className="space-y-8 w-full"
					>
						{groups[activeGroupIndx].cards.map((card) => (
							<Card
								key={card.id}
								id={card.id}
								name={card.name}
								balance={card.balance}
								baseColour={card.baseColour}
								sigil={card.sigil}
							/>
						))}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Tab Buttons */}
			<div className="flex space-x-4 mb-4">
				{groups.map((group, index) => (
					<motion.button
						key={group.id}
						initial="rest"
						animate={activeGroupIndx === index ? "active" : "rest"}
						className="px-4 py-2 rounded-md focus:outline-none"
						onClick={() => handleTabClick(index)}
						variants={{
							rest: {
								scale: 1,
								backgroundColor: "rgb(229, 231, 235)",
								color: "black"
							},
							active: { scale: 1.1, backgroundColor: group.theme, color: "white" }
						}}
						whileHover="active"
						whileTap="active"
					>
						{group.name}
					</motion.button>
				))}
			</div>
		</div>
	);
}
