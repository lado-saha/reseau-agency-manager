import { Badge } from "./ui/badge";

export const ListBadges = ({ items}: { items?: string[] }) => {
  if (!items || items.length === 0) {
    return <Badge variant="outline">-</Badge>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.toSorted().map((space, index) => (
        <Badge key={index} variant="outline">
          {space}
        </Badge>
      ))}
    </div>
  );
};
