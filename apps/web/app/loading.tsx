export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-[80] h-1 overflow-hidden bg-[#F0EEFF]" aria-live="polite" aria-label="Loading workspace">
      <div className="h-full w-1/3 animate-[workspace-loading_1s_ease-in-out_infinite] rounded-r-full bg-[#7367F0]" />
    </div>
  )
}
