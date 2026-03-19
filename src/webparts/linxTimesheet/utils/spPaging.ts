import { IItems } from "@pnp/sp/items";

/**
 * Fetches all items matching a query by automatically paging through results.
 * PnPjs v4's async iterator follows odata.nextLink across pages, preserving
 * $filter, $select, $expand, $orderby, and $top (used as page size).
 *
 * Use this instead of `.top(N)()` when the result set may exceed a single page
 * (e.g., cross-employee queries for reporting or approvals).
 */
export async function fetchAllItems<T>(query: IItems): Promise<T[]> {
  const allItems: T[] = [];
  for await (const page of query) {
    allItems.push(...(page as T[]));
  }
  return allItems;
}
