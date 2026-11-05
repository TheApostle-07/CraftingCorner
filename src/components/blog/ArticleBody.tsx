import { Fragment, type ReactNode } from "react";
import { articleHeadings, safeImage, safeLink } from "@/lib/blog/content";
import type { RichDocument, RichNode } from "@/lib/blog/types";
import BlogImage from "./BlogImage";

export default function ArticleBody({ document }: { document: RichDocument }) {
  const headings = articleHeadings(document);
  let headingIndex = 0;
  function render(node: RichNode, index: number, depth = 0): ReactNode {
    const key = `${depth}-${index}`;
    const content = node.content?.map((child, i) =>
      render(child, i, depth + 1),
    );
    if (node.type === "text") {
      let text: ReactNode = node.text || "";
      for (const mark of node.marks || []) {
        if (mark.type === "bold")
          text = <strong key={mark.type}>{text}</strong>;
        if (mark.type === "italic") text = <em key={mark.type}>{text}</em>;
        if (mark.type === "underline") text = <u key={mark.type}>{text}</u>;
        if (mark.type === "strike") text = <s key={mark.type}>{text}</s>;
        if (mark.type === "code") text = <code key={mark.type}>{text}</code>;
        if (mark.type === "link" && safeLink(mark.attrs?.href))
          text = (
            <a
              key={mark.type}
              href={String(mark.attrs!.href)}
              target={
                String(mark.attrs!.href).startsWith("https:")
                  ? "_blank"
                  : undefined
              }
              rel="noopener noreferrer"
            >
              {text}
            </a>
          );
      }
      return <span key={key}>{text}</span>;
    }
    if (node.type === "doc") return <Fragment key={key}>{content}</Fragment>;
    if (node.type === "paragraph")
      return <p key={key}>{content?.length ? content : <br />}</p>;
    if (node.type === "hardBreak") return <br key={key} />;
    if (node.type === "heading") {
      const id = depth === 1 ? headings[headingIndex++]?.id : undefined;
      const Tag =
        Number(node.attrs?.level) === 3
          ? "h3"
          : Number(node.attrs?.level) === 4
            ? "h4"
            : "h2";
      return (
        <Tag key={key} id={id}>
          {content}
        </Tag>
      );
    }
    if (node.type === "bulletList") return <ul key={key}>{content}</ul>;
    if (node.type === "orderedList")
      return (
        <ol key={key} start={Number(node.attrs?.start) || 1}>
          {content}
        </ol>
      );
    if (node.type === "listItem") return <li key={key}>{content}</li>;
    if (node.type === "blockquote")
      return <blockquote key={key}>{content}</blockquote>;
    if (node.type === "horizontalRule") return <hr key={key} />;
    if (node.type === "codeBlock")
      return (
        <pre key={key}>
          <code>{content}</code>
        </pre>
      );
    if (node.type === "table")
      return (
        <div
          key={key}
          className="article-table"
          tabIndex={0}
          role="region"
          aria-label="Article table"
        >
          <table>
            <tbody>{content}</tbody>
          </table>
        </div>
      );
    if (node.type === "tableRow") return <tr key={key}>{content}</tr>;
    if (node.type === "tableCell" || node.type === "tableHeader") {
      const Tag = node.type === "tableHeader" ? "th" : "td";
      return (
        <Tag
          key={key}
          colSpan={Number(node.attrs?.colspan) || 1}
          rowSpan={Number(node.attrs?.rowspan) || 1}
        >
          {content}
        </Tag>
      );
    }
    if (node.type === "image" && safeImage(node.attrs?.src))
      return (
        <figure key={key}>
          <BlogImage
            src={String(node.attrs!.src)}
            alt={String(node.attrs?.alt || "")}
            width={Number(node.attrs?.width) || 1333}
            height={Number(node.attrs?.height) || 2000}
          />
          {node.attrs?.caption ? (
            <figcaption>{String(node.attrs.caption)}</figcaption>
          ) : null}
        </figure>
      );
    return null;
  }
  return <div className="article-prose">{render(document, 0)}</div>;
}
