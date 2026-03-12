import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import App from "./components/App";
import { getSP } from "./services/PnPConfig";

export interface ILinxTimesheetWebPartProps {
  title: string;
}

export default class LinxTimesheetWebPart extends BaseClientSideWebPart<ILinxTimesheetWebPartProps> {
  protected async onInit(): Promise<void> {
    await super.onInit();

    // When running inside Teams, the default context points to the Team's
    // underlying SharePoint site, which may differ from the site where the
    // web part (and its lists) are actually hosted. Detect this and pass
    // the correct site URL so PnPjs always targets the right site.
    let siteUrl: string | undefined;
    if (this.context.sdks.microsoftTeams) {
      // In Teams the default context points to the Team's underlying site,
      // not the site where the timesheet lists are provisioned. Always
      // target the dedicated timesheets site.
      siteUrl = "https://linxconsultingoffice.sharepoint.com/sites/timesheets";
    }

    getSP(this.context, siteUrl);
  }

  public render(): void {
    const element = React.createElement(App, {
      context: this.context,
      title: this.properties.title || "LINX Timesheet",
    });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "LINX Timesheet Settings" },
          groups: [
            {
              groupName: "General",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Web Part Title",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
