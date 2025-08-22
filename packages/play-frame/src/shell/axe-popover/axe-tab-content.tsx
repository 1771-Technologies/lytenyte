import { ExternalLinkIcon, ViewNoneIcon } from "@radix-ui/react-icons";
import { Card, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { AxeSelector } from "./axe-selector.js";

export interface AxeTabContentProps {
  readonly results:
    | { id: string; description: string; selector: string; helpLink: string }[]
    | null;
}
export function AxeTabContent({ results }: AxeTabContentProps) {
  return (
    <>
      {!results?.length && (
        <Flex direction={"column"} justify="center" align="center" p="6">
          <ViewNoneIcon />
          <Text>Nothing to see here</Text>
        </Flex>
      )}
      {results?.map((c) => {
        return (
          <Card key={c.id + c.selector}>
            <Flex direction="column">
              <Flex align="center" justify="between">
                <Heading size="2">{c.id}</Heading>
                <Link
                  href={c.helpLink}
                  target="_blank"
                  size="1"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  Help
                  <ExternalLinkIcon width={12} />
                </Link>
              </Flex>
              <Text color="gray" size="2">
                {c.description}
              </Text>
              {c.selector && <AxeSelector selector={c.selector} />}
            </Flex>
          </Card>
        );
      })}
    </>
  );
}
