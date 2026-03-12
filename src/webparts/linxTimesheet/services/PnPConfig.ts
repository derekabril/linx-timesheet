import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";

let _sp: SPFI | undefined;

/**
 * Initialize or retrieve the PnPjs SPFI singleton.
 * Must be called with context once (in WebPart.onInit) before any service usage.
 */
export const getSP = (context?: WebPartContext, siteUrl?: string): SPFI => {
  if (context) {
    const base = siteUrl ? spfi(siteUrl) : spfi();
    _sp = base.using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  if (!_sp) {
    throw new Error(
      "PnPjs SPFI not initialized. Call getSP(context) in WebPart.onInit first."
    );
  }
  return _sp;
};
