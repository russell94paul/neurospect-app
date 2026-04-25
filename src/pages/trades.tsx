import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { TradeCard } from '@/components/trade/trade-card';
import { TradeFilters } from '@/components/trade/trade-filters';
import { useTrades, type TradeFilters as TFilters } from '@/hooks/use-trades';

export function TradesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const filters: TFilters = {
    date_start: searchParams.get('date_start') ?? undefined,
    date_end: searchParams.get('date_end') ?? undefined,
    instrument: searchParams.get('instrument') ?? undefined,
    session: searchParams.get('session') ?? undefined,
    setup_type: searchParams.get('setup_type') ?? undefined,
    outcome: searchParams.get('outcome') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    page,
    page_size: 20,
  };

  const { data, isLoading } = useTrades(filters);

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 1;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Trades</h1>
        <Button asChild size="sm">
          <Link to="/trades/new">
            <Plus className="mr-1 h-4 w-4" />
            New Trade
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <TradeFilters />

      {/* Trade List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">No trades found.</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/trades/new">Log your first trade</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.items.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && totalPages > 1 && (
        <Pagination className="mt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={page > 1 ? () => goToPage(page - 1) : undefined}
                className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {page} of {totalPages} ({data.total} trades)
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={page < totalPages ? () => goToPage(page + 1) : undefined}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
