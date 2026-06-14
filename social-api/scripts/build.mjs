import { spawnSync } from "node:child_process";
import { readFile, rm, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const root = process.cwd();
const prismaBin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "prisma.cmd" : "prisma");

const generate = spawnSync(prismaBin, ["generate"], { stdio: "inherit" });
if (generate.status !== 0) {
	process.exit(generate.status ?? 1);
}

async function collectTsFiles(dir) {
	const entries = await readdir(path.join(root, dir), { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const child = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...await collectTsFiles(child));
		} else if (entry.isFile() && entry.name.endsWith(".ts")) {
			files.push(child);
		}
	}

	return files;
}

async function rewriteEsmImports(dir) {
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const child = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			await rewriteEsmImports(child);
			continue;
		}

		if (!entry.isFile() || !entry.name.endsWith(".js")) {
			continue;
		}

		const source = await readFile(child, "utf8");
		const next = source
			.replace(
				/(from\s+["'])(\.{1,2}\/[^"']+?)(["'])/g,
				(match, prefix, specifier, suffix) => {
					return /\.[cm]?js$|\.json$/.test(specifier)
						? match
						: `${prefix}${specifier}.js${suffix}`;
				},
			)
			.replace(
				/(import\s+["'])(\.{1,2}\/[^"']+?)(["'])/g,
				(match, prefix, specifier, suffix) => {
					return /\.[cm]?js$|\.json$/.test(specifier)
						? match
						: `${prefix}${specifier}.js${suffix}`;
				},
			);

		if (next !== source) {
			await writeFile(child, next);
		}
	}
}

await rm(path.join(root, "dist"), { recursive: true, force: true });

const entryPoints = [
	"index.ts",
	...await collectTsFiles("routes"),
	...await collectTsFiles("middlewares"),
	...await collectTsFiles("lib"),
	...await collectTsFiles("generated/prisma"),
];

await build({
	entryPoints,
	outdir: "dist",
	outbase: ".",
	platform: "node",
	target: "node22",
	format: "esm",
	bundle: false,
	logLevel: "info",
});

await rewriteEsmImports(path.join(root, "dist"));
