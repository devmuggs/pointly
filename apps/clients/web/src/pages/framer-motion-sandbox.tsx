// This file is to muck around with framer-motion

import { animate, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import Card from "../components/card/card";

export default function FramerMotionSandbox() {
	const balance = useMotionValue(1958);
	const roundedBalance = useTransform(balance, (value) => Math.round(value));
	const [balanceIncrement, setBalanceIncrement] = useState(1);

	const calculateAnimationDuration = (increment: number) => {
		const minimumDurationSeconds = 0.5;
		return Math.min(minimumDurationSeconds + increment / 100, 5);
	};

	const handleBalanceChange = (increment: number) => {
		animate(balance, increment, {
			duration: calculateAnimationDuration(increment)
		});
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen overflow-hidden font-sans">
			<h1 className="text-2xl mb-4">Framer Motion Sandbox</h1>

			<Card name={"BodyPay"} balance={roundedBalance.get()} baseColour="bg-rose-600" />

			<form
				className="mt-4 flex flex-col items-center"
				onSubmit={(e) => {
					e.preventDefault();
					handleBalanceChange(balance.get() + balanceIncrement);
				}}
			>
				<input
					type="range"
					min="1"
					max="100"
					value={balanceIncrement}
					onChange={(e) => setBalanceIncrement(Number(e.target.value))}
				/>
				<button className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded" type="submit">
					Add ${balanceIncrement}
				</button>
			</form>
		</div>
	);
}
