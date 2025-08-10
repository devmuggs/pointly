import { ToastContainer } from "./components/core/toasts/toast-container";
import FramerMotionSandbox from "./pages/framer-motion-sandbox";

function App() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full max-w-3xl mx-auto p-4 overflow-x-hidden">
			<FramerMotionSandbox />

			{/* Toast Container */}
			<ToastContainer />
		</div>
	);
}

export default App;
