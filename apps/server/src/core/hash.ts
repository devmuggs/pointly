import argon2 from "argon2";
import { logger } from "./logger";
export class Hasher {
	public static async hash(original: string): Promise<string> {
		return await argon2.hash(original);
	}

	public static async compare({
		hash,
		compare
	}: {
		hash: string;
		compare: string;
	}): Promise<boolean> {
		logger.trace({
			subject: "Hasher.compare",
			hash,
			compare
		});
		return await argon2.verify(hash, compare);
	}
}
