import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";

let _graphClient: MSGraphClientV3 | undefined;

/**
 * Initialize or retrieve the Microsoft Graph client singleton.
 * Must be called with context once (in WebPart.onInit) before any Graph usage.
 */
export const getGraphClient = async (context?: WebPartContext): Promise<MSGraphClientV3> => {
  if (context) {
    _graphClient = await context.msGraphClientFactory.getClient("3");
  }
  if (!_graphClient) {
    throw new Error(
      "Graph client not initialized. Call getGraphClient(context) in WebPart.onInit first."
    );
  }
  return _graphClient;
};
