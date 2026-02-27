import { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Plus,
  Calendar,
  MessageCircle,
  GripVertical,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { kanbanColumns, type KanbanCard, type KanbanStatus, type KanbanColumn } from "../data/mockData";

const ITEM_TYPE = "CARD";

const riskConfig: Record<string, { bg: string; text: string; icon?: boolean }> = {
  Low: { bg: "bg-green-50 border-green-200", text: "text-green-700" },
  Medium: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  High: { bg: "bg-red-50 border-red-200", text: "text-red-700" },
};

const columnColorMap: Record<string, { header: string; dot: string; count: string }> = {
  Draft: { header: "bg-slate-100 text-slate-600", dot: "bg-slate-400", count: "bg-slate-200 text-slate-600" },
  "Under Review": { header: "bg-blue-50 text-blue-700", dot: "bg-blue-400", count: "bg-blue-100 text-blue-700" },
  "QA Validation": { header: "bg-amber-50 text-amber-700", dot: "bg-amber-400", count: "bg-amber-100 text-amber-700" },
  Approved: { header: "bg-green-50 text-green-700", dot: "bg-green-400", count: "bg-green-100 text-green-700" },
  Deployed: { header: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-400", count: "bg-indigo-100 text-indigo-700" },
};

interface DragItem {
  id: string;
  fromColumn: KanbanStatus;
}

interface CardProps {
  card: KanbanCard;
  columnId: KanbanStatus;
  onOpen: (card: KanbanCard) => void;
}

function KanbanCardComponent({ card, columnId, onOpen }: CardProps) {
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: ITEM_TYPE,
    item: { id: card.id, fromColumn: columnId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const risk = riskConfig[card.risk];

  return (
    <motion.div
      ref={dragRef as any}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      onClick={() => onOpen(card)}
      className="bg-white rounded-xl border border-slate-200 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 group"
      style={{
        boxShadow: isDragging ? "0 12px 40px rgba(0,0,0,0.18)" : "0 1px 3px rgba(0,0,0,0.05)",
        transform: isDragging ? "rotate(2deg) scale(1.02)" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-slate-400 font-mono flex-shrink-0" style={{ fontWeight: 600 }}>{card.id}</span>
          {card.risk === "High" && <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />}
        </div>
        <GripVertical size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors flex-shrink-0" />
      </div>

      <p className="text-sm text-slate-900 mb-3" style={{ fontWeight: 600, lineHeight: 1.4 }}>{card.title}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {card.tags.map((tag) => (
          <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-sm flex-shrink-0 ${card.assignee.color}`}
            style={{ fontWeight: 700 }}
            title={card.assignee.name}
          >
            {card.assignee.initials}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${risk.bg} ${risk.text}`} style={{ fontWeight: 500 }}>
            {card.risk}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {card.activity > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MessageCircle size={11} /> {card.activity}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            {card.dueDate.replace(", 2026", "")}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400 font-mono">{card.version}</span>
      </div>
    </motion.div>
  );
}

interface ColumnProps {
  column: KanbanColumn;
  onDrop: (cardId: string, fromColumn: KanbanStatus, toColumn: KanbanStatus) => void;
  onOpen: (card: KanbanCard) => void;
}

function KanbanColumnComponent({ column, onDrop, onOpen }: ColumnProps) {
  const [{ isOver, canDrop }, dropRef] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: ITEM_TYPE,
    drop: (item) => {
      if (item.fromColumn !== column.id) {
        onDrop(item.id, item.fromColumn, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const colors = columnColorMap[column.id];

  return (
    <div
      ref={dropRef as any}
      className={`flex flex-col rounded-xl min-w-[272px] w-[272px] flex-shrink-0 transition-all duration-200 ${isOver && canDrop ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}
      style={{ background: isOver ? "rgba(99, 102, 241, 0.03)" : "transparent" }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <span className="text-sm text-slate-800" style={{ fontWeight: 700 }}>{column.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${colors.count}`} style={{ fontWeight: 600 }}>
            {column.cards.length}
          </span>
        </div>
        <button className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 px-1 flex-1">
        <AnimatePresence>
          {column.cards.map((card) => (
            <KanbanCardComponent key={card.id} card={card} columnId={column.id} onOpen={onOpen} />
          ))}
        </AnimatePresence>

        {column.cards.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <p className="text-xs text-slate-400">Drop cards here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CardDetailDrawer({ card, onClose }: { card: KanbanCard; onClose: () => void }) {
  const [comment, setComment] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
      style={{ backdropFilter: "blur(2px)", background: "rgba(15, 23, 42, 0.3)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <div>
            <span className="text-xs text-slate-400 font-mono" style={{ fontWeight: 600 }}>{card.id}</span>
            <h2 className="text-slate-900 mt-1" style={{ fontSize: "16px" }}>{card.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Version</p>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-mono" style={{ fontWeight: 600 }}>{card.version}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Risk Level</p>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${riskConfig[card.risk].bg} ${riskConfig[card.risk].text}`} style={{ fontWeight: 500 }}>
                {card.risk} Risk
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Assignee</p>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${card.assignee.color}`} style={{ fontWeight: 700 }}>
                  {card.assignee.initials}
                </div>
                <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{card.assignee.name}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Due Date</p>
              <div className="flex items-center gap-1 text-sm text-slate-700">
                <Calendar size={13} className="text-slate-400" />
                {card.dueDate}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs text-slate-500 mb-2" style={{ fontWeight: 600 }}>Labels</p>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Quality Review */}
          <div>
            <p className="text-xs text-slate-500 mb-3" style={{ fontWeight: 600 }}>Automated Test Results</p>
            <div className="space-y-2">
              {[
                { label: "Tone & Sentiment", score: 92, pass: true },
                { label: "Grammar & Clarity", score: 87, pass: true },
                { label: "Brand Alignment", score: card.risk === "High" ? 61 : 78, pass: card.risk !== "High" },
                { label: "Safety Filters", score: 100, pass: true },
                { label: "Length Compliance", score: 95, pass: true },
              ].map((test) => (
                <div key={test.label} className="flex items-center gap-3">
                  {test.pass ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                  <span className="text-xs text-slate-700 flex-1" style={{ fontWeight: 500 }}>{test.label}</span>
                  <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${test.score >= 80 ? "bg-green-500" : test.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${test.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-6 text-right" style={{ fontWeight: 600 }}>{test.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <p className="text-xs text-slate-500 mb-3" style={{ fontWeight: 600 }}>Comments ({card.activity})</p>
            {card.activity > 0 && (
              <div className="space-y-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${card.assignee.color}`} style={{ fontWeight: 700 }}>
                    {card.assignee.initials}
                  </div>
                  <div className="bg-slate-50 rounded-xl rounded-tl-sm p-3 flex-1">
                    <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>{card.assignee.name} · 2h ago</p>
                    <p className="text-sm text-slate-700">Updated the tone parameters to be more conversational. Please review the changes in the diff view.</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button
                onClick={() => { if (comment) { toast.success("Comment added"); setComment(""); } }}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-3 flex-shrink-0 bg-slate-50">
          <button
            onClick={() => { toast.error(`${card.id} has been rejected.`); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm border border-red-200"
            style={{ fontWeight: 600 }}
          >
            <XCircle size={15} /> Reject
          </button>
          <button
            onClick={() => { toast.success(`${card.id} has been approved!`); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <CheckCircle size={15} /> Approve
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ChangeRequests() {
  const [columns, setColumns] = useState<KanbanColumn[]>(kanbanColumns);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);

  const handleDrop = useCallback((cardId: string, fromColumn: KanbanStatus, toColumn: KanbanStatus) => {
    setColumns((prev) => {
      const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const src = next.find((c) => c.id === fromColumn);
      const dst = next.find((c) => c.id === toColumn);
      if (!src || !dst) return prev;
      const cardIdx = src.cards.findIndex((c) => c.id === cardId);
      if (cardIdx === -1) return prev;
      const [card] = src.cards.splice(cardIdx, 1);
      dst.cards.unshift(card);
      return next;
    });
    toast.success(`Moved to "${toColumn}"`);
  }, []);

  const totalCards = columns.reduce((s, c) => s + c.cards.length, 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 h-full flex flex-col max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-shrink-0">
          <div>
            <h1 className="text-slate-900 mb-1">Change Requests</h1>
            <p className="text-sm text-slate-500">
              Track and manage change requests across the full approval lifecycle · {totalCards} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors bg-white" style={{ fontWeight: 500 }}>
              <ChevronDown size={15} /> Filter
            </button>
            <button
              onClick={() => toast.info("Opening change request form…")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm"
              style={{ fontWeight: 600 }}
            >
              <Plus size={16} /> New Request
            </button>
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-4 h-full" style={{ minWidth: "max-content" }}>
            {columns.map((column) => (
              <KanbanColumnComponent
                key={column.id}
                column={column}
                onDrop={handleDrop}
                onOpen={setSelectedCard}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card Detail Drawer */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailDrawer card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </DndProvider>
  );
}
