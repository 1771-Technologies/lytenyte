import { clsx, type ClassValue } from "clsx";
import type { JSX } from "react";
import { twMerge } from "tailwind-merge";

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export const TH = (props: JSX.IntrinsicElements["th"]) => {
  return (
    <th
      {...props}
      className={tw("text-xd-prose text-nowrap py-3.5 pl-4 pr-3 text-left text-sm sm:pl-3", props.className)}
    ></th>
  );
};

export const TR = (props: JSX.IntrinsicElements["tr"]) => {
  return <tr {...props} className={tw("even:bg-xd-card text-xd-prose", props.className)}></tr>;
};

export const TD = ({
  first,
  second,
  last,
  ...props
}: JSX.IntrinsicElements["td"] & { second?: boolean; first?: boolean; last?: boolean }) => {
  return (
    <td
      {...props}
      className={tw(
        "text-xd-prose text-nowrap px-3 py-4 text-sm",
        first && "bg-green-300 dark:bg-green-700 dark:text-white",
        second && "bg-yellow-200 dark:bg-yellow-600 dark:text-white",
        last && "bg-red-200 dark:bg-red-800 dark:text-white",
        props.className,
      )}
    ></td>
  );
};

export function SystemConfig() {
  return (
    <div className="border-xd-border my-8 overflow-auto rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <tbody>
          <TR>
            <TD>Machine</TD>
            <TD>MacBook Air</TD>
          </TR>
          <TR>
            <TD>System Chip</TD>
            <TD>Apple M4</TD>
          </TR>
          <TR>
            <TD>CPU</TD>
            <TD>10 Cores (4 performance and 6 efficiency</TD>
          </TR>
          <TR>
            <TD>Memory</TD>
            <TD>16 GB LPDDR5</TD>
          </TR>
          <TR>
            <TD>Storage</TD>
            <TD>250GB APFS on internal SSD</TD>
          </TR>
          <TR>
            <TD>OS</TD>
            <TD>macOS Sequoia v15.7.3</TD>
          </TR>
          <TR>
            <TD>Browser</TD>
            <TD>Chrome v149</TD>
          </TR>
          <TR>
            <TD>Display</TD>
            <TD>Dell U4021QW 39.5 Inch (5120x2160) @ 60hz</TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}

export function ScrollPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-auto rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Scrolling Performance Ratio</TH>
            <TH style={{ textAlign: "center" }}>LyteNyte</TH>
            <TH style={{ textAlign: "center" }}>AG Grid</TH>
            <TH style={{ textAlign: "center" }}>MUI</TH>
            <TH style={{ textAlign: "center" }}>DevExt</TH>
            <TH style={{ textAlign: "center" }}>Material</TH>
            <TH style={{ textAlign: "center" }}>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>10K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              140.4%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              81.1%
            </TD>
            <TD style={{ textAlign: "center" }}>75.6%</TD>
            <TD style={{ textAlign: "center" }}>31.5%</TD>
            <TD style={{ textAlign: "center" }} last>
              3.9%
            </TD>
            <TD style={{ textAlign: "center" }}>20.8%</TD>
          </TR>

          <TR>
            <TD>200K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              18.7%
            </TD>
            <TD style={{ textAlign: "center" }}>9.9%</TD>
            <TD style={{ textAlign: "center" }} second>
              10.1%
            </TD>
            <TD style={{ textAlign: "center" }}>5.2%</TD>
            <TD style={{ textAlign: "center" }} last>
              0.8%
            </TD>
            <TD style={{ textAlign: "center" }}>1.4%</TD>
          </TR>

          <TR>
            <TD>500K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              8.2%
            </TD>
            <TD style={{ textAlign: "center" }}>3.7%</TD>
            <TD style={{ textAlign: "center" }} second>
              4.2%
            </TD>
            <TD style={{ textAlign: "center" }}>2.3%</TD>
            <TD style={{ textAlign: "center" }} last>
              0.4%
            </TD>
            <TD style={{ textAlign: "center" }}>N/A</TD>
          </TR>

          <TR>
            <TD>1M Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              4.1%
            </TD>
            <TD style={{ textAlign: "center" }}>1.6%</TD>
            <TD style={{ textAlign: "center" }} second>
              2.1%
            </TD>
            <TD style={{ textAlign: "center" }} last>
              1.1%
            </TD>
            <TD style={{ textAlign: "center" }}>N/A</TD>
            <TD style={{ textAlign: "center" }}>N/A</TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}

export function SortPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-auto rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Sorting Performance Ratio</TH>
            <TH style={{ textAlign: "center" }}>LyteNyte</TH>
            <TH style={{ textAlign: "center" }}>AG Grid</TH>
            <TH style={{ textAlign: "center" }}>MUI</TH>
            <TH style={{ textAlign: "center" }}>DevExt</TH>
            <TH style={{ textAlign: "center" }}>Material</TH>
            <TH style={{ textAlign: "center" }}>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>10K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              162.9%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              84.6%
            </TD>
            <TD style={{ textAlign: "center" }}>84.3%</TD>
            <TD style={{ textAlign: "center" }} last>
              20.1%
            </TD>
            <TD style={{ textAlign: "center" }}>36.5%</TD>
            <TD style={{ textAlign: "center" }}>36.6%</TD>
          </TR>

          <TR>
            <TD>50K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              42.8%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              28.5%
            </TD>
            <TD style={{ textAlign: "center" }}>27.2%</TD>
            <TD style={{ textAlign: "center" }}>10.6%</TD>
            <TD style={{ textAlign: "center" }}>9.7%</TD>
            <TD style={{ textAlign: "center" }} last>
              4.1%
            </TD>
          </TR>

          <TR>
            <TD>100K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              19.5%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              16.6%
            </TD>
            <TD style={{ textAlign: "center" }}>13.2%</TD>
            <TD style={{ textAlign: "center" }}>7.9%</TD>
            <TD style={{ textAlign: "center" }}>4.7%</TD>
            <TD style={{ textAlign: "center" }} last>
              1.3%
            </TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}

