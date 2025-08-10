// Example usage in a component
import { CreateToast } from "./toast-store";

export function ExampleToastButton() {
	return (
		<>
			<button
				onClick={() => {
					CreateToast({
						title: "Success!",
						description: "Your action was successful.",
						duration: 3000
					});
				}}
			>
				Show Toast
			</button>
		</>
	);
}
