import { clsx, type ClassValue } from "clsx";
import type { JSX } from "react";
import { twMerge } from "tailwind-merge";

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

const TH = (props: JSX.IntrinsicElements["th"]) => {
  return (
    <th
      {...props}
      className={tw("text-xd-prose py-3.5 pl-4 pr-3 text-left text-sm sm:pl-3", props.className)}
    ></th>
  );
};

const TR = (props: JSX.IntrinsicElements["tr"]) => {
  return <tr {...props} className={tw("even:bg-xd-card text-xd-prose", props.className)}></tr>;
};

const TD = ({
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

export function ScrollPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-hidden rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Scrolling Performance Ratio</TH>
            <TH>LyteNyte</TH>
            <TH>AG Grid</TH>
            <TH>MUI</TH>
            <TH>Material</TH>
            <TH>DevExt</TH>
            <TH>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>10K Rows (Avg. FPS / MB)</TD>
            <TD first>140.4%</TD>
            <TD second>81.1%</TD>
            <TD>75.6%</TD>
            <TD last>3.9%</TD>
            <TD>31.5%</TD>
            <TD>20.8%</TD>
          </TR>

          <TR>
            <TD>200K Rows (Avg. FPS / MB)</TD>
            <TD first>18.7%</TD>
            <TD>9.9%</TD>
            <TD second>10.1%</TD>
            <TD last>0.8%</TD>
            <TD>5.2%</TD>
            <TD>1.4%</TD>
          </TR>

          <TR>
            <TD>500K Rows (Avg. FPS / MB)</TD>
            <TD first>8.2%</TD>
            <TD>3.7%</TD>
            <TD second>4.2%</TD>
            <TD last>0.4%</TD>
            <TD>2.3%</TD>
            <TD>N/A</TD>
          </TR>

          <TR>
            <TD>1M Rows (Avg. FPS / MB)</TD>
            <TD first>4.1%</TD>
            <TD>1.6%</TD>
            <TD second>2.1%</TD>
            <TD>N/A</TD>
            <TD last>1.1%</TD>
            <TD>N/A</TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}

export function SortPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-hidden rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Sorting Performance Ratio</TH>
            <TH>LyteNyte</TH>
            <TH>AG Grid</TH>
            <TH>MUI</TH>
            <TH>Material</TH>
            <TH>DevExt</TH>
            <TH>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>10K Rows (Avg. FPS / MB)</TD>
            <TD first>162.9%</TD>
            <TD second>84.6%</TD>
            <TD>84.3%</TD>
            <TD>36.5%</TD>
            <TD last>20.1%</TD>
            <TD>36.6%</TD>
          </TR>

          <TR>
            <TD>50K Rows (Avg. FPS / MB)</TD>
            <TD first>42.8%</TD>
            <TD second>28.5%</TD>
            <TD>27.2%</TD>
            <TD>9.7%</TD>
            <TD>10.6%</TD>
            <TD last>4.1%</TD>
          </TR>

          <TR>
            <TD>100K Rows (Avg. FPS / MB)</TD>
            <TD first>19.5%</TD>
            <TD second>16.6%</TD>
            <TD>13.2%</TD>
            <TD>4.7%</TD>
            <TD>7.9%</TD>
            <TD last>1.3%</TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}

export function FilterPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-hidden rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Filter Performance Ratio</TH>
            <TH>LyteNyte</TH>
            <TH>AG Grid</TH>
            <TH>MUI</TH>
            <TH>Material</TH>
            <TH>DevExt</TH>
            <TH>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>10K Rows (Avg. FPS / MB)</TD>
            <TD first>189.4%</TD>
            <TD second>100.2%</TD>
            <TD>58.9%</TD>
            <TD>31.7%</TD>
            <TD last>20.0%</TD>
            <TD>34.1%</TD>
          </TR>

          <TR>
            <TD>50K Rows (Avg. FPS / MB)</TD>
            <TD first>54.3%</TD>
            <TD second>36.5%</TD>
            <TD>23.4%</TD>
            <TD>10.5%</TD>
            <TD>12.8%</TD>
            <TD last>3.4%</TD>
          </TR>

          <TR>
            <TD>100K Rows (Avg. FPS / MB)</TD>
            <TD first>25.2%</TD>
            <TD second>18.7%</TD>
            <TD>11.3%</TD>
            <TD>5.8%</TD>
            <TD>8.6%</TD>
            <TD last>1.1%</TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}

export function OtherPerformance() {
  return (
    <div className="border-xd-border my-8 overflow-hidden rounded-xl border p-px">
      <table className="divide-xd-border relative w-full min-w-full divide-y">
        <thead>
          <TR>
            <TH>Performance Ratio</TH>
            <TH>LyteNyte</TH>
            <TH>AG Grid</TH>
            <TH>MUI</TH>
            <TH>Material</TH>
            <TH>DevExt</TH>
            <TH>Handson</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>Pinned 200K</TD>
            <TD first>18.7%</TD>
            <TD second>9.2%</TD>
            <TD>9.0%</TD>
            <TD last>0.5%</TD>
            <TD>5.1%</TD>
            <TD>7.9%</TD>
          </TR>

          <TR>
            <TD>Horizontal 50K</TD>
            <TD first>61.1%</TD>
            <TD second>48.6%</TD>
            <TD>47.5%</TD>
            <TD last>3.6%</TD>
            <TD>6.7%</TD>
            <TD>8.7%</TD>
          </TR>

          <TR>
            <TD>Cell Updates</TD>
            <TD first>116.9%</TD>
            <TD second>63.9%</TD>
            <TD>33.4%</TD>
            <TD>19.3%</TD>
            <TD>31.3%</TD>
            <TD last>12.5%</TD>
          </TR>
        </tbody>
      </table>
    </div>
  );
}