export function FilterPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-auto rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Filtering Performance Ratio</TH>
            <TH style={{ textAlign: "center" }}>LyteNyte</TH>
            <TH style={{ textAlign: "center" }}>AG Grid</TH>
            <TH style={{ textAlign: "center" }}>MUI</TH>
            <TH style={{ textAlign: "center" }}>DevExt</TH>
            <TH style={{ textAlign: "center" }}>Material</TH>
            <TH style={{ textAlign: "center" }}>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>10K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              189.4%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              100.2%
            </TD>
            <TD style={{ textAlign: "center" }}>58.9%</TD>
            <TD style={{ textAlign: "center" }} last>
              20.0%
            </TD>
            <TD style={{ textAlign: "center" }}>31.7%</TD>
            <TD style={{ textAlign: "center" }}>34.1%</TD>
          </TR>

          <TR>
            <TD>50K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              54.3%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              36.5%
            </TD>
            <TD style={{ textAlign: "center" }}>23.4%</TD>
            <TD style={{ textAlign: "center" }}>12.8%</TD>
            <TD style={{ textAlign: "center" }}>10.5%</TD>
            <TD style={{ textAlign: "center" }} last>
              3.4%
            </TD>
          </TR>

          <TR>
            <TD>100K Rows (Avg. FPS / MB)</TD>
            <TD style={{ textAlign: "center" }} first>
              25.2%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              18.7%
            </TD>
            <TD style={{ textAlign: "center" }}>11.3%</TD>
            <TD style={{ textAlign: "center" }}>8.6%</TD>
            <TD style={{ textAlign: "center" }}>5.8%</TD>
            <TD style={{ textAlign: "center" }} last>
              1.1%
            </TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}

export function OtherPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-auto rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Performance Ratio</TH>
            <TH style={{ textAlign: "center" }}>LyteNyte</TH>
            <TH style={{ textAlign: "center" }}>AG Grid</TH>
            <TH style={{ textAlign: "center" }}>MUI</TH>
            <TH style={{ textAlign: "center" }}>DevExt</TH>
            <TH style={{ textAlign: "center" }}>Material</TH>
            <TH style={{ textAlign: "center" }}>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>Pinned 200K</TD>
            <TD style={{ textAlign: "center" }} first>
              18.7%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              9.2%
            </TD>
            <TD style={{ textAlign: "center" }}>9.0%</TD>
            <TD style={{ textAlign: "center" }}>5.1%</TD>
            <TD style={{ textAlign: "center" }} last>
              0.5%
            </TD>
            <TD style={{ textAlign: "center" }}>7.9%</TD>
          </TR>

          <TR>
            <TD>Horizontal 50K</TD>
            <TD style={{ textAlign: "center" }} first>
              61.1%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              48.6%
            </TD>
            <TD style={{ textAlign: "center" }}>47.5%</TD>
            <TD style={{ textAlign: "center" }}>6.7%</TD>
            <TD style={{ textAlign: "center" }} last>
              3.6%
            </TD>
            <TD style={{ textAlign: "center" }}>8.7%</TD>
          </TR>

          <TR>
            <TD>Cell Updates</TD>
            <TD style={{ textAlign: "center" }} first>
              116.9%
            </TD>
            <TD style={{ textAlign: "center" }} second>
              63.9%
            </TD>
            <TD style={{ textAlign: "center" }}>33.4%</TD>
            <TD style={{ textAlign: "center" }}>31.3%</TD>
            <TD style={{ textAlign: "center" }}>19.3%</TD>
            <TD style={{ textAlign: "center" }} last>
              12.5%
            </TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}
