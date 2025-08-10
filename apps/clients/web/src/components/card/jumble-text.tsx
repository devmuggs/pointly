import { useEffect, useState } from "react";

interface JumbleTextParams {
	/** The target string to jumble. */
	target: string;
	/**
	 * Duration of the jumble effect in milliseconds.
	 * Default is 800ms.
	 */
	duration?: number;
	/**
	 * Interval between each frame of the jumble effect in milliseconds.
	 * Default is 30ms.
	 */
	interval?: number;
}
function JumbleText({ target, duration = 800, interval = 30 }: JumbleTextParams): string {
	const [display, setDisplay] = useState(target.replace(/\d/g, "•"));

	useEffect(() => {
		let frame = 0;
		const chars =
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
		const revealSteps = Math.ceil(duration / interval);
		const jumble = () => {
			const revealed = Math.floor((frame / revealSteps) * target.length);
			let next = "";
			for (let i = 0; i < target.length; i++) {
				if (target[i] === " ") {
					next += " ";
				} else if (i < revealed) {
					next += target[i];
				} else {
					next += chars[Math.floor(Math.random() * chars.length)];
				}
			}
			setDisplay(next);
			frame++;
			if (frame <= revealSteps) {
				setTimeout(jumble, interval);
			} else {
				setDisplay(target);
			}
		};
		jumble();
		// Only run on mount or when target changes
		// eslint-disable-next-line
	}, [target]);
	return display;
}

export default JumbleText;
