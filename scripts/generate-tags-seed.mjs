import { promises as fs } from "fs";
import path from "path";

const rootDir = process.cwd();

const tagsCsvPath = path.join(rootDir, "imports", "tags.csv");
const placeTagsCsvPath = path.join(rootDir, "imports", "place_tags.csv");
const outputPath = path.join(rootDir, "migrations", "0003_seed_tags.sql");

function parseCsv(content) {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const headers = lines[0].split(",").map((header) => header.trim());

    return lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim());

        return headers.reduce((row, header, index) => {
            row[header] = values[index] ?? "";
            return row;
        }, {});
    });
}

function sqlString(value) {
    if (value === null || value === undefined || value === "") {
        return "NULL";
    }

    return `'${String(value).replaceAll("'", "''")}'`;
}

async function main() {
    const tagsCsv = await fs.readFile(tagsCsvPath, "utf8");
    const placeTagsCsv = await fs.readFile(placeTagsCsvPath, "utf8");

    const tags = parseCsv(tagsCsv);
    const placeTags = parseCsv(placeTagsCsv);

    const statements = [];

    statements.push("-- Seed tags and place_tags for Saranwak");
    statements.push("-- Generated from imports/tags.csv and imports/place_tags.csv");
    statements.push("");

    /**
     * Jangan DROP table, biar struktur aman.
     * Jangan pakai BEGIN TRANSACTION / COMMIT karena D1 execute menolak manual transaction.
     */
    statements.push("DELETE FROM place_tags;");
    statements.push("DELETE FROM tags;");
    statements.push("");

    for (const tag of tags) {
        statements.push(
            `INSERT INTO tags (id, name, slug, type) VALUES (${sqlString(
                tag.id
            )}, ${sqlString(tag.name)}, ${sqlString(tag.slug)}, ${sqlString(
                tag.type
            )});`
        );
    }

    statements.push("");

    for (const placeTag of placeTags) {
        statements.push(
            `INSERT INTO place_tags (place_id, tag_id) VALUES (${sqlString(
                placeTag.place_id
            )}, ${sqlString(placeTag.tag_id)});`
        );
    }

    await fs.mkdir(path.dirname(outputPath), {
        recursive: true,
    });

    await fs.writeFile(outputPath, statements.join("\n"), "utf8");

    console.log(`Generated: ${outputPath}`);
    console.log(`Tags: ${tags.length}`);
    console.log(`Place tags: ${placeTags.length}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});