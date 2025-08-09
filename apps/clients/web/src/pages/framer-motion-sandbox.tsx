// This file is to muck around with framer-motion

import { useState } from "react";
import Card from "../components/card/card";

export default function FramerMotionSandbox() {
	const [balance, setBalance] = useState(1958);
	const [balanceIncrement, setBalanceIncrement] = useState(1);
	const [baseColour, setBaseColour] = useState("rgb(239, 68, 68)");

	return (
		<div className="flex flex-col items-center justify-center h-screen overflow-hidden font-sans">
			{/* <h1 className="text-2xl mb-4">Framer Motion Sandbox</h1> */}
			{baseColour}
			<Card name={"模擬"} balance={balance} baseColour={baseColour} />

			<form
				className="mt-4 flex flex-col items-center"
				onSubmit={(e) => {
					e.preventDefault();
					setBalance(balance + balanceIncrement);
				}}
			>
				<input
					type="range"
					min="1"
					max="100"
					value={balanceIncrement}
					onChange={(e) => setBalanceIncrement(+e.target.value)}
				/>

				<input
					type="color"
					name=""
					id=""
					value={baseColour}
					onChange={(e) => setBaseColour(e.target.value)}
				/>

				<button className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded" type="submit">
					Add ${balanceIncrement}
				</button>
			</form>
		</div>
	);
}
