export const proposalTextLimit = 12000;

export type ProposalBlock =
  | { type: "meta"; label: string; value: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; index: number; caption: string }
  | { type: "fee"; title: string; price: string; items: string[] };

export function isFormattedProposal(source: string) {
  return /^##\s/m.test(source) || /\{\{\d+/.test(source);
}

function tableCells(line: string) {
  const parts = line.split("|").map((cell) => cell.trim());
  if (parts[0] === "") parts.shift();
  if (parts.at(-1) === "") parts.pop();
  return parts;
}

function isRule(cells: string[]) {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

export function parseProposal(source: string): ProposalBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ProposalBlock[] = [];
  let paragraph: string[] = [];
  let bullets: string[] | null = null;
  let fee: Extract<ProposalBlock, { type: "fee" }> | null = null;
  let table: string[][] | null = null;

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  }

  function flushBullets() {
    if (!bullets) return;
    if (fee) fee.items.push(...bullets);
    else blocks.push({ type: "ul", items: bullets });
    bullets = null;
  }

  function flushFee() {
    flushBullets();
    if (!fee) return;
    blocks.push(fee);
    fee = null;
  }

  function flushTable() {
    if (!table?.length) {
      table = null;
      return;
    }
    const [headers, ...rows] = table;
    blocks.push({ type: "table", headers, rows });
    table = null;
  }

  function flushAll() {
    flushParagraph();
    flushBullets();
    flushFee();
    flushTable();
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushBullets();
      flushTable();
      continue;
    }

    if (line.startsWith("!")) {
      flushAll();
      const body = line.slice(1).trim();
      const [label, ...rest] = body.split("|");
      blocks.push({ type: "meta", label: label.trim(), value: rest.join("|").trim() });
      continue;
    }

    if (line.startsWith("## ")) {
      flushAll();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("### ")) {
      flushAll();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }

    const image = line.match(/^\{\{(\d+)(?:\|([^}]*))?\}\}$/);
    if (image) {
      flushAll();
      blocks.push({ type: "image", index: Number(image[1]), caption: (image[2] ?? "").trim() });
      continue;
    }

    if (line.startsWith("$$ ")) {
      flushAll();
      const body = line.slice(3).trim();
      const [title, ...rest] = body.split("|");
      fee = { type: "fee", title: title.trim(), price: rest.join("|").trim(), items: [] };
      continue;
    }

    if (line.startsWith("|")) {
      flushParagraph();
      flushBullets();
      flushFee();
      const cells = tableCells(line);
      if (!isRule(cells)) {
        table = table ?? [];
        table.push(cells);
      }
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      flushTable();
      bullets = bullets ?? [];
      bullets.push(line.slice(2).trim());
      continue;
    }

    flushBullets();
    flushFee();
    flushTable();
    paragraph.push(line);
  }

  flushAll();
  return blocks;
}
