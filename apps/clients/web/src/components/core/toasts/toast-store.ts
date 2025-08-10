// Zustand Store for managing toast notifications
import { Toast } from "@radix-ui/react-toast";
import { create } from "zustand";

export const Status = {
	Debug: "debug",
	Info: "info",
	Warning: "warning",
	Error: "error",
	Success: "success"
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export interface Toast {
	id: string;
	title: string;
	description?: string;
	duration?: number;
	status?: Status;
}

interface ToastState {
	toasts: Map<Toast["id"], Toast>;
	addToast: (toast: Toast) => void;
	removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
	toasts: new Map(),
	addToast: (toast) =>
		set((state) => {
			console.log(`Adding toast with id: ${toast.id}`);
			state.toasts.set(toast.id, toast);
			return { toasts: new Map(state.toasts) };
		}),
	removeToast: (id) =>
		set((state) => {
			console.log(`Removing toast with id: ${id}`);
			state.toasts.delete(id);
			return { toasts: new Map(state.toasts) };
		})
}));

export function CreateToast({ title, description, duration = 3000 }: Omit<Toast, "id">): string {
	const id = crypto.randomUUID();
	useToastStore.getState().addToast({ id, title, description, duration });

	// Automatically remove the toast after the specified duration
	setTimeout(() => {
		useToastStore.getState().removeToast(id);
	}, duration);

	return id;
}
