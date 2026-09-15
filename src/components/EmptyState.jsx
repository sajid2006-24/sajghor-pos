export default function EmptyState({ icon, title, desc, action }){
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-slate-200">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl mb-4">{icon||'📦'}</div>
      <h3 className="text-[18px] font-semibold text-slate-900">{title}</h3>
      {desc && <p className="text-sm text-slate-500 mt-1 max-w-md">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
