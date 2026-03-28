import type { Holding } from "../types";
import { CATEGORIES, CATEGORY_LABELS } from "../lib/constants";
import { holdingValueJpy } from "../lib/storage";
import { HoldingItem } from "./HoldingItem";

interface HoldingListProps {
  readonly holdings: readonly Holding[];
  readonly usdJpyRate: number;
  readonly onEdit: (holding: Holding) => void;
  readonly onDelete: (id: string) => void;
}

export function HoldingList({ holdings, usdJpyRate, onEdit, onDelete }: HoldingListProps): React.JSX.Element {
  if (holdings.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-400">No holdings yet. Add your first asset above.</p>;
  }

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: holdings.filter((h) => h.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">{group.label}</h3>
          <div className="space-y-2">
            {group.items.map((h) => (
              <HoldingItem key={h.id} holding={h} jpyValue={holdingValueJpy(h, usdJpyRate)} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
