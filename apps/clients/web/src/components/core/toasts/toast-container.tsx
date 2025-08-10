import * as RadixToast from "@radix-ui/react-toast";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Status, useToastStore, type Toast } from "./toast-store";

const ToastNotificationStyles: Record<Status, string> = {
	[Status.Debug]: "bg-sky-500/80 text-white",
	[Status.Info]: "bg-emerald-500/80 text-white",
	[Status.Success]: "bg-green-500/80 text-white",
	[Status.Warning]: "bg-yellow-500/80 text-white",
	[Status.Error]: "bg-red-500/80 text-white"
};

const ToastConfiguration = {
	styles: ToastNotificationStyles,
	durationMs: 3000,
	position: "bottom-right"
} as const;

function ToastNotification({ toast }: { toast: Toast }) {
	const removeToast = useToastStore((s) => s.removeToast);

	return (
		<RadixToast.Root
			asChild
			open
			onOpenChange={(isOpen) => !isOpen && removeToast(toast.id)}
			duration={toast.duration ?? ToastConfiguration.durationMs}
		>
			<motion.div
				initial={{ opacity: 0, x: 40 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: 40 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className={clsx(
					"flex flex-col p-4 rounded-md shadow-lg my-1",
					ToastNotificationStyles[toast.status ?? Status.Info]
				)}
			>
				<RadixToast.Title className="font-medium">{toast.title}</RadixToast.Title>
				{toast.description && (
					<RadixToast.Description className="text-sm opacity-90">
						{toast.description}
					</RadixToast.Description>
				)}
			</motion.div>
		</RadixToast.Root>
	);
}

export function ToastContainer() {
	const toasts = useToastStore((state) => state.toasts);

	return (
		<RadixToast.Viewport
			className={clsx("fixed bottom-0 right-0 p-4 w-full max-w-sm bg-transparent")}
		>
			<AnimatePresence>
				{Array.from(toasts.values()).map((toast) => (
					<ToastNotification key={toast.id} toast={toast} />
				))}
			</AnimatePresence>
		</RadixToast.Viewport>
	);
}
