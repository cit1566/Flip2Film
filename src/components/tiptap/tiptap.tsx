"use client"

import type { JSONContent } from "@tiptap/core"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  TextQuote,
} from "lucide-react"
import { useCallback, useMemo, useRef } from "react"
import uploadImage from "../../libs/api/posting-api"
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
  const inputRef = useRef<HTMLInputElement | null>(null)

  const extensions = useMemo(() => {
    return [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
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

      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      Placeholder.configure({
        placeholder,
      }),
    ]
  }, [placeholder])

  const editor = useEditor({
    extensions,
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.editor ?? "",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.({
        html: editor.getHTML(),
        json: editor.getJSON(),
        text: editor.getText(),
      })
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("링크 주소를 입력하세요", prev ?? "")
    if (url === null) return

    const next = url.trim()

    if (next === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: next }).run()
  }, [editor])

  const openPicker = () => inputRef.current?.click()

  const onChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    e.target.value = "" // 같은 파일 재선택 가능

    // 3) 업로드 → URL 받기
    const url = await uploadImage("draft", _, file)

    // 4) 에디터에 삽입
    editor.chain().focus().setImage({ src: url, alt: file.name }).run()
  }

  // SSR/초기 로딩 안전 처리
  if (!editor) {
    return (
      <div className={styles.wrap}>
        <div className={styles.toolbar} aria-label="에디터 툴바" />
        <div className={styles.surface} />
      </div>
    )
  }

  const btnClass = (active: boolean) => (active ? styles.active : "")

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar} role="toolbar" aria-label="에디터 툴바">
        {/* Headings */}
        <div className={styles.group}>
          <button
            type="button"
            className={btnClass(editor.isActive("heading", { level: 1 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 />
          </button>
          <button
            type="button"
            className={btnClass(editor.isActive("heading", { level: 2 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 />
          </button>
          <button
            type="button"
            className={btnClass(editor.isActive("heading", { level: 3 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Inline styles */}
        <div className={styles.group}>
          <button
            type="button"
            className={btnClass(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </button>

          <button
            type="button"
            className={btnClass(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </button>

          <button
            type="button"
            className={btnClass(editor.isActive("strike"))}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            S
          </button>

          <button
            type="button"
            className={btnClass(editor.isActive("code"))}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            {"</>"}
          </button>
        </div>

        <div className={styles.divider} />

        {/* Lists / blocks */}
        <div className={styles.group}>
          <button
            type="button"
            className={btnClass(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List />
          </button>

          <button
            type="button"
            className={btnClass(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered />
          </button>

          <button
            type="button"
            className={btnClass(editor.isActive("blockquote"))}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <TextQuote />
          </button>

          <button
            type="button"
            className={btnClass(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Link */}
        <div className={styles.group}>
          <button
            type="button"
            className={btnClass(editor.isActive("link"))}
            onClick={setLink}
          >
            <Link2 />
          </button>

          <div>
            <button
              type="button"
              onClick={openPicker}
              disabled={!editor}
              className={btnClass(editor.isActive("image"))}
            >
              <ImageIcon />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onChanges}
              hidden
            />
          </div>
        </div>

        <div className={styles.spacer} />

        {/* History */}
        <div className={styles.group}>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
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
