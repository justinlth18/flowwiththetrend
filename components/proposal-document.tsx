"use client";

import type { ReactNode } from "react";
import { PhotoGrid } from "@/components/photo-grid";
import { isFormattedProposal, parseProposal, type ProposalBlock } from "@/lib/proposal-markup";

type Shot = { id: string; src: string; caption?: string };

function BlockView({ block }: { block: ProposalBlock }) {
  if (block.type === "h2") return <h2>{block.text}</h2>;
  if (block.type === "h3") return <h3>{block.text}</h3>;
  if (block.type === "p") return <p>{block.text}</p>;
  if (block.type === "ul") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "table") {
    return (
      <div className="sow-table-wrap">
        <table className="sow-table">
          <thead>
            <tr>
              {block.headers.map((header, index) => (
                <th key={`${header}-${index}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.join("|")}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

export function ProposalDocument({ description, images }: { description: string; images: Shot[] }) {
  if (!isFormattedProposal(description)) {
    return (
      <>
        <p className="lede">{description}</p>
        {images.length ? <PhotoGrid images={images} /> : null}
      </>
    );
  }

  const blocks = parseProposal(description);
  const used = new Set<number>();
  const nodes: ReactNode[] = [];
  let cursor = 0;

  while (cursor < blocks.length) {
    const block = blocks[cursor];
    if (block.type === "meta") {
      const group: Extract<ProposalBlock, { type: "meta" }>[] = [];
      while (blocks[cursor]?.type === "meta") {
        group.push(blocks[cursor] as Extract<ProposalBlock, { type: "meta" }>);
        cursor += 1;
      }
      nodes.push(
        <div className="sow-meta" key={`meta-${cursor}`}>
          {group.map((item) => (
            <p key={item.label}>
              <span>{item.label}</span>
              <b>{item.value}</b>
            </p>
          ))}
        </div>,
      );
      continue;
    }

    if (block.type === "fee") {
      const group: Extract<ProposalBlock, { type: "fee" }>[] = [];
      while (blocks[cursor]?.type === "fee") {
        group.push(blocks[cursor] as Extract<ProposalBlock, { type: "fee" }>);
        cursor += 1;
      }
      nodes.push(
        <div className="sow-fees" key={`fees-${cursor}`}>
          {group.map((item) => (
            <section className="sow-fee" key={item.title}>
              <p>{item.title}</p>
              <strong>{item.price}</strong>
              <ul>
                {item.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>,
      );
      continue;
    }

    if (block.type === "image") {
      const group: Shot[] = [];
      const start = cursor;
      while (blocks[cursor]?.type === "image") {
        const shot = blocks[cursor] as Extract<ProposalBlock, { type: "image" }>;
        const image = images[shot.index - 1];
        used.add(shot.index - 1);
        if (image) group.push({ ...image, caption: shot.caption });
        cursor += 1;
      }
      if (group.length) nodes.push(<PhotoGrid key={`shots-${start}`} images={group} />);
      continue;
    }

    nodes.push(<BlockView key={`${block.type}-${cursor}`} block={block} />);
    cursor += 1;
  }

  const rest = images.filter((_, index) => !used.has(index));
  if (rest.length) nodes.push(<PhotoGrid key="rest" images={rest} />);

  return <div className="sow">{nodes}</div>;
}
