"use client"

import type { JSONContent } from "@tiptap/core"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useMemo, useState } from "react"
import styles from "./tiptap.module.css"

interface EditorPayload {
  html: string
  json: JSONContent
  text: string
}

interface Props {
  initialContent?: JSONContent | string
  placeholder?: string
  onChange?: (payload: EditorPayload) => void
}

export default function Tiptap({
  initialContent = "<p></p>",
  placeholder = "내용을 입력하세요…",
  onChange,
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },

        // ✅ 여기서 true로 넣으면 타입 에러가 나.
        // codeBlock/blockquote를 커스터마이즈하고 싶으면 아래처럼 "옵션 객체"로 켜야 함.
        // codeBlock: {},
        // blockquote: {},

        // 사실 StarterKit 기본값으로 둘 다 활성화되어 있어서 생략해도 문제 없음.
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder]
  )

  const editor = useEditor({
    extensions,
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.editor as string, // ✅ CSS module class
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.({
        html: editor.getHTML(),
        json: editor.getJSON(), // JSONContent로 반환됨
        text: editor.getText(),
      })
    },
  })

  if (!mounted) return null

  const setLink = () => {
    if (!editor) return
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("링크 주소를 입력하세요", prev ?? "")
    if (url === null) return

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar} role="toolbar" aria-label="에디터 툴바">
        <div className={styles.group}>
          <button
            type="button"
            className={
              editor?.isActive("heading", { level: 1 }) ? styles.active : ""
            }
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            disabled={!editor}
          >
            H1
          </button>
          <button
            type="button"
            className={
              editor?.isActive("heading", { level: 2 }) ? styles.active : ""
            }
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            disabled={!editor}
          >
            H2
          </button>
          <button
            type="button"
            className={
              editor?.isActive("heading", { level: 3 }) ? styles.active : ""
            }
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            disabled={!editor}
          >
            H3
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={editor?.isActive("bold") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor}
          >
            B
          </button>
          <button
            type="button"
            className={editor?.isActive("italic") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor}
          >
            I
          </button>
          <button
            type="button"
            className={editor?.isActive("strike") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editor}
          >
            S
          </button>
          <button
            type="button"
            className={editor?.isActive("code") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={!editor}
          >
            {"</>"}
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={editor?.isActive("bulletList") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor}
          >
            • List
          </button>
          <button
            type="button"
            className={editor?.isActive("orderedList") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor}
          >
            1. List
          </button>
          <button
            type="button"
            className={editor?.isActive("blockquote") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            disabled={!editor}
          >
            “ ”
          </button>
          <button
            type="button"
            className={editor?.isActive("codeBlock") ? styles.active : ""}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            disabled={!editor}
          >
            Code
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <button
            type="button"
            className={editor?.isActive("link") ? styles.active : ""}
            onClick={setLink}
            disabled={!editor}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().unsetLink().run()}
            disabled={!editor?.isActive("link")}
          >
            Unlink
          </button>
        </div>

        <div className={styles.spacer} />

        <div className={styles.group}>
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            Redo
          </button>
        </div>
      </div>

      <div className={styles.surface}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
