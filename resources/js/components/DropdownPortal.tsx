import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownPortalProps {
  children: React.ReactNode;
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
}

export function DropdownPortal({ children, anchorRef, open }: DropdownPortalProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && anchorRef.current && menuRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      menuRef.current.style.position = "fixed";
      menuRef.current.style.top = `${rect.bottom}px`;
      menuRef.current.style.left = `${rect.right - 192}px`; // 192px = w-48
      menuRef.current.style.zIndex = "9999";
    }
  }, [open, anchorRef]);

  if (!open) return null;
  return createPortal(
    <div ref={menuRef}>{children}</div>,
    document.body
  );
}
