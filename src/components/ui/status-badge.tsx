import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Scheduled' | 'Cancelled' | 'Positive' | 'Negative';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Pending':
      case 'Scheduled':
        return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'Approved':
      case 'Completed':
      case 'Negative':
        return 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20';
      case 'Rejected':
      case 'Cancelled':
      case 'Positive':
        return 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge variant="outline" className={`font-medium ${getStatusStyles()}`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
