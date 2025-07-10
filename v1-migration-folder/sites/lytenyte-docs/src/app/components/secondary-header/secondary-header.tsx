import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { LyteNyteLogo } from "../ui/logos/lytenyte-logo";
import { Separator } from "../ui/separator";
import { ActiveLink } from "./active-link";

export function SecondaryHeader() {
  return (
    <div className="flex h-12 items-center gap-4">
      <div className="flex h-full gap-8 py-2">
        <LyteNyteLogo width={100} />
        <Separator />
      </div>
      <div className="h-full flex-1">
        <ul className="flex h-full items-center gap-2">
          <li className="h-full">
            <ActiveLink to="/" match="/" exclude={["/reference", "/changelog"]}>
              Guides
            </ActiveLink>
          </li>
          <li className="h-full">
            <ActiveLink to="/reference" match="/reference" exclude={[]}>
              API Reference
            </ActiveLink>
          </li>
          <li className="h-full">
            <ActiveLink to="/changelog" match="/changelog" exclude={[]}>
              Changelog
            </ActiveLink>
          </li>
          <li className="h-full">
            <ActiveLink
              to="https://github.com/1771-Technologies/lytenyte"
              className="flex items-center gap-2"
              target="_blank"
              match="https://github.com/1771-Technologies/lytenyte"
              exclude={[]}
            >
              GitHub
              <GitHubLogoIcon />
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <div>Open Source</div>
        <div>Help</div>
      </div>
    </div>
  );
}
