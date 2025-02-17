import { Badge } from "./ui/badge";

export const ListBadges = ({ items }: { items?: string[] }) => (
  <div className="flex flex-wrap justify-center gap-1">
    {!items || items.length === 0 ? (
      <Badge variant="outline">-</Badge>
    ) : (
      items.toSorted().map((space, index) => (
        <Badge key={index} variant="outline">
          {space}
        </Badge>
      ))
    )}
  </div>
);
